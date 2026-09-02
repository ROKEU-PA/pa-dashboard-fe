import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import {
  columns,
  getCurrentSatuanKerja,
  isPengajuanPath,
} from "@/pages/ListSatuankerja/satkerHooks";

export function useSatkerLogic() {
  const { listMenu, userData } = useContext(AppContext);
  const location = useLocation();

  const auth = sessionStorage.getItem("auth");
  const accessToken = auth ? JSON.parse(auth)?.accessToken : null;

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [currentMenu, setCurrentMenu] = useState(
    getCurrentSatuanKerja(listMenu, location.pathname),
  );

  const [filter, setFilter] = useState({
    tahun: "",
    searchKey: "",
    startDate: null,
    endDate: null,
  });

  // Table & Pagination States
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  // Modal States (Tinggal Add/Edit & PDF)
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenPDF, setIsOpenPDF] = useState(false);
  const [letiantModal, setVariantModal] = useState("");
  const [pdfToOpen, setPDFtoOpen] = useState("");
  const [showModal, setShowModal] = useState("true");
  const [isOpenMergeModal, setIsOpenMergeModal] = useState(false);

  // Form & Input States
  const [types, setTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [jenisFile, setJenisFile] = useState("file");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    no_spp: "",
    tahun: "",
    type: "",
    type_id: "",
    dokumen: null,
    dokumen_spm: null,
    dokumen_sp2d: null,
    uploaded_by: "",
    status: "",
    kelengkapan: [],
    catatan: "",
    verifikasi: [],
    is_edit: null,
    link: "",
    jml_hal: 0,
  });
  const [archiveFile, setArchiveFile] = useState("");
  const [isLoadingMerge, setIsLoadingMerge] = useState("");

  // ==========================================
  // 2. HANDLERS (Perubahan Input & Filter)
  // ==========================================
  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };

  const handleDateChange = (key, value) => {
    setFilter((prev) => {
      const newFilter = { ...prev, [key]: value };
      if (
        key === "startDate" &&
        newFilter.endDate &&
        value > newFilter.endDate
      ) {
        newFilter.endDate = null;
      }
      return newFilter;
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  const getAcceptedFileType = () => ".pdf,.PDF,.rar,.RAR,.zip,.ZIP";

  const isFileSizeValid = (file, maxSizeMB = 100) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  // ==========================================
  // 3. API CALLS
  // ==========================================
  const fetchTable = async () => {
    try {
      const now = isPengajuanPath(location.pathname)
        ? new Date().getFullYear()
        : filter.tahun;
      const status = isPengajuanPath(location.pathname) ? "arsip" : null;
      const query = buildQueryString({
        biro_code: currentMenu?.code ?? filter.satker,
        tahun: now,
        status: status,
        search_key: filter.searchKey,
        page: page + 1,
        per_page: rowsPerPage,
        sort_by: sortBy,
        sort_dir: sortDir,
        start_date: filter.startDate
          ? moment(filter.startDate).format("YYYY-MM-DD")
          : "",
        end_date: filter.endDate
          ? moment(filter.endDate).format("YYYY-MM-DD")
          : "",
      });

      const data = await apiRequest({
        url: `/archive/list?${query}`,
        token: accessToken,
      });
      if (data?.success) {
        setTotalPages(data.data?.last_page);
        setDataTable(data.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchType = async (id) => {
    try {
      if (id) {
        const data = await apiRequest({ url: `/pa/spp/type?id=` + id });
        const verif = await apiRequest({ url: `/pa/spp/type?id=verifikasi` });
        if (data.success) {
          setQuestions(data.data[0].questions);
          setVerifications(verif.data[0].questions);
        }
      } else {
        const data = await apiRequest({ url: `/pa/spp/type?id=` });
        if (data.success) {
          const filteredResult = data.data.filter(
            (item) => item.type_id !== "verifikasi",
          );
          setTypes(filteredResult);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitData = async (formDataToSubmit) => {
    try {
      let CryptoJS = require("crypto-js");
      let encryptedLink = CryptoJS.AES.encrypt(
        formDataToSubmit.link || "",
        "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk",
      ).toString();
      const finalJmlHal = Number(formDataToSubmit.jml_hal) || 0;

      const payload = new FormData();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formDataToSubmit.no_spp);
      payload.append("jenis_spp", formDataToSubmit.type);
      payload.append("tahun", formDataToSubmit.tahun);
      payload.append("dokumen", formDataToSubmit.dokumen[0]);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", finalJmlHal);
      payload.append(
        "feedback",
        formDataToSubmit.catatan ?? formDataToSubmit.feedback,
      );
      if (!isPengajuanPath(location.pathname)) {
        payload.append("status", "arsip");
      }
      payload.append("uploaded_name", formDataToSubmit.uploaded_by);

      if (formDataToSubmit.dokumen !== null) {
        const defaultToken = JSON.parse(
          sessionStorage.getItem("auth"),
        )?.accessToken;
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const toastId = toast.info("Uploading file...", {
            progress: 0,
            autoClose: false,
            closeButton: false,
            isLoading: true,
          });
          xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              toast.update(toastId, {
                render: `Uploading file... (${percent}%)`,
                progress: percent / 100,
              });
            }
          };
          xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 201) {
              toast.update(toastId, {
                render: "File berhasil diupload!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              resolve(xhr.response);
            } else {
              toast.update(toastId, {
                render: "Upload gagal. Silakan coba lagi.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
              reject(new Error("Upload gagal"));
            }
          };
          xhr.onerror = function () {
            toast.update(toastId, {
              render: "Terjadi kesalahan jaringan.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
            reject(new Error("Network error"));
          };
          xhr.open(
            "POST",
            `${process.env.REACT_APP_API_BASE_URL}/archive/create`,
          );
          xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
          xhr.send(payload);
        });
      } else {
        await apiRequest({
          url: "/archive/create",
          method: "POST",
          options: {
            body: payload,
          },
          isMultiType: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupload data.");
      throw error; // Lempar error biar ditangkap di caller
    }
  };

  const editData = async (formDataToEdit) => {
    try {
      const payload = new FormData();
      let CryptoJS = require("crypto-js");
      let encryptedLink = CryptoJS.AES.encrypt(
        formDataToEdit.link || "",
        "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk",
      ).toString();
      const finalJmlHal = Number(formDataToEdit.jml_hal) || 0;

      payload.append(
        "kode_biro",
        currentMenu?.code ?? formDataToEdit.kode_biro,
      );
      payload.append("no_spp", formDataToEdit.no_spp);
      payload.append(
        "feedback",
        formDataToEdit.catatan ?? formDataToEdit.feedback,
      );
      payload.append("status", formDataToEdit.status);
      payload.append("questions", JSON.stringify(formDataToEdit.kelengkapan));
      payload.append(
        "verifications",
        JSON.stringify(formDataToEdit.verifikasi),
      );
      payload.append(
        "jenis_spp",
        /[A-Z]/.test(formDataToEdit.type)
          ? formDataToEdit.type_id
          : formDataToEdit.type,
      );
      payload.append("tahun", formDataToEdit.tahun);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", finalJmlHal);
      payload.append("is_edit", letiantModal === "Edit" ? "true" : "false");

      const hasFileUpload =
        formDataToEdit.dokumen instanceof File ||
        formDataToEdit.dokumen_spm instanceof File ||
        formDataToEdit.dokumen_sp2d instanceof File ||
        formDataToEdit.dokumen instanceof FileList ||
        formDataToEdit.dokumen_spm instanceof FileList ||
        formDataToEdit.dokumen_sp2d instanceof FileList;

      if (
        formDataToEdit.dokumen instanceof File ||
        formDataToEdit.dokumen instanceof FileList
      ) {
        payload.append(
          "dokumen",
          formDataToEdit.dokumen[0] || formDataToEdit.document[0],
        );
      }
      if (
        formDataToEdit.dokumen_spm instanceof File ||
        formDataToEdit.dokumen_spm instanceof FileList
      ) {
        payload.append("dokumen_spm", formDataToEdit.dokumen_spm[0]);
      }
      if (
        formDataToEdit.dokumen_sp2d instanceof File ||
        formDataToEdit.dokumen_sp2d instanceof FileList
      ) {
        payload.append("dokumen_sp2d", formDataToEdit.dokumen_sp2d[0]);
      }

      const defaultToken = JSON.parse(
        sessionStorage.getItem("auth"),
      )?.accessToken;

      if (hasFileUpload) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          const toastId = toast.info("Uploading file...", {
            progress: 0,
            autoClose: false,
            closeButton: false,
            isLoading: true,
          });

          xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              toast.update(toastId, {
                render: `Uploading file... (${percent}%)`,
                progress: percent / 100,
              });
            }
          };

          xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 201) {
              toast.update(toastId, {
                render: "File berhasil diupload!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              resolve(xhr.response);
            } else {
              toast.update(toastId, {
                render: "Upload gagal. Silakan coba lagi.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
              reject(new Error("Upload gagal"));
            }
          };

          xhr.onerror = function () {
            toast.update(toastId, {
              render: "Terjadi kesalahan jaringan.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
            reject(new Error("Network error"));
          };

          xhr.open(
            "POST",
            `${process.env.REACT_APP_API_BASE_URL}/archive/edit/${formDataToEdit?.id}`,
          );
          xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
          xhr.send(payload);
        });
      } else {
        await apiRequest({
          url: `/archive/edit/${formDataToEdit?.id}`,
          method: "POST",
          options: {
            body: payload,
          },
          isMultiType: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupload data.");
      throw error;
    }
  };

  const checklistIsValid = (dataToCheck = formData) => {
    const strictStatuses = ["approved", "sp2d"];

    const kelengkapanChecked = dataToCheck.kelengkapan.map((item) => item.value);
    const verifikasiChecked = dataToCheck.verifikasi.map((item) => item.value);

    const allKelengkapanChecked = (questions || []).every((q) =>
      kelengkapanChecked.includes(q.id_question),
    );
    const allVerifikasiChecked = (verifications || []).every((v) =>
      verifikasiChecked.includes(v.id_question),
    );

    const isAllChecked = allKelengkapanChecked && allVerifikasiChecked;
    const hasQuestions = (questions?.length > 0) || (verifications?.length > 0);

    if (strictStatuses.includes(dataToCheck.status)) {
      if (!isAllChecked) {
        return { 
          valid: false, 
          message: "Semua Kelengkapan & Verifikasi harus dicentang untuk status ini." 
        };
      }
    }

    if (isAllChecked && hasQuestions) {
      if (!strictStatuses.includes(dataToCheck.status)) {
        return { 
          valid: false, 
          message: "Karena semua persyaratan terpenuhi, status wajib diubah menjadi 'Diproses (Lengkap)'." 
        };
      }
    }

    return { valid: true };
  };

  // HANYA UNTUK MODAL ADD/EDIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isAnyFile = formData?.dokumen || formData?.document;
    formData.type = formData.type_id;
    try {
      if (
        letiantModal === "Add" &&
        isAnyFile &&
        isPengajuanPath(location.pathname)
      ) {
        if (
          !formData?.["no_spp"] ||
          !formData.tahun ||
          !formData.type ||
          !formData.uploaded_by ||
          !formData.dokumen
        ) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else if (
        letiantModal === "Add" &&
        isAnyFile &&
        !isPengajuanPath(location.pathname)
      ) {
        if (
          !formData?.["no_spp"] ||
          !formData.tahun ||
          !formData.type ||
          !formData.dokumen
        ) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else if (letiantModal === "Edit") {
        if (!formData?.["no_spp"] || !formData.tahun || !formData.type) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      }

      if (isAnyFile && formData.dokumen) {
        const file = formData.dokumen;
        // console.log(file)
        const acceptedExtension = getAcceptedFileType()
          .replace(/\s+/g, "")
          .split(",");

        const fileName = file[0].name?.toLowerCase();
        const isAccepted = acceptedExtension.some((ext) =>
          fileName.endsWith(ext),
        );

        if (!isAccepted) {
          toast.error(
            `File yang diizinkan hanya: ${acceptedExtension.join(", ")}`,
          );
          return;
        }

        const isArchive =
          fileName.endsWith(".zip") || fileName.endsWith(".rar");
        const sizeInBytes = file[0].size;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (isArchive && sizeInMB < 50) {
          toast.error(
            "Jika ukuran file di bawah 50MB, mohon unggah langsung dalam format PDF (jangan di-ZIP/RAR). Bisa gunakan fitur Gabungkan PDF dibawah tombol tambah pengajuan",
          );
          return;
        }

        const maxSize =
          formData.type_id === "ptup" ||
          formData.type_id === "gup" ||
          formData.type_id === "uptup" ||
          formData.type_id === "gup_kkp" ||
          formData.type_id === "gup_pnbp" ||
          formData.type_id === "gup_rm" ||
          formData.type_id === "ptup_rm" ||
          formData.type_id === "ptup_pnbp"
            ? 1536
            : 200;

        if (!isFileSizeValid(file[0], maxSize)) {
          toast.error("Ukuran file melebihi " + maxSize + "MB");
          return;
        }
      }

      if (letiantModal === "Add") {
        await submitData(formData);
      } else {
        await editData(formData);
      }

      toast.success("Data berhasil disimpan!");
      setIsOpenModal(false);
      setFormData({
        no_spp: "",
        tahun: "",
        type: "",
        type_id: "",
        dokumen: null,
        uploaded_by: "",
        kelengkapan: [],
        catatan: "",
        verifikasi: [],
        link: "",
        jml_hal: 0,
      });
      fetchTable();
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi. " + err);
    }
  };

  // ==========================================
  // 4. MODAL OPENERS
  // ==========================================
  const openAddModal = () => {
    setIsOpenModal(true);
    setVariantModal("Add");
    setFormData((prev) => ({ ...prev, tahun: moment().year() }));
  };

  const openMergeModal = () => {
    setIsOpenMergeModal(true);
  };

  const openEditModal = (row) => {
    if (row.document?.filename?.includes("file_drive")) {
      setJenisFile("link");
    } else {
      setJenisFile("file");
    }
    setVariantModal("Edit");
    setFormData({ ...row, type: row.jenis_spp, link: row.document?.path });
    setIsOpenModal(true);
  };

  const openPDFModal = (url) => {
    if (typeof url === "string") {
      setIsOpenPDF(true);
      setPDFtoOpen(url);
    }
  };

  const handleMergeSubmit = async (e) => {
    e.preventDefault();
    if (!archiveFile) return;

    setIsLoadingMerge(true);

    const formData = new FormData();
    formData.append("archive_file", archiveFile);

    const defaultToken = JSON.parse(
      sessionStorage.getItem("auth"),
    )?.accessToken;

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const toastId = toast.info("Mengunggah & memproses file...", {
          progress: 0,
          autoClose: false,
          closeButton: false,
          isLoading: true,
        });

        // 🔥 WAJIB: Set response ke blob biar nerima file PDF
        xhr.responseType = "blob";

        // --- TRACKING PROGRESS UPLOAD ---
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);

            // Trik: Mentokin di 99% saat upload selesai, karena server butuh waktu buat nge-merge PDF
            const displayPercent = percent === 100 ? 99 : percent;

            toast.update(toastId, {
              render: `Memproses file... (${displayPercent}%)`,
              progress: percent / 100,
            });
          }
        };

        // --- KETIKA RESPONSE DARI SERVER KEMBALI ---
        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 201) {
            toast.update(toastId, {
              render: "Berhasil digabungkan & diunduh!",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });

            // 1. Ambil file Blob dari server
            const blob = xhr.response;
            const url = window.URL.createObjectURL(blob);

            // 2. Bikin link gaib buat trigger auto-download
            const link = document.createElement("a");
            link.href = url;

            // 3. Tangkap nama file dari header Nginx/Backend (Content-Disposition)
            const contentDisposition = xhr.getResponseHeader(
              "Content-Disposition",
            );
            let fileName = "arsip_gabungan.pdf";
            if (contentDisposition) {
              const fileNameMatch =
                contentDisposition.match(/filename="?([^"]+)"?/);
              if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
              }
            }

            // 4. Eksekusi Download & Bersihkan Memori
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            resolve(xhr.response);
          } else {
            // JIKA ERROR (Misal 422 Penamaan Salah atau 500)
            const errorBlob = xhr.response;

            // Karena responseType "blob", kita harus baca JSON error pakai FileReader
            if (errorBlob instanceof Blob) {
              const reader = new FileReader();
              reader.onload = function () {
                try {
                  const errData = JSON.parse(reader.result);
                  toast.update(toastId, {
                    render:
                      errData.message ||
                      "Upload gagal. Format file mungkin salah.",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000, // Agak lama biar user sempat baca
                  });
                } catch (e) {
                  toast.update(toastId, {
                    render: "Gagal memproses file. Silakan coba lagi.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                  });
                }
              };
              reader.readAsText(errorBlob); // Ubah blob jadi text json
            } else {
              toast.update(toastId, {
                render: "Upload gagal. Silakan coba lagi.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
            }
            reject(new Error("Upload gagal"));
          }
        };

        xhr.onerror = function () {
          toast.update(toastId, {
            render: "Terjadi kesalahan jaringan.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          reject(new Error("Network error"));
        };

        // 🔥 GANTI URL INI SESUAI ENDPOINT MERGE PDF LU
        xhr.open("POST", `${process.env.REACT_APP_API_BASE_URL}/archive/pdf/merge`);
        xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
        xhr.send(formData);
      });

      // Kalau sukses, tutup modal dan bersihkan form
      setIsOpenMergeModal(false);
      setArchiveFile(null);
    } catch (error) {
      console.error("Proses merge dihentikan:", error);
    } finally {
      setIsLoadingMerge(false);
    }
  };

  return {
    // Data & Context
    userData,
    location,
    currentMenu,
    columns,
    dataTable,
    types,
    questions,
    verifications,
    errorMessage,
    listMenu,

    // States
    filter,
    page,
    rowsPerPage,
    totalPages,
    sortBy,
    sortDir,
    formData,
    jenisFile,
    pdfToOpen,

    // Modal Flags
    isOpenModal,
    isOpenPDF,
    letiantModal,

    // Setters
    setPage,
    setRowsPerPage,
    setFilter,
    setFormData,
    setJenisFile,
    setIsOpenModal,
    setIsOpenPDF,
    setVariantModal,
    setPDFtoOpen,
    setErrorMessage,
    setArchiveFile,
    setCurrentMenu,
    isLoadingMerge,

    // Handlers
    handleSortChange,
    handleDateChange,
    handleChange,
    handleSubmit,
    checklistIsValid,
    handleMergeSubmit,

    // Action Openers
    openAddModal,
    openEditModal,
    openPDFModal,
    setShowModal,
    showModal,
    isOpenMergeModal,
    setIsOpenMergeModal,
    openMergeModal,

    // API Calls (Di-export untuk dipakai di Halaman Review)
    fetchType,
    editData,
    fetchTable,
  };
}
