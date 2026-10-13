import { useRef, useState } from "react";
import axios from "axios";
import {
  CircleCheck,
  Clock3,
  AlertCircle,
} from "lucide-react";

export const useBulkUpload = () => {
  // =========================================================
  // REF
  // =========================================================

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Mencegah upload dipanggil berulang secara bersamaan.
  const uploadLockRef = useRef(false);

  // =========================================================
  // BULK STATE
  // =========================================================

  const [bulkFiles, setBulkFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // =========================================================
  // CONFIG
  // =========================================================

  // Maksimal 10 file dalam satu request.
  const BATCH_SIZE = 10;

  // Maksimal 50 MB per file.
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  // =========================================================
  // SUMMARY RESULT
  // =========================================================

  const [uploadSummary, setUploadSummary] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
    uploading: 0,
    completed: false,
  });

  // =========================================================
  // CREATE BATCHES
  // =========================================================

  const createBatches = (files, batchSize) => {
    if (!Array.isArray(files) || batchSize <= 0) {
      return [];
    }

    const batches = [];

    for (let i = 0; i < files.length; i += batchSize) {
      batches.push(files.slice(i, i + batchSize));
    }

    return batches;
  };

  // =========================================================
  // CREATE BULK FILE ITEM
  // =========================================================

  const createBulkFileItem = (
    file,
    status = "Pending",
    error = "",
    relativePath = "",
    sourceType = "File"
  ) => ({
    id: `${file.name}-${file.lastModified}-${Math.random()}`,
    file,
    name: file.name,
    size: file.size,
    status,
    progress: 0,
    error,
    relativePath: relativePath || file.name,
    sourceType,

    // Data dari response backend.
    extractedData: null,
    minioPath: "",
    pagesDetected: null,
  });

  // =========================================================
  // VALIDASI BULK FILE
  // =========================================================

  const validateBulkFile = (file) => {
    if (!file || !file.name) {
      return {
        valid: false,
        error: "File tidak valid.",
      };
    }

    const fileName = file.name.toLowerCase();

    // Validasi format PDF.
    if (
      file.type !== "application/pdf" &&
      !fileName.endsWith(".pdf")
    ) {
      return {
        valid: false,
        error: "Format file harus PDF.",
      };
    }

    // Validasi ukuran file.
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "Ukuran file melebihi batas maksimal 50 MB.",
      };
    }

    return {
      valid: true,
      error: "",
    };
  };

  // =========================================================
  // TAMBAH FILE BULK
  // =========================================================

  const handleBulkFiles = (fileList) => {
    // Jangan menambah file ketika upload berlangsung.
    if (uploadLockRef.current) {
      return;
    }

    const files = Array.from(fileList || []);

    if (!files.length) {
      return;
    }

    const newItems = files.map((file) => {
      const validation = validateBulkFile(file);

      if (!validation.valid) {
        return createBulkFileItem(
          file,
          "Error",
          validation.error,
          file.name,
          "File"
        );
      }

      return createBulkFileItem(
        file,
        "Pending",
        "",
        file.name,
        "File"
      );
    });

    setBulkFiles((prev) => {
      const updated = [...prev, ...newItems];

      setUploadSummary(calculateSummary(updated));

      return updated;
    });
  };

  // =========================================================
  // INPUT BULK
  // =========================================================

  const handleBulkInputChange = (event) => {
    handleBulkFiles(event.target.files);

    event.target.value = "";
    setIsAddMenuOpen(false);
  };

  // =========================================================
  // INPUT FOLDER
  // =========================================================

  const handleFolderInputChange = (event) => {
    if (uploadLockRef.current) {
      event.target.value = "";
      setIsAddMenuOpen(false);
      return;
    }

    const files = Array.from(event.target.files || []);

    if (!files.length) {
      setIsAddMenuOpen(false);
      return;
    }

    const newItems = files.map((file) => {
      const validation = validateBulkFile(file);

      const relativePath =
        file.webkitRelativePath || file.name;

      if (!validation.valid) {
        return createBulkFileItem(
          file,
          "Error",
          validation.error,
          relativePath,
          "Folder"
        );
      }

      return createBulkFileItem(
        file,
        "Pending",
        "",
        relativePath,
        "Folder"
      );
    });

    setBulkFiles((prev) => {
      const updated = [...prev, ...newItems];

      setUploadSummary(calculateSummary(updated));

      return updated;
    });

    event.target.value = "";
    setIsAddMenuOpen(false);
  };

  // =========================================================
  // DRAG & DROP
  // =========================================================

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    if (uploadLockRef.current) {
      return;
    }

    handleBulkFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    if (!uploadLockRef.current) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // =========================================================
  // REMOVE FILE
  // =========================================================

  const removeBulkFile = (id) => {
    if (uploadLockRef.current) {
      return;
    }

    setBulkFiles((prev) => {
      const updated = prev.filter((file) => file.id !== id);

      setUploadSummary(calculateSummary(updated));

      return updated;
    });
  };

  // =========================================================
  // CLEAR FILE
  // =========================================================

  const clearBulkFiles = () => {
    if (uploadLockRef.current) {
      return;
    }

    setBulkFiles([]);

    setUploadSummary({
      total: 0,
      success: 0,
      failed: 0,
      pending: 0,
      uploading: 0,
      completed: false,
    });
  };

  // =========================================================
  // FORMAT FILE SIZE
  // =========================================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.ceil(bytes / 1024)} KB`;
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Success":
        return {
          wrapper:
            "bg-emerald-50 text-emerald-600 border-emerald-100",
          icon: <CircleCheck size={13} />,
        };

      case "Uploading":
        return {
          wrapper:
            "bg-blue-50 text-blue-600 border-blue-100",
          icon: <Clock3 size={13} />,
        };

      case "Failed":
      case "Error":
        return {
          wrapper:
            "bg-red-50 text-red-600 border-red-100",
          icon: <AlertCircle size={13} />,
        };

      default:
        return {
          wrapper:
            "bg-amber-50 text-amber-600 border-amber-100",
          icon: <Clock3 size={13} />,
        };
    }
  };

  // =========================================================
  // CALCULATE SUMMARY
  // =========================================================

  const calculateSummary = (files) => {
    const total = files.length;

    const success = files.filter(
      (file) => file.status === "Success"
    ).length;

    const failed = files.filter(
      (file) =>
        file.status === "Failed" ||
        file.status === "Error"
    ).length;

    const pending = files.filter(
      (file) => file.status === "Pending"
    ).length;

    const uploading = files.filter(
      (file) => file.status === "Uploading"
    ).length;

    const completed =
      total > 0 && success + failed === total;

    return {
      total,
      success,
      failed,
      pending,
      uploading,
      completed,
    };
  };

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Upload gagal."
    );
  };

  // =========================================================
  // NORMALIZE FILE NAME
  // =========================================================

  const normalizeFileName = (value) => {
    return String(value || "")
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      .trim()
      .toLowerCase();
  };

  // =========================================================
  // CARI DETAIL FILE DARI RESPONSE BACKEND
  // =========================================================

  const findFileDetail = (batchItem, details) => {
    if (!Array.isArray(details)) {
      return null;
    }

    const fileName =
      batchItem?.name ||
      batchItem?.file?.name ||
      "";

    const normalizedFileName = normalizeFileName(fileName);

    return details.find((detail) => {
      const responseFileName =
        detail?.original_filename ||
        detail?.filename ||
        detail?.name ||
        "";

      return (
        normalizeFileName(responseFileName) ===
        normalizedFileName
      );
    });
  };

  // =========================================================
  // APPLY SUCCESS RESPONSE
  // =========================================================

  const applySuccessResponse = (batch, result) => {
    const details = Array.isArray(result?.details)
      ? result.details
      : [];

    setBulkFiles((prev) => {
      const updated = prev.map((item) => {
        const batchItem = batch.find(
          (batchFile) => batchFile.id === item.id
        );

        if (!batchItem) {
          return item;
        }

        const detail = findFileDetail(batchItem, details);

        // Backend memberikan detail untuk file ini.
        if (detail) {
          if (
            String(detail.status || "").toLowerCase() ===
            "success"
          ) {
            return {
              ...item,
              status: "Success",
              progress: 100,
              error: "",
              extractedData: detail.extracted_data ?? null,
              minioPath: detail.minio_path ?? "",
              pagesDetected: detail.pages_detected ?? null,
            };
          }

          return {
            ...item,
            status: "Failed",
            progress: 0,
            error:
              detail.message ||
              detail.error ||
              "File gagal diproses oleh backend.",
            extractedData: detail.extracted_data ?? null,
            minioPath: detail.minio_path ?? "",
            pagesDetected: detail.pages_detected ?? null,
          };
        }

        // Fallback untuk backend yang hanya mengembalikan
        // success tanpa details sama sekali.
        if (result?.success === true && details.length === 0) {
          return {
            ...item,
            status: "Success",
            progress: 100,
            error: "",
          };
        }

        // Jangan biarkan file tetap berstatus Uploading
        // jika detail file tidak ditemukan dalam response.
        return {
          ...item,
          status: "Failed",
          progress: 0,
          error:
            "Detail hasil file tidak ditemukan pada response backend.",
        };
      });

      setUploadSummary(calculateSummary(updated));

      return updated;
    });
  };

  // =========================================================
  // APPLY FAILED RESPONSE
  // =========================================================

  const applyFailedResponse = (batch, result) => {
    const message =
      result?.message ||
      result?.error ||
      "File ditolak oleh backend.";

    setBulkFiles((prev) => {
      const updated = prev.map((item) => {
        const batchItem = batch.find(
          (batchFile) => batchFile.id === item.id
        );

        if (!batchItem) {
          return item;
        }

        const fileName = batchItem.name;

        // Jika pesan backend menyebut file tertentu,
        // simpan pesan tersebut pada file yang sesuai.
        if (message.includes(fileName)) {
          return {
            ...item,
            status: "Failed",
            progress: 0,
            error: message,
          };
        }

        // Jika kegagalan berlaku untuk seluruh batch,
        // semua file dalam batch ditandai gagal.
        return {
          ...item,
          status: "Failed",
          progress: 0,
          error: message,
        };
      });

      setUploadSummary(calculateSummary(updated));

      return updated;
    });
  };

  // =========================================================
  // BULK UPLOAD
  // =========================================================

  const uploadBulkFiles = async () => {
    // Kunci ref bekerja langsung tanpa menunggu render React.
    // Ini mencegah pemanggilan upload bersamaan dari klik ganda.
    if (uploadLockRef.current) {
      console.warn(
        "[Bulk Upload] Upload masih berjalan. Pemanggilan duplikat diabaikan."
      );
      return;
    }

    const validFiles = bulkFiles.filter((item) => {
      const validation = validateBulkFile(item.file);

      return item.status === "Pending" && validation.valid;
    });

    if (!validFiles.length) {
      alert("Tidak ada file PDF yang siap diupload.");
      return;
    }

    // Pasang lock sebelum proses asynchronous dimulai.
    uploadLockRef.current = true;

    try {
      setIsUploading(true);

      // -----------------------------------------
      // Pending -> Uploading
      // -----------------------------------------

      const pendingIds = new Set(
        validFiles.map((item) => item.id)
      );

      setBulkFiles((prev) => {
        const updated = prev.map((item) =>
          pendingIds.has(item.id)
            ? {
                ...item,
                status: "Uploading",
                progress: 0,
                error: "",
              }
            : item
        );

        setUploadSummary(calculateSummary(updated));

        return updated;
      });

      // -----------------------------------------
      // Buat batch maksimal 10 file
      // -----------------------------------------

      const batches = createBatches(
        validFiles,
        BATCH_SIZE
      );

      console.log("=================================");
      console.log("TOTAL FILE:", validFiles.length);
      console.log("BATCH SIZE:", BATCH_SIZE);
      console.log("TOTAL BATCH:", batches.length);
      console.log("=================================");

      // -----------------------------------------
      // Ambil token autentikasi
      // -----------------------------------------

      const auth = sessionStorage.getItem("auth");

      let accessToken = null;

      try {
        accessToken = auth
          ? JSON.parse(auth)?.accessToken
          : null;
      } catch (error) {
        console.error(
          "Gagal membaca auth session:",
          error
        );
      }

      // -----------------------------------------
      // Base URL backend
      // -----------------------------------------

      const apiBaseUrl =
        process.env.REACT_APP_API_BASE_URL;

      if (!apiBaseUrl) {
        throw new Error(
          "REACT_APP_API_BASE_URL belum tersedia."
        );
      }

      // -----------------------------------------
      // Upload batch secara berurutan
      // -----------------------------------------

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        console.log(
          `Upload batch ${i + 1} dari ${batches.length}`
        );

        console.log(
          "File:",
          batch.map((item) => item.name)
        );

        // ---------------------------------------
        // FormData
        // ---------------------------------------

        const formData = new FormData();

        batch.forEach((item) => {
          formData.append("files[]", item.file);
        });

        try {
          // Jangan set Content-Type secara manual.
          // Browser/Axios akan mengatur multipart boundary.

          console.log(
            `[Bulk Upload] Mengirim request batch ${i + 1}.`
          );

          const response = await axios.post(
            `${apiBaseUrl}/archive/bulk-upload`,
            formData,
            {
              headers: {
                ...(accessToken
                  ? {
                      Authorization: `Bearer ${accessToken}`,
                    }
                  : {}),
              },
            }
          );

          const result = response.data;

          console.log(
            `HASIL BATCH ${i + 1}:`,
            result
          );

          // HTTP 201 adalah status sukses HTTP.
          // Pemetaan hasil file tetap mengikuti response backend.
          if (result?.success === true) {
            applySuccessResponse(batch, result);
          } else {
            applyFailedResponse(batch, result);
          }
        } catch (batchError) {
          console.error(
            `Batch ${i + 1} gagal:`,
            batchError
          );

          const errorMessage = getErrorMessage(batchError);

          setBulkFiles((prev) => {
            const updated = prev.map((item) => {
              const batchItem = batch.find(
                (batchFile) => batchFile.id === item.id
              );

              if (!batchItem) {
                return item;
              }

              return {
                ...item,
                status: "Failed",
                progress: 0,
                error: errorMessage,
              };
            });

            setUploadSummary(calculateSummary(updated));

            return updated;
          });
        }

        // -----------------------------------------
        // Update ringkasan setelah batch selesai
        // -----------------------------------------

        setBulkFiles((prev) => {
          const summary = calculateSummary(prev);

          setUploadSummary(summary);

          return prev;
        });
      }

      // -----------------------------------------
      // FINAL SUMMARY
      // -----------------------------------------

      setBulkFiles((prev) => {
        const summary = calculateSummary(prev);

        setUploadSummary(summary);

        return prev;
      });

      console.log("=================================");
      console.log("SEMUA BATCH SELESAI");
      console.log("=================================");
    } catch (error) {
      console.error("Bulk upload error:", error);

      const errorMessage = getErrorMessage(error);

      setBulkFiles((prev) => {
        const updated = prev.map((item) =>
          item.status === "Uploading"
            ? {
                ...item,
                status: "Failed",
                progress: 0,
                error: errorMessage,
              }
            : item
        );

        setUploadSummary(calculateSummary(updated));

        return updated;
      });
    } finally {
      // Pastikan lock selalu dilepas, termasuk ketika terjadi error.
      uploadLockRef.current = false;
      setIsUploading(false);

      setBulkFiles((prev) => {
        const summary = calculateSummary(prev);

        setUploadSummary(summary);

        return prev;
      });
    }
  };

  // =========================================================
  // RETRY
  // =========================================================

  const retryBulkFile = (fileItem) => {
    if (uploadLockRef.current) {
      return;
    }

    setBulkFiles((prev) => {
      const updated = prev.map((item) =>
        item.id === fileItem.id
          ? {
              ...item,
              status: "Pending",
              progress: 0,
              error: "",
              extractedData: null,
              minioPath: "",
              pagesDetected: null,
            }
          : item
      );

      setUploadSummary(calculateSummary(updated));

      return updated;
    });
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalFiles = bulkFiles.length;

  const successFiles = bulkFiles.filter(
    (file) => file.status === "Success"
  ).length;

  const uploadingFiles = bulkFiles.filter(
    (file) => file.status === "Uploading"
  ).length;

  const pendingFiles = bulkFiles.filter(
    (file) => file.status === "Pending"
  ).length;

  const failedFiles = bulkFiles.filter(
    (file) =>
      file.status === "Failed" ||
      file.status === "Error"
  ).length;

  const progressPercentage =
    totalFiles > 0
      ? Math.round(
          ((successFiles + failedFiles) / totalFiles) * 100
        )
      : 0;

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // REF
    fileInputRef,
    folderInputRef,

    // STATE
    bulkFiles,
    setBulkFiles,
    isDragging,
    isAddMenuOpen,
    setIsAddMenuOpen,
    isUploading,

    // CONFIG
    BATCH_SIZE,
    MAX_FILE_SIZE,

    // SUMMARY
    uploadSummary,

    // FILE HANDLING
    createBulkFileItem,
    validateBulkFile,
    handleBulkFiles,
    handleBulkInputChange,
    handleFolderInputChange,

    // DRAG & DROP
    handleDrop,
    handleDragOver,
    handleDragLeave,

    // FILE ACTIONS
    removeBulkFile,
    clearBulkFiles,
    retryBulkFile,

    // UPLOAD
    createBatches,
    uploadBulkFiles,

    // HELPER
    formatFileSize,
    getStatusStyle,

    // STATISTICS
    totalFiles,
    successFiles,
    uploadingFiles,
    pendingFiles,
    failedFiles,
    progressPercentage,
  };
};