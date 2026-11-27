import CryptoJS from "crypto-js";

const MAX_FILE_BYTES = 1536 * 1024 * 1024;

const RETRYABLE_STATUS = new Set([
  0, 408, 429, 500, 502, 503, 504,
]);

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function responseError(result, status) {
  let message =
    result?.message ||
    `Permintaan gagal (HTTP ${status || "jaringan"}).`;

  if (
    result?.message === "Exception throwable" &&
    typeof result?.data === "string" &&
    result.data
  ) {
    message = result.data;
  }

  const errors =
    result?.errors ||
    (result?.data && typeof result.data === "object"
      ? result.data
      : null);

  if (errors) {
    const messages = Object.values(errors)
      .filter(Array.isArray)
      .flat();

    if (messages.length) {
      message = messages.join(" ");
    }
  }

  const error = new Error(message);
  error.status = status;

  return error;
}

export async function archiveRequest({
  baseUrl,
  path,
  token,
  body,
  onProgress,
  retry = false,
}) {
  if (!baseUrl) {
    throw new Error("Alamat API belum dikonfigurasi.");
  }

  if (!token) {
    throw new Error("Sesi login sudah berakhir. Silakan login ulang.");
  }

  const url =
    `${baseUrl.replace(/\/+$/, "")}/` +
    path.replace(/^\/+/, "");

  for (let attempt = 0; ; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", url);
        xhr.timeout = 300000;

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("Accept", "application/json");

        if (!(body instanceof FormData)) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }

        if (onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress(
                Math.min(event.loaded / event.total, 1),
              );
            }
          };
        }

        xhr.onload = () => {
          let result = null;

          try {
            result = JSON.parse(xhr.responseText);
          } catch {
            // Contohnya halaman HTML dari proxy atau server.
          }

          if (
            xhr.status >= 200 &&
            xhr.status < 300 &&
            result?.success === true
          ) {
            resolve(result);
            return;
          }

          const error = responseError(result, xhr.status);

          if (!result) {
            error.message =
              `Server mengembalikan respons non-JSON ` +
              `(HTTP ${xhr.status}).`;
          }

          reject(error);
        };

        xhr.onerror = () => {
          reject(responseError(null, 0));
        };

        xhr.ontimeout = () => {
          reject(
            responseError(
              { message: "Permintaan melewati batas waktu." },
              408,
            ),
          );
        };

        xhr.onabort = () => {
          reject(
            responseError(
              { message: "Upload dibatalkan." },
              499,
            ),
          );
        };

        xhr.send(
          body instanceof FormData
            ? body
            : JSON.stringify(body),
        );
      });
    } catch (error) {
      if (
        !retry ||
        attempt >= 2 ||
        !RETRYABLE_STATUS.has(error.status)
      ) {
        throw error;
      }

      await delay(750 * 2 ** attempt);
    }
  }
}

export async function uploadArchiveFile({
  baseUrl,
  token,
  file,
  onProgress = () => {},
}) {
  if (!(file instanceof File) || file.size < 1) {
    throw new Error("Pilih file yang tidak kosong.");
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Ukuran file maksimal 1536 MiB.");
  }

  if (!/\.(pdf|zip|rar)$/i.test(file.name)) {
    throw new Error("Format file harus PDF, ZIP, atau RAR.");
  }

  let uploadId;
  let completing = false;

  try {
    const init = await archiveRequest({
      baseUrl,
      token,
      path: "/archive/uploads/init",
      body: {
        filename: file.name,
        size: file.size,
      },
    });

    const session = init.data || {};

    uploadId = session.upload_id;

    const chunkSize = Number(session.chunk_size);
    const total = Math.ceil(file.size / chunkSize);

    if (
      !Number.isSafeInteger(chunkSize) ||
      chunkSize < 1 ||
      chunkSize > 20 * 1024 * 1024 ||
      total !== session.total_chunks ||
      !/^[a-f0-9]{32}$/.test(uploadId)
    ) {
      throw new Error(
        "Konfigurasi sesi upload dari server tidak valid.",
      );
    }

    const fullHash = CryptoJS.algo.SHA256.create();

    for (let index = 0; index < total; index++) {
      const start = index * chunkSize;

      const chunk = file.slice(
        start,
        Math.min(start + chunkSize, file.size),
      );

      const words = CryptoJS.lib.WordArray.create(
        await chunk.arrayBuffer(),
      );

      const checksum = CryptoJS.SHA256(words)
        .toString(CryptoJS.enc.Hex);

      // Dihitung sekali per bagian, termasuk jika request diulang.
      fullHash.update(words);

      const payload = new FormData();

      payload.append("chunk", chunk, "part.bin");
      payload.append("sha256", checksum);

      await archiveRequest({
        baseUrl,
        token,
        path: `/archive/uploads/${uploadId}/parts/${index}`,
        body: payload,
        retry: true,
        onProgress: (ratio) => {
          const percent =
            (90 * (start + chunk.size * ratio)) / file.size;

          onProgress(
            percent,
            `Mengunggah bagian ${index + 1}/${total}`,
          );
        },
      });
    }

    completing = true;

    onProgress(92, "Menggabungkan dan memverifikasi file");

    const checksum = fullHash
      .finalize()
      .toString(CryptoJS.enc.Hex);

    await archiveRequest({
      baseUrl,
      token,
      path: `/archive/uploads/${uploadId}/complete`,
      body: { sha256: checksum },
      retry: true,
    });

    onProgress(95, "File siap, menyimpan arsip");

    return uploadId;
  } catch (error) {
    if (uploadId && !completing) {
      try {
        await archiveRequest({
          baseUrl,
          token,
          path: `/archive/uploads/${uploadId}/cancel`,
          body: {},
        });
      } catch {
        // Sesi tersisa mengikuti pembersihan upload kedaluwarsa.
      }
    }

    throw error;
  }
}