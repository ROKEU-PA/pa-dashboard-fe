import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
// Import konstanta dan helper yang sudah Anda miliki
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

  // Modal States
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCheckModal, setIsCheckModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isOpenPDF, setIsOpenPDF] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [letiantModal, setVariantModal] = useState("");
  const [pdfToOpen, setPDFtoOpen] = useState("");

  // Form & Input States
  const [types, setTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [jenisFile, setJenisFile] = useState("file");
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
        biro_code: currentMenu?.code,
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

  const submitData = async (formData) => {
    try {
      let CryptoJS = require("crypto-js");
      let encryptedLink = CryptoJS.AES.encrypt(
        formData.link,
        "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk",
      ).toString();

      const payload = new FormData();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("dokumen", formData.dokumen);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", formData.jml_hal);
      payload.append("feedback", formData.catatan ?? formData.feedback);
      if (!isPengajuanPath(location.pathname)) {
        payload.append("status", "arsip");
      }
      payload.append("uploaded_name", formData.uploaded_by);

      if (formData.dokumen !== null) {
        //const defaultToken = localStorage.getItem("token");
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
              resolve(xhr.response); // ✅ sukses → Promise resolve
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
        const result = await apiRequest({
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
    }
  };

  const editData = async (formData) => {
    try {
      const payload = new FormData();
      let CryptoJS = require("crypto-js");
      let encryptedLink = CryptoJS.AES.encrypt(
        formData.link,
        "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk",
      ).toString();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("feedback", formData.catatan ?? formData.feedback);
      payload.append("status", formData.status);
      payload.append("questions", JSON.stringify(formData.kelengkapan));
      payload.append("verifications", JSON.stringify(formData.verifikasi));
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", formData.jml_hal);
      payload.append("is_edit", letiantModal === "Edit" ? "true" : "false");

      const hasFileUpload =
        formData.dokumen instanceof File ||
        formData.dokumen_spm instanceof File ||
        formData.dokumen_sp2d instanceof File;

      if (formData.dokumen instanceof File) {
        payload.append("dokumen", formData.dokumen || formData.document);
      }

      if (formData.dokumen_spm instanceof File) {
        payload.append("dokumen_spm", formData.dokumen_spm);
      }

      if (formData.dokumen_sp2d instanceof File) {
        payload.append("dokumen_sp2d", formData.dokumen_sp2d);
      }

      //const defaultToken = localStorage.getItem("token");
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
              resolve(xhr.response); // ✅ sukses → Promise resolve
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
            `${process.env.REACT_APP_API_BASE_URL}/archive/edit/${formData?.id}`,
          );
          xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
          xhr.send(payload);
        });
      } else {
        const result = await apiRequest({
          url: `/archive/edit/${formData?.id}`,
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
    }
  };

  const checklistIsValid = () => {
    if (formData.status === "approved" && isPengajuanPath(location.pathname)) {
      const kelengkapanChecked = formData.kelengkapan.map((item) => item.value);
      const verifikasiChecked = formData.verifikasi.map((item) => item.value);

      const allKelengkapanChecked = questions.every((q) =>
        kelengkapanChecked.includes(q.id_question),
      );

      const allVerifikasiChecked = verifications.every((v) =>
        verifikasiChecked.includes(v.id_question),
      );

      return allKelengkapanChecked && allVerifikasiChecked;
    }

    return true;
  };

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
      } else if (letiantModal === "Pengujian") {
        if (!formData.kelengkapan || !formData.status || !formData.verifikasi) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      }

      if (isAnyFile && formData.dokumen) {
        const file = formData.dokumen;
        const acceptedExtension = getAcceptedFileType()
          .replace(/\s+/g, "")
          .split(",");

        const fileName = file.name?.toLowerCase();
        const isAccepted = acceptedExtension.some((ext) =>
          fileName.endsWith(ext),
        );

        if (!isAccepted) {
          toast.error(
            `File yang diizinkan hanya: ${acceptedExtension.join(", ")}`,
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

        if (!isFileSizeValid(file, maxSize)) {
          toast.error("Ukuran file melebihi " + maxSize + "MB");
          return;
        }
      }

      if (!checklistIsValid()) {
        toast.error(
          "Semua Kelengkapan dan Verifikasi harus dicentang sebelum status dirubah Telah Diuji.",
        );
        return;
      }
      if (letiantModal === "Add") {
        await submitData(formData);
      } else {
        await editData(formData);
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Data berhasil disimpan!");
      setIsOpenModal(false);
      setIsCheckModal(false);
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
        jml_hal: "",
      });
      fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  // ==========================================
  // 4. MODAL OPENERS (Merapikan UI dari onClick yang panjang)
  // ==========================================
  const openAddModal = () => {
    setIsOpenModal(true);
    setVariantModal("Add");
    setFormData((prev) => ({ ...prev, tahun: moment().year() }));
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

  const openPengujianModal = (row) => {
    const kelengkapanWithLabel = questions
      .filter((q) => row.question_checklist?.includes(q.id_question))
      .map((q) => ({ label: q.text, value: q.id_question }));

    const verifikasiWithLabel = verifications
      .filter((v) => row.verification_checklist?.includes(v.id_question))
      .map((v) => ({ label: v.text, value: v.id_question }));

    setVariantModal("Pengujian");
    setFormData({
      ...row,
      type: row.jenis_spp,
      kelengkapan: kelengkapanWithLabel,
      verifikasi: verifikasiWithLabel,
      catatan: row.feedback,
    });
    fetchType(row.type_id);
    setPDFtoOpen(row.document?.url);
    setIsCheckModal(true);
  };

  const openDetailModal = (row) => {
    fetchType(row.type_id);
    setFormData({
      ...row,
      type: row.jenis_spp,
      kelengkapan: row.question_checklist,
      verifikasi: row.verification_checklist,
    });
    setIsDetailModal(true);
  };

  const openPDFModal = (url) => {
    if (typeof url === "string") {
      setIsOpenPDF(true);
      setPDFtoOpen(url);
    }
  };

  // ==========================================
  // 5. LIFECYCLE (Effects)
  // ==========================================
  useEffect(() => {
    fetchTable();
    fetchType();
    setCurrentMenu(getCurrentSatuanKerja(listMenu, location.pathname));
  }, [
    filter.tahun,
    filter.searchKey,
    page + 1,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
    listMenu,
    location.pathname,
  ]);

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
    isCheckModal,
    isDetailModal,
    isOpenPDF,
    showModal,
    letiantModal,

    // Setters
    setPage,
    setRowsPerPage,
    setFilter,
    setFormData,
    setJenisFile,
    setIsOpenModal,
    setIsCheckModal,
    setIsDetailModal,
    setIsOpenPDF,
    setShowModal,
    setVariantModal,

    // Handlers
    handleSortChange,
    handleDateChange,
    handleChange,
    handleSubmit,

    // Action Openers
    openAddModal,
    openEditModal,
    openPengujianModal,
    openDetailModal,
    openPDFModal,
  };
}
