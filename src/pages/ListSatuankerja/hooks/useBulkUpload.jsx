import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CircleCheck, Clock3, AlertCircle } from "lucide-react";

export const useBulkUpload = () => {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const uploadLockRef = useRef(false);

  const [bulkFiles, setBulkFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const BATCH_SIZE = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const [uploadSummary, setUploadSummary] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
    uploading: 0,
    completed: false,
  });

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
    extractedData: null,
    minioPath: "",
    pagesDetected: null,
  });

  const validateBulkFile = (file) => {
    if (!file || !file.name) {
      return {
        valid: false,
        error: "File tidak valid.",
      };
    }

    const fileName = file.name.toLowerCase();

    if (
      file.type !== "application/pdf" &&
      !fileName.endsWith(".pdf")
    ) {
      return {
        valid: false,
        error: "Format file harus PDF.",
      };
    }

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

  const handleBulkFiles = (fileList) => {
    if (uploadLockRef.current) return;

    const files = Array.from(fileList || []);

    if (!files.length) return;

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

  const handleBulkInputChange = (event) => {
    handleBulkFiles(event.target.files);
    event.target.value = "";
    setIsAddMenuOpen(false);
  };

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
      const relativePath = file.webkitRelativePath || file.name;

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

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (uploadLockRef.current) return;

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

  const removeBulkFile = (id) => {
    if (uploadLockRef.current) return;

    setBulkFiles((prev) => {
      const updated = prev.filter((file) => file.id !== id);
      setUploadSummary(calculateSummary(updated));
      return updated;
    });
  };

  const clearBulkFiles = () => {
    if (uploadLockRef.current) return;

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

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.ceil(bytes / 1024)} KB`;
  };

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

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Upload gagal."
    );
  };

  const normalizeFileName = (value) => {
    return String(value || "")
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      .trim()
      .toLowerCase();
  };

  const findFileDetail = (batchItem, details) => {
    if (!Array.isArray(details)) return null;

    const fileName =
      batchItem?.name ||
      batchItem?.file?.name ||
      "";

    const normalizedFileName = normalizeFileName(fileName);

    return details.find((detail) => {
      const responseFileName =
        detail?.originalfilename_ ||
        detail?.filename ||
        detail?.name ||
        "";

      return (
        normalizeFileName(responseFileName) ===
        normalizedFileName
      );
    });
  };

  const applySuccessResponse = (batch, result) => {
    const details = Array.isArray(result?.details)
      ? result.details
      : [];

    setBulkFiles((prev) => {
      const updated = prev.map((item) => {
        const batchItem = batch.find(
          (batchFile) => batchFile.id === item.id
        );

        if (!batchItem) return item;

        const detail = findFileDetail(batchItem, details);

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
              extractedData: detail.extracteddata_ ?? null,
              minioPath: detail.miniopath_ ?? "",
              pagesDetected: detail.pagesdetected_ ?? null,
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
            extractedData: detail.extracteddata_ ?? null,
            minioPath: detail.miniopath_ ?? "",
            pagesDetected: detail.pagesdetected_ ?? null,
          };
        }

        if (result?.success === true && details.length === 0) {
          return {
            ...item,
            status: "Success",
            progress: 100,
            error: "",
          };
        }

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

        if (!batchItem) return item;

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

  const uploadBulkFiles = async () => {
    if (uploadLockRef.current) return;

    const validFiles = bulkFiles.filter((item) => {
      const validation = validateBulkFile(item.file);

      return (
        item.status === "Pending" &&
        validation.valid
      );
    });

    if (!validFiles.length) {
      alert("Tidak ada file PDF yang siap diupload.");
      return;
    }

    uploadLockRef.current = true;

    const toastId = toast.loading(
      "Mengunggah dokumen massal... 0%",
      {
        position: "top-right",
        autoClose: false,
        closeButton: false,
      }
    );

    try {
      setIsUploading(true);

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

      const batches = createBatches(
        validFiles,
        BATCH_SIZE
      );

      const auth = sessionStorage.getItem("auth");
      let accessToken = null;

      try {
        accessToken = auth
          ? JSON.parse(auth)?.accessToken
          : null;
      } catch (error) {
        console.error("Gagal membaca auth session:", error);
      }

      const apiBaseUrl =
        import.meta.env.REACT_APP_API_BASE_URL;

      if (!apiBaseUrl) {
        throw new Error(
          "REACT_APP_API_BASE_URL belum tersedia."
        );
      }

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const formData = new FormData();

        batch.forEach((item) => {
          formData.append("files[]", item.file);
        });

        try {
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
              onUploadProgress: (event) => {
                if (!event.total) return;

                const batchProgress = Math.round(
                  (event.loaded / event.total) * 100
                );

                const overallProgress = Math.round(
                  ((i + batchProgress / 100) /
                    batches.length) *
                    100
                );

                toast.update(toastId, {
                  render: `Mengunggah dokumen massal... ${overallProgress}%`,
                  progress: overallProgress / 100,
                  isLoading: true,
                  autoClose: false,
                });
              },
            }
          );

          const result = response.data;

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

              if (!batchItem) return item;

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

        const progress = Math.round(
          ((i + 1) / batches.length) * 100
        );

        toast.update(toastId, {
          render: `Mengunggah dokumen massal... ${progress}%`,
          progress: progress / 100,
          isLoading: true,
          autoClose: false,
        });

        setBulkFiles((prev) => {
          setUploadSummary(calculateSummary(prev));
          return prev;
        });
      }

      setBulkFiles((prev) => {
        setUploadSummary(calculateSummary(prev));
        return prev;
      });

      toast.update(toastId, {
        render: "Proses upload massal selesai!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } catch (error) {
      console.error("Bulk upload error:", error);

      toast.update(toastId, {
        render: "Upload massal gagal!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

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
      uploadLockRef.current = false;
      setIsUploading(false);

      setBulkFiles((prev) => {
        setUploadSummary(calculateSummary(prev));
        return prev;
      });
    }
  };

  const retryBulkFile = (fileItem) => {
    if (uploadLockRef.current) return;

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

  return {
    fileInputRef,
    folderInputRef,

    bulkFiles,
    setBulkFiles,
    isDragging,
    isAddMenuOpen,
    setIsAddMenuOpen,
    isUploading,

    BATCH_SIZE,
    MAX_FILE_SIZE,

    uploadSummary,

    createBulkFileItem,
    validateBulkFile,
    handleBulkFiles,
    handleBulkInputChange,
    handleFolderInputChange,

    handleDrop,
    handleDragOver,
    handleDragLeave,

    removeBulkFile,
    clearBulkFiles,
    retryBulkFile,

    createBatches,
    uploadBulkFiles,

    formatFileSize,
    getStatusStyle,

    totalFiles,
    successFiles,
    uploadingFiles,
    pendingFiles,
    failedFiles,
    progressPercentage,
  };
};