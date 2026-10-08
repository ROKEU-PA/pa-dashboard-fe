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

  // 10 file per request
  const BATCH_SIZE = 10;

  // Maksimal 50 MB per file
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
    const batches = [];

    for (
      let i = 0;
      i < files.length;
      i += batchSize
    ) {
      batches.push(
        files.slice(i, i + batchSize)
      );
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
    relativePath:
      relativePath || file.name,
    sourceType,

    // Response dari BE
    extractedData: null,
    minioPath: "",
    pagesDetected: null,
  });

  // =========================================================
  // VALIDASI BULK FILE
  // =========================================================

  const validateBulkFile = (file) => {
    const fileName =
      file.name.toLowerCase();

    // -----------------------------------------
    // Validasi PDF
    // -----------------------------------------

    if (
      file.type !== "application/pdf" &&
      !fileName.endsWith(".pdf")
    ) {
      return {
        valid: false,
        error: "Format file harus PDF.",
      };
    }

    // -----------------------------------------
    // Validasi ukuran
    // -----------------------------------------

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error:
          "Ukuran file melebihi batas maksimal 50 MB.",
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
    const files = Array.from(
      fileList || []
    );

    if (!files.length) return;

    const newItems = files.map(
      (file) => {
        const validation =
          validateBulkFile(file);

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
      }
    );

    setBulkFiles((prev) => [
      ...prev,
      ...newItems,
    ]);
  };

  // =========================================================
  // INPUT BULK
  // =========================================================

  const handleBulkInputChange = (
    event
  ) => {
    handleBulkFiles(
      event.target.files
    );

    event.target.value = "";
    setIsAddMenuOpen(false);
  };

  // =========================================================
  // INPUT FOLDER
  // =========================================================

  const handleFolderInputChange = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      setIsAddMenuOpen(false);
      return;
    }

    const newItems = files.map(
      (file) => {
        const validation =
          validateBulkFile(file);

        const relativePath =
          file.webkitRelativePath ||
          file.name;

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
      }
    );

    setBulkFiles((prev) => [
      ...prev,
      ...newItems,
    ]);

    event.target.value = "";
    setIsAddMenuOpen(false);
  };

  // =========================================================
  // DRAG & DROP
  // =========================================================

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    handleBulkFiles(
      event.dataTransfer.files
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // =========================================================
  // REMOVE FILE
  // =========================================================

  const removeBulkFile = (id) => {
    setBulkFiles((prev) =>
      prev.filter(
        (file) => file.id !== id
      )
    );
  };

  // =========================================================
  // CLEAR FILE
  // =========================================================

  const clearBulkFiles = () => {
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
    if (!bytes) return "0 KB";

    const mb =
      bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.ceil(
      bytes / 1024
    )} KB`;
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
          icon: (
            <CircleCheck size={13} />
          ),
        };

      case "Uploading":
        return {
          wrapper:
            "bg-blue-50 text-blue-600 border-blue-100",
          icon: (
            <Clock3 size={13} />
          ),
        };

      case "Failed":
      case "Error":
        return {
          wrapper:
            "bg-red-50 text-red-600 border-red-100",
          icon: (
            <AlertCircle size={13} />
          ),
        };

      default:
        return {
          wrapper:
            "bg-amber-50 text-amber-600 border-amber-100",
          icon: (
            <Clock3 size={13} />
          ),
        };
    }
  };

  // =========================================================
  // UPDATE SUMMARY
  // =========================================================

  const calculateSummary = (files) => {
    const total = files.length;

    const success = files.filter(
      (file) =>
        file.status === "Success"
    ).length;

    const failed = files.filter(
      (file) =>
        file.status === "Failed" ||
        file.status === "Error"
    ).length;

    const pending = files.filter(
      (file) =>
        file.status === "Pending"
    ).length;

    const uploading = files.filter(
      (file) =>
        file.status === "Uploading"
    ).length;

    const completed =
      total > 0 &&
      success + failed === total;

    return {
      total,
      success,
      failed,
      pending,
      uploading,
      completed,
    };
  };

  const updateUploadSummary = (
    files
  ) => {
    const summary =
      calculateSummary(files);

    setUploadSummary(summary);
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
  // CARI DETAIL FILE DARI RESPONSE BE
  // =========================================================

  const findFileDetail = (
    batchItem,
    details
  ) => {
    if (!Array.isArray(details)) {
      return null;
    }

    const fileName =
      batchItem?.name ||
      batchItem?.file?.name;

    return details.find(
      (detail) => {
        const responseFileName =
          detail?.original_filename ||
          detail?.filename ||
          detail?.name;

        return (
          responseFileName === fileName
        );
      }
    );
  };

  // =========================================================
  // APPLY SUCCESS RESPONSE
  // =========================================================

  const applySuccessResponse = (
    batch,
    result
  ) => {
    const details =
      Array.isArray(result?.details)
        ? result.details
        : [];

    setBulkFiles((prev) => {
      const updated = prev.map(
        (item) => {
          const batchItem =
            batch.find(
              (batchFile) =>
                batchFile.id ===
                item.id
            );

          if (!batchItem) {
            return item;
          }

          const detail =
            findFileDetail(
              batchItem,
              details
            );

          // ---------------------------------------
          // BE mengirim detail per file
          // ---------------------------------------

          if (detail) {
            if (
              detail.status ===
              "success"
            ) {
              return {
                ...item,
                status: "Success",
                progress: 100,
                error: "",

                extractedData:
                  detail.extracted_data ||
                  null,

                minioPath:
                  detail.minio_path ||
                  "",

                pagesDetected:
                  detail.pages_detected ??
                  null,
              };
            }

            return {
              ...item,
              status: "Failed",
              progress: 0,

              error:
                detail.message ||
                detail.error ||
                "File gagal diproses.",

              extractedData:
                detail.extracted_data ||
                null,

              minioPath:
                detail.minio_path ||
                "",

              pagesDetected:
                detail.pages_detected ??
                null,
            };
          }

          // ---------------------------------------
          // Fallback kalau success true tapi
          // detail tidak tersedia
          // ---------------------------------------

          if (
            result?.success === true &&
            details.length === 0
          ) {
            return {
              ...item,
              status: "Success",
              progress: 100,
              error: "",
            };
          }

          return item;
        }
      );

      return updated;
    });
  };

  // =========================================================
  // APPLY FAILED RESPONSE
  // =========================================================

  const applyFailedResponse = (
    batch,
    result
  ) => {
    const message =
      result?.message ||
      "File ditolak oleh backend.";

    setBulkFiles((prev) => {
      const updated = prev.map(
        (item) => {
          const batchItem =
            batch.find(
              (batchFile) =>
                batchFile.id ===
                item.id
            );

          if (!batchItem) {
            return item;
          }

          const fileName =
            batchItem.name;

          /*
           * Contoh response BE:
           *
           * {
           *   success: false,
           *   message:
           *   "File 2171_SPM_550...
           *    pdf ditolak:
           *    Biro Code '2171'
           *    tidak valid..."
           * }
           */

          const messageContainsFile =
            message.includes(fileName);

          // ---------------------------------------
          // Kalau message menyebut file tertentu
          // ---------------------------------------

          if (messageContainsFile) {
            return {
              ...item,
              status: "Failed",
              progress: 0,
              error: message,
            };
          }

          /*
           * Kalau backend mengembalikan
           * success false tanpa menyebut
           * nama file, seluruh batch dianggap
           * gagal.
           */

          return {
            ...item,
            status: "Failed",
            progress: 0,
            error: message,
          };
        }
      );

      return updated;
    });
  };

  // =========================================================
  // BULK UPLOAD
  // =========================================================

  const uploadBulkFiles = async () => {
    const validFiles =
      bulkFiles.filter(
        (item) =>
          item.status === "Pending"
      );

    if (!validFiles.length) {
      alert(
        "Tidak ada file PDF yang siap diupload."
      );
      return;
    }

    try {
      setIsUploading(true);

      // -----------------------------------------
      // Pending -> Uploading
      // -----------------------------------------

      setBulkFiles((prev) => {
        const updated = prev.map(
          (item) =>
            item.status === "Pending"
              ? {
                  ...item,
                  status: "Uploading",
                  progress: 0,
                  error: "",
                }
              : item
        );

        return updated;
      });

      // -----------------------------------------
      // Buat batch 10 file
      // -----------------------------------------

      const batches =
        createBatches(
          validFiles,
          BATCH_SIZE
        );

      console.log(
        "================================="
      );

      console.log(
        "TOTAL FILE:",
        validFiles.length
      );

      console.log(
        "BATCH SIZE:",
        BATCH_SIZE
      );

      console.log(
        "TOTAL BATCH:",
        batches.length
      );

      console.log(
        "================================="
      );

      // -----------------------------------------
      // Ambil token
      // -----------------------------------------

      const auth =
        sessionStorage.getItem(
          "auth"
        );

      let accessToken = null;

      try {
        accessToken = auth
          ? JSON.parse(auth)
              ?.accessToken
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
        process.env
          .REACT_APP_API_BASE_URL;

      if (!apiBaseUrl) {
        throw new Error(
          "REACT_APP_API_BASE_URL belum tersedia."
        );
      }

      // -----------------------------------------
      // Upload batch berurutan
      // -----------------------------------------

      for (
        let i = 0;
        i < batches.length;
        i++
      ) {
        const batch = batches[i];

        console.log(
          `Upload batch ${
            i + 1
          } dari ${batches.length}`
        );

        console.log(
          "File:",
          batch.map(
            (item) => item.name
          )
        );

        // ---------------------------------------
        // FormData
        // ---------------------------------------

        const formData =
          new FormData();

        batch.forEach((item) => {
          formData.append(
            "files[]",
            item.file
          );
        });

        try {
          // -------------------------------------
          // AXIOS REQUEST
          // -------------------------------------

          /*
           * JANGAN set Content-Type manual.
           *
           * Browser/Axios akan membuat:
           * multipart/form-data;
           * boundary=....
           */

          const response =
            await axios.post(
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

          const result =
            response.data;

          console.log(
            `HASIL BATCH ${
              i + 1
            }:`,
            result
          );

          // -------------------------------------
          // RESPONSE SUCCESS
          // -------------------------------------

          if (
            result?.success === true
          ) {
            applySuccessResponse(
              batch,
              result
            );
          }

          // -------------------------------------
          // RESPONSE FAILED
          // -------------------------------------

          else {
            applyFailedResponse(
              batch,
              result
            );
          }
        } catch (batchError) {
          console.error(
            `Batch ${
              i + 1
            } gagal:`,
            batchError
          );

          const errorMessage =
            getErrorMessage(
              batchError
            );

          // ---------------------------------------
          // Kalau HTTP error
          // ---------------------------------------

          setBulkFiles((prev) => {
            const updated =
              prev.map((item) => {
                const batchItem =
                  batch.find(
                    (batchFile) =>
                      batchFile.id ===
                      item.id
                  );

                if (!batchItem) {
                  return item;
                }

                return {
                  ...item,
                  status: "Failed",
                  progress: 0,
                  error:
                    errorMessage,
                };
              });

            return updated;
          });
        }

        // -----------------------------------------
        // Update progress setelah batch selesai
        // -----------------------------------------

        setBulkFiles((prev) => {
          const updated = [...prev];

          const summary =
            calculateSummary(
              updated
            );

          setUploadSummary(
            summary
          );

          return updated;
        });
      }

      // -----------------------------------------
      // FINAL SUMMARY
      // -----------------------------------------

      setBulkFiles((prev) => {
        const summary =
          calculateSummary(prev);

        setUploadSummary(
          summary
        );

        return prev;
      });

      console.log(
        "================================="
      );

      console.log(
        "SEMUA BATCH SELESAI"
      );

      console.log(
        "================================="
      );
    } catch (error) {
      console.error(
        "Bulk upload error:",
        error
      );

      const errorMessage =
        getErrorMessage(error);

      setBulkFiles((prev) => {
        const updated = prev.map(
          (item) =>
            item.status ===
            "Uploading"
              ? {
                  ...item,
                  status: "Failed",
                  progress: 0,
                  error:
                    errorMessage,
                }
              : item
        );

        const summary =
          calculateSummary(
            updated
          );

        setUploadSummary(
          summary
        );

        return updated;
      });
    } finally {
      setIsUploading(false);

      setBulkFiles((prev) => {
        const summary =
          calculateSummary(prev);

        setUploadSummary(
          summary
        );

        return prev;
      });
    }
  };

  // =========================================================
  // RETRY
  // =========================================================

  const retryBulkFile = (
    fileItem
  ) => {
    setBulkFiles((prev) => {
      const updated = prev.map(
        (item) =>
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

      const summary =
        calculateSummary(
          updated
        );

      setUploadSummary(
        summary
      );

      return updated;
    });
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalFiles =
    bulkFiles.length;

  const successFiles =
    bulkFiles.filter(
      (file) =>
        file.status === "Success"
    ).length;

  const uploadingFiles =
    bulkFiles.filter(
      (file) =>
        file.status === "Uploading"
    ).length;

  const pendingFiles =
    bulkFiles.filter(
      (file) =>
        file.status === "Pending"
    ).length;

  const failedFiles =
    bulkFiles.filter(
      (file) =>
        file.status === "Failed" ||
        file.status === "Error"
    ).length;

  const progressPercentage =
    totalFiles > 0
      ? Math.round(
          ((successFiles +
            failedFiles) /
            totalFiles) *
            100
        )
      : 0;

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // -----------------------------------------
    // REF
    // -----------------------------------------

    fileInputRef,
    folderInputRef,

    // -----------------------------------------
    // STATE
    // -----------------------------------------

    bulkFiles,
    setBulkFiles,

    isDragging,

    isAddMenuOpen,
    setIsAddMenuOpen,

    isUploading,

    // -----------------------------------------
    // CONFIG
    // -----------------------------------------

    BATCH_SIZE,
    MAX_FILE_SIZE,

    // -----------------------------------------
    // SUMMARY
    // -----------------------------------------

    uploadSummary,

    // -----------------------------------------
    // FILE HANDLING
    // -----------------------------------------

    createBulkFileItem,
    validateBulkFile,

    handleBulkFiles,
    handleBulkInputChange,
    handleFolderInputChange,

    // -----------------------------------------
    // DRAG & DROP
    // -----------------------------------------

    handleDrop,
    handleDragOver,
    handleDragLeave,

    // -----------------------------------------
    // FILE ACTIONS
    // -----------------------------------------

    removeBulkFile,
    clearBulkFiles,
    retryBulkFile,

    // -----------------------------------------
    // UPLOAD
    // -----------------------------------------

    createBatches,
    uploadBulkFiles,

    // -----------------------------------------
    // HELPER
    // -----------------------------------------

    formatFileSize,
    getStatusStyle,

    // -----------------------------------------
    // STATISTICS
    // -----------------------------------------

    totalFiles,
    successFiles,
    uploadingFiles,
    pendingFiles,
    failedFiles,
    progressPercentage,
  };
};