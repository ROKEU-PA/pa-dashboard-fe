
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiRequest } from "@/services/APIHelper";
import Dialog from "@/components/Dialog";
import { AppContext } from "@/contexts/AppContext";

import {
  AlertCircle,
  FileWarning,
  Loader2,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const PAGE_SIZE = 5;

/* =========================================================
   HELPER
========================================================= */

const firstDefined = (obj, keys, fallback = undefined) => {
  for (const key of keys) {
    if (
      obj?.[key] !== undefined &&
      obj?.[key] !== null &&
      obj?.[key] !== ""
    ) {
      return obj[key];
    }
  }

  return fallback;
};

const normalizeStatus = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]+/g, "");

/*
 * Berdasarkan respons API yang kamu kirim:
 * status "fix" = SPP yang perlu diperbaiki.
 */
const getStatus = (doc) =>
  normalizeStatus(
    firstDefined(doc, [
      "status",
      "status_spp",
      "nama_status",
      "_status_",
      "status_",
    ], "")
  );

const isDiproses = (doc) =>
  getStatus(doc) === "diproses";

const isPerluDiperbaiki = (doc) =>
  [
    "fix",
    "perludiperbaiki",
    "perluperbaikan",
    "perbaikidiperlukan",
    "perbaikan",
  ].includes(getStatus(doc));

const getRevision = (doc) =>
  Number(
    firstDefined(
      doc,
      ["rev", "revisi", "revision", "_rev_"],
      0
    )
  ) || 0;

const getUpdater = (doc) => {
  const updater =
    doc?.updated_by?.name ??
    doc?.updated_by ??
    doc?.update_by ??
    doc?.diperbaiki_oleh ??
    "";

  return String(updater).trim().toUpperCase();
};

const getUpdaterLabel = (doc) =>
  doc?.updated_by?.name ??
  doc?.updated_by ??
  doc?.update_by ??
  doc?.diperbaiki_oleh ??
  "-";

const getStatusLabel = (doc) => {
  if (getStatus(doc) === "fix") {
    return "Perlu Diperbaiki";
  }

  return firstDefined(
    doc,
    ["status", "status_spp", "nama_status"],
    "-"
  );
};

const getField = (doc, keys, fallback = "-") =>
  firstDefined(doc, keys, fallback);

/*
 * Respons list yang kamu kirim memiliki bentuk:
 * {
 *   success: true,
 *   data: {
 *     current_page: 1,
 *     data: [...]
 *   }
 * }
 */
const getDocumentList = (response) => {
  const candidates = [
    response?.data?.data,
    response?.data?.items,
    response?.data?.documents,
    response?.data,
    response?._data_?.data,
    response?._data_?.items,
    response?._data_,
  ];

  return candidates.find(Array.isArray) ?? [];
};

const getSummaryData = (response) => {
  const data = response?.data ?? response?._data_ ?? {};

  return data?.data ?? data;
};

/*
 * Mengambil token login.
 * Sesuaikan nama penyimpanan bila project kamu menggunakan
 * key atau mekanisme autentikasi yang berbeda.
 */
const getAccessToken = () => {
  try {
    const auth = JSON.parse(
      sessionStorage.getItem("auth") || "null"
    );

    return (
      auth?.accessToken ||
      auth?.access_token ||
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token") ||
      null
    );
  } catch {
    return (
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token") ||
      null
    );
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PendingDocumentsModal({
  open,
  onClose,
  code,
  onSummaryChange,
}) {
  const { userData } = useContext(AppContext);

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeTab, setActiveTab] = useState("diproses");
  const [page, setPage] = useState(1);

  const [picSummary, setPicSummary] = useState({
    totalDiproses: 0,
    totalDiperbaikiRevGte1: 0,
    canSubmitTest: null,
    note: "",
  });

  const [userSummary, setUserSummary] = useState({
    totalPerluDiperbaiki: 0,
    canAddSubmission: null,
    note: "",
  });

  /* =======================================================
     ROLE
  ======================================================= */

  const role = String(
    firstDefined(
      userData,
      ["role", "_role_", "role_name", "_role_name_"],
      firstDefined(
        userData?.user,
        ["role", "_role_"],
        ""
      )
    )
  )
    .trim()
    .toLowerCase();

  const isPic = ["pic", "admin"].includes(role);

  /* =======================================================
     FETCH DATA
  ======================================================= */

  const fetchData = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const token = getAccessToken();

      if (!token) {
        throw new Error(
          "Token login tidak ditemukan. Silakan login kembali."
        );
      }

      if (code === undefined || code === null || code === "") {
        throw new Error(
          "Kode biro tidak ditemukan pada modal."
        );
      }

      /*
       * 1. Ambil data dokumen dari endpoint list.
       *
       * Berdasarkan request yang terlihat di Network:
       * /archive/list?biro_code=...&tahun=...&status=arsip...
       *
       * Status arsip digunakan sebagai filter daftar arsip.
       * Status fix/diproses difilter di frontend di bawah.
       */
      const params = new URLSearchParams({
        biro_code: String(code),
        status: "arsip",
        page: "1",
        per_page: "100",
      });

      const listResponse = await apiRequest({
        url: `/archive/list?${params.toString()}`,
        token,
      });

      console.log(
        "[PendingDocumentsModal] List response:",
        listResponse
      );

      if (
        listResponse?.success === false ||
        listResponse?._success_ === false
      ) {
        throw new Error(
          listResponse?.message ||
            listResponse?._message_ ||
            "Gagal mengambil daftar SPP."
        );
      }

      const documents = getDocumentList(listResponse);

      setDocs(documents);

      console.log(
        "[PendingDocumentsModal] Dokumen:",
        documents.map((doc) => ({
          no_spp: doc?.no_spp,
          status: doc?.status,
          rev: doc?.rev,
          updated_by: doc?.updated_by,
        }))
      );

      /*
       * 2. Ambil summary berdasarkan role.
       * Summary tidak digunakan sebagai isi tabel.
       */
      if (isPic) {
        const summaryResponse = await apiRequest({
          url: "/archive/pic-summary",
          token,
        });

        const summary = getSummaryData(summaryResponse);

        const nextSummary = {
          totalDiproses: Number(
            firstDefined(
              summary,
              ["total_diproses"],
              documents.filter(isDiproses).length
            )
          ),
          totalDiperbaikiRevGte1: Number(
            firstDefined(
              summary,
              ["total_diperbaiki_rev_gte1"],
              0
            )
          ),
          canSubmitTest: firstDefined(
            summary,
            ["can_submit_test"],
            null
          ),
          note: firstDefined(summary, ["note"], ""),
        };

        setPicSummary(nextSummary);

        onSummaryChange?.({
          jumlahDiprosesPIC: nextSummary.totalDiproses,
          jumlahPerluDiperbaiki:
            documents.filter(isPerluDiperbaiki).length,
          totalDiperbaikiRevGte1:
            nextSummary.totalDiperbaikiRevGte1,
          canSubmitTest: nextSummary.canSubmitTest,
          notePIC: nextSummary.note,
        });
      } else {
        const summaryResponse = await apiRequest({
          url: "/archive/user-summary",
          token,
        });

        const summary = getSummaryData(summaryResponse);

        const nextSummary = {
          totalPerluDiperbaiki: Number(
            firstDefined(
              summary,
              ["total_perlu_diperbaiki"],
              0
            )
          ),
          canAddSubmission: firstDefined(
            summary,
            ["can_add_submission"],
            null
          ),
          note: firstDefined(summary, ["note"], ""),
        };

        setUserSummary(nextSummary);

        onSummaryChange?.({
          jumlahPerluDiperbaikiUser:
            nextSummary.totalPerluDiperbaiki,
          canAddSubmission: nextSummary.canAddSubmission,
          noteUser: nextSummary.note,
        });
      }
    } catch (error) {
      console.error(
        "[PendingDocumentsModal] Gagal memuat data:",
        error
      );

      setDocs([]);
      setErrorMessage(
        error?.message || "Gagal memuat daftar SPP."
      );
    } finally {
      setLoading(false);
    }
  }, [open, code, isPic, onSummaryChange]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, open]);

  /* =======================================================
     FILTER DOKUMEN
  ======================================================= */

  const docsDiproses = useMemo(
    () => docs.filter(isDiproses),
    [docs]
  );

  /*
   * PIC/Admin:
   * Tampilkan semua dokumen dengan status "fix"
   * atau status lain yang secara eksplisit berarti perbaikan.
   *
   * Tidak dibatasi oleh rev > 1.
   */
  const docsPerluDiperbaikiPIC = useMemo(
    () => docs.filter(isPerluDiperbaiki),
    [docs]
  );

  /*
   * User:
   * Tampilkan dokumen perbaikan yang dikembalikan PA PIC.
   * Struktur updated_by pada JSON adalah objek dengan field name.
   */
  const docsPerluDiperbaikiUser = useMemo(
    () =>
      docs.filter(
        (doc) =>
          isPerluDiperbaiki(doc) &&
          getUpdater(doc) === "PA PIC"
      ),
    [docs]
  );

  const dataAktif = isPic
    ? activeTab === "diproses"
      ? docsDiproses
      : docsPerluDiperbaikiPIC
    : docsPerluDiperbaikiUser;

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(dataAktif.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedData = dataAktif.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startData =
    dataAktif.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endData = Math.min(
    currentPage * PAGE_SIZE,
    dataAktif.length
  );

  const changeTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  /* =======================================================
     TABLE HEADERS
  ======================================================= */

  const headers =
    isPic && activeTab === "diproses"
      ? [
          "No",
          "No SPP",
          "Jenis SPP",
          "Tahun",
          "Tanggal SPP",
          "Tanggal Update",
          "Status",
        ]
      : isPic
        ? [
            "No",
            "No SPP",
            "Jenis SPP",
            "Tahun",
            "Revisi",
            "Diubah Oleh",
            "Tanggal Update",
            "Status",
          ]
        : [
            "No",
            "No SPP",
            "Jenis SPP",
            "Tahun",
            "Revisi",
            "Tanggal SPP",
            "Tanggal Update",
            "Diperbaiki Oleh",
            "Status",
          ];

  /* =======================================================
     TABLE ROWS
  ======================================================= */

  const renderStatus = (doc) => {
    const status = getStatus(doc);

    const color =
      status === "diproses"
        ? "bg-orange-100 text-orange-600"
        : isPerluDiperbaiki(doc)
          ? "bg-rose-100 text-rose-600"
          : "bg-slate-100 text-slate-600";

    return (
      <span
        className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-bold ${color}`}
      >
        {getStatusLabel(doc)}
      </span>
    );
  };

  const renderRows = () =>
    paginatedData.map((doc, index) => {
      const rowNumber =
        (currentPage - 1) * PAGE_SIZE + index + 1;

      const rowKey = getField(
        doc,
        ["id", "no_spp"],
        rowNumber
      );

      return (
        <tr
          key={rowKey}
          className="border-b border-slate-100 transition-colors hover:bg-blue-50/50"
        >
          <td className="whitespace-nowrap px-3 py-2 text-center text-xs text-slate-600">
            {rowNumber}
          </td>

          <td className="whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-700">
            {getField(doc, ["no_spp"])}
          </td>

          <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
            {getField(doc, ["jenis_spp", "type"])}
          </td>

          <td className="px-3 py-2 text-xs text-slate-600">
            {getField(doc, ["tahun"])}
          </td>

          {isPic && activeTab === "diproses" ? (
            <>
              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getField(doc, [
                  "tgl_spp",
                  "archive_at",
                  "created_at",
                ])}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getField(doc, [
                  "updated_at",
                  "tgl_update",
                  "archive_at",
                ])}
              </td>

              <td className="px-3 py-2">
                {renderStatus(doc)}
              </td>
            </>
          ) : isPic ? (
            <>
              <td className="px-3 py-2 text-center text-xs text-slate-600">
                {getRevision(doc)}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getUpdaterLabel(doc)}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getField(doc, [
                  "updated_at",
                  "tgl_update",
                  "archive_at",
                ])}
              </td>

              <td className="px-3 py-2">
                {renderStatus(doc)}
              </td>
            </>
          ) : (
            <>
              <td className="px-3 py-2 text-center text-xs text-slate-600">
                {getRevision(doc)}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getField(doc, [
                  "tgl_spp",
                  "archive_at",
                  "created_at",
                ])}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getField(doc, [
                  "updated_at",
                  "tgl_update",
                  "archive_at",
                ])}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getUpdaterLabel(doc)}
              </td>

              <td className="px-3 py-2">
                {renderStatus(doc)}
              </td>
            </>
          )}
        </tr>
      );
    });

  if (!open) return null;

  const pengujianDinonaktifkan =
    picSummary.canSubmitTest === false ||
    picSummary.totalDiproses > 10;

  const tambahPengajuanDinonaktifkan =
    userSummary.canAddSubmission === false ||
    userSummary.totalPerluDiperbaiki > 10;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        isPic
          ? "Daftar SPP - PIC / Admin"
          : "Daftar SPP - User"
      }
      maxWidth={isPic ? 1000 : 1100}
      actions={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
        >
          Tutup
        </button>
      }
    >
      <div className="flex w-full flex-col gap-3">
        {/* INFORMASI */}
        <div
          className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
            isPic
              ? "border-blue-200 bg-blue-50"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          {isPic ? (
            <Info
              size={24}
              className="mt-0.5 shrink-0 text-blue-600"
            />
          ) : (
            <AlertCircle
              size={24}
              className="mt-0.5 shrink-0 text-orange-500"
            />
          )}

          <div className="flex flex-col gap-0.5">
            <span
              className={`text-xs font-bold ${
                isPic ? "text-blue-700" : "text-orange-700"
              }`}
            >
              {isPic ? "TUGAS PEMERIKSAAN" : "PERHATIAN"}
            </span>

            <span
              className={`text-xs leading-relaxed ${
                isPic ? "text-blue-900" : "text-orange-900"
              }`}
            >
              {isPic
                ? "Periksa SPP yang sedang diproses dan SPP yang perlu diperbaiki oleh user."
                : "Lengkapi atau perbaiki SPP yang dikembalikan oleh PA PIC sebelum melanjutkan pengajuan."}
            </span>
          </div>
        </div>

        {/* TAB PIC / ADMIN */}
        {isPic && (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => changeTab("diproses")}
              className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-xs font-bold transition-colors ${
                activeTab === "diproses"
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              SPP Diproses

              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] text-white">
                {docsDiproses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => changeTab("perbaikan")}
              className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-xs font-bold transition-colors ${
                activeTab === "perbaikan"
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              SPP Perlu Diperbaiki

              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] text-white">
                {docsPerluDiperbaikiPIC.length}
              </span>
            </button>
          </div>
        )}

        {/* JUDUL */}
        <div className="flex items-center justify-between gap-2 rounded-lg bg-sky-50 px-3 py-2">
          <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
            {isPic
              ? activeTab === "diproses"
                ? "Daftar SPP Berstatus Diproses"
                : "Daftar SPP Perlu Diperbaiki"
              : "Daftar SPP Perlu Diperbaiki oleh PA PIC"}
          </h3>

          <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700">
            {dataAktif.length} SPP
          </span>
        </div>

        {/* INFO DIPROSES */}
        {isPic && activeTab === "diproses" && (
          <div className="rounded-md border border-blue-100 bg-blue-50/70 px-3 py-2">
            <p className="text-xs leading-relaxed text-blue-800">
              Cocokkan data SPP dengan My Interest. Jika data
              sesuai dan SPP selesai diproses, ubah statusnya
              menjadi SP2D.
            </p>

            {pengujianDinonaktifkan && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
                {picSummary.note ||
                  "Pengujian SPP dinonaktifkan. Periksa jumlah antrean SPP dan status dokumennya."}
              </p>
            )}

            {!pengujianDinonaktifkan && picSummary.note && (
              <p className="mt-1 text-xs text-blue-800">
                {picSummary.note}
              </p>
            )}
          </div>
        )}

        {/* INFO USER */}
        {!isPic && tambahPengajuanDinonaktifkan && (
          <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-xs leading-relaxed text-orange-800">
              {userSummary.note ||
                "Perbaiki SPP yang dikembalikan sebelum menambahkan pengajuan baru."}
            </p>
          </div>
        )}

        {/* ERROR */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-rose-600"
            />

            <div className="flex-1 text-xs leading-relaxed text-rose-700">
              {errorMessage}
            </div>

            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
            >
              <RefreshCw size={13} />
              Coba lagi
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-400">
            <Loader2
              size={30}
              className="animate-spin text-blue-500"
            />

            <span className="text-xs font-medium">
              Memuat data dokumen...
            </span>
          </div>
        ) : dataAktif.length > 0 ? (
          <>
            {/* TABEL */}
            <div className="w-full overflow-hidden rounded-lg border border-slate-200">
              <div className="max-h-[50vh] overflow-auto">
                <table className="w-full min-w-max border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-slate-50">
                    <tr>
                      {headers.map((header) => (
                        <th
                          key={header}
                          className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-[10px] font-bold text-slate-600 sm:text-[11px]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {renderRows()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-600">
                Menampilkan {startData}–{endData} dari{" "}
                {dataAktif.length} data
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((p) => Math.max(1, p - 1))
                  }
                  className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 min-w-8 rounded-md border px-2 text-xs font-semibold ${
                      currentPage === pageNumber
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-lg border border-slate-100 bg-slate-50 py-8">
            <FileWarning
              size={42}
              className="text-slate-400"
            />

            <span className="text-sm font-medium text-slate-700">
              {errorMessage
                ? "Data belum dapat ditampilkan."
                : "Tidak ada dokumen yang sesuai."}
            </span>

            <span className="max-w-md px-4 text-center text-xs leading-relaxed text-slate-500">
              {isPic && activeTab === "perbaikan"
                ? 'Tab ini mencari dokumen dengan status API "fix" atau status lain yang berarti perlu diperbaiki.'
                : "Periksa kembali status dokumen jika data seharusnya tersedia."}
            </span>

            {!errorMessage && (
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Muat ulang
              </button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
