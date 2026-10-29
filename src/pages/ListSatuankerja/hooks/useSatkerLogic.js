import { useState, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import CryptoJS from "crypto-js";
import {
  columns,
  getCurrentSatuanKerja,
  isPengajuanPath,
} from "@/pages/ListSatuankerja/satkerHooks";

export function useSatkerLogic() {
  let ENCRYPTION_KEY = import.meta.env.REACT_APP_ENCRYPTION_KEY;
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
    status: sessionStorage.getItem("espp_status_filter") || "",
  });


  // Table & Pagination States
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [jumlahDiprosesPIC, setJumlahDiprosesPIC] = useState(0);
  const [jumlahPerluDiperbaiki, setJumlahPerluDiperbaiki] =
    useState(0);
  const [jumlahPerluDiperbaikiPAPIC, setJumlahPerluDiperbaikiPAPIC] =
    useState(0);
  const [canSubmitTest, setCanSubmitTest] = useState(null);
  const [totalDiperbaikiRevGte1, setTotalDiperbaikiRevGte1] =
    useState(0);
  const [summaryNote, setSummaryNote] = useState("");
  // Summary khusus User
  const [canAddSubmission, setCanAddSubmission] = useState(null);
  const [userSummaryNote, setUserSummaryNote] = useState("");

  // Modal States (Tinggal Add/Edit & PDF)
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenPDF, setIsOpenPDF] = useState(false);
  const [variantModal, setVariantModal] = useState("");
  const [pdfToOpen, setPDFtoOpen] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isOpenMergeModal, setIsOpenMergeModal] = useState(false);

  // Form & Input States
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
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
    kategori_penerima: [],
    status_pegawai: null,
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
      if (key === "status") {
        sessionStorage.setItem("espp_status_filter", value);

        setPage(0);
        setFilter((prev) => ({
          ...prev,
          status: value,
        }));

        return;
      }

      setFilter((prev) => {
        const newFilter = {
          ...prev,
          [key]: value,
        };

        if (
          key === "startDate" &&
          newFilter.endDate &&
          value > newFilter.endDate
        ) {
          newFilter.endDate = "";
        }

        return newFilter;
      });
    };

    const handleStatusChange = (value) => {
      const status = value || "";

      sessionStorage.setItem("espp_status_filter", status);

      setPage(0);

      setFilter((prev) => ({
        ...prev,
        status,
      }));
    setPage(0);
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

  const fetchPicSummary = async () => {
    try {
      const res = await apiRequest({
        url: "/archive/pic-summary",
        token: accessToken,
      });

      if (!res?.success || !res?.data) return;

      const summary = res.data;

      setJumlahDiprosesPIC(
        Number(summary.list_approve?.total) || 0
      );

      setTotalDiperbaikiRevGte1(
        Number(summary.total_fix) || 0
      );

      setSummaryNote(summary.note || "");
    } catch (error) {
      console.error("Gagal mengambil summary PIC:", error);
    }
  };

  // TAMBAHAN BARU
  const getRevision = (item) =>
    Number(
      item?.rev_ ??
        item?.rev__ ??
        item?.revisi_ ??
        item?.revision_ ??
        0
    );

    const getUpdater = (item) => {
      const updater =
        item?.updated_by ??
        item?.update_by ??
        item?.updated_by__ ??
        item?.updated_by_ ??
        item?.update_by__ ??
        item?.update_by_ ??
        item?.diperbaiki_oleh__ ??
        item?.diperbaiki_oleh_;

      const updaterName =
        typeof updater === "object" && updater !== null
          ? updater.name
          : updater;

      return String(updaterName ?? "")
        .trim()
        .toUpperCase();
    };

      // Summary untuk User
      const fetchUserSummary = async () => {
        try {
          const res = await apiRequest({
            url: "/archive/user-summary",
            token: accessToken,
          });

          if (!res?.success || !res?.data) return;

          const summary = res.data;

          setJumlahPerluDiperbaikiPAPIC(
            Number(summary.total_fix_pic) || 0
          );

          setCanAddSubmission(
            summary.can_add_submission ?? null
          );

          setUserSummaryNote(summary.note || "");
        } catch (error) {
          console.error("Gagal mengambil summary User:", error);
        }
      };

  // ==========================================
  // 3. API CALLS
  // ==========================================
    const fetchTable = async () => {
      try {
        const isPengajuan = isPengajuanPath(location.pathname);

        const tahun = isPengajuan
          ? new Date().getFullYear()
          : filter.tahun;

        const status = isPengajuan ? "arsip" : null;

        const query = buildQueryString({
          biro_code: currentMenu?.code ?? filter?.satker,
          tahun,
          status,
          status_filter: filter.status || "",
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

        if (!data?.success) return;

        const rows = data?.data?.data || [];
        const totalData = Number(data?.data?.total ?? rows.length);

        const normalizeStatus = (value) =>
          String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, "");

        const selectedStatus = normalizeStatus(filter?.status);

        const filteredRows = !selectedStatus
          ? rows
          : rows.filter((item) => {
              const itemStatus = normalizeStatus(item?.status);

              if (selectedStatus === "diproses") {
                return ["fix", "diproses"].includes(itemStatus);
              }

              if (
                selectedStatus === "diproseslengkap" ||
                selectedStatus === "approved"
              ) {
                return ["approved", "diproseslengkap"].includes(itemStatus);
              }

              if (
                selectedStatus === "butuhperbaikan" ||
                selectedStatus === "perludiperbaiki"
              ) {
                return [
                  "fix",
                  "butuhperbaikan",
                  "perludiperbaiki",
                ].includes(itemStatus);
              }

              return itemStatus === selectedStatus;
            });

        setDataTable(filteredRows);

        setTotalPages(
          Math.max(1, Math.ceil(totalData / rowsPerPage))
        );
      } catch (error) {
        console.error("Gagal mengambil data SPP:", error);
      }
    };


    const fetchType = useCallback(async (id) => {
      try {
        if (id) {
          const data = await apiRequest({
            url: `/pa/spp/type?id=` + id,
          });

          const verif = await apiRequest({
            url: `/pa/spp/type?id=verifikasi`,
          });

          if (data.success) {
            setQuestions(data.data[0].questions);
            setVerifications(verif.data[0].questions);
          }
        } else {
          const data = await apiRequest({
            url: `/pa/spp/type?id=`,
          });

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
    }, []);


  const fetchCategories = async (id) => {
    try {
      if (id) {
        const data = await apiRequest({ url: `/pa/spp/category?id=` + id });
        if (data.success) {
          setCategories(data.data[0]);
        }
      } else {
        const data = await apiRequest({ url: `/pa/spp/category?id=` });
        if (data.success) {
          setCategories(data.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

const submitData = async (formDataToSubmit) => {
const payload = new FormData();

try {
  let CryptoJS = require("crypto-js");

  let encryptedLink = CryptoJS.AES.encrypt(
    formDataToSubmit.link || "",
    ENCRYPTION_KEY,
  ).toString();

const finalJmlHal = Number(formDataToSubmit.jml_hal) || 0;

const kodeBiro =
  currentMenu?.code || formDataToSubmit?.kode_biro || "";

const noSPP =
  formDataToSubmit?.no_spp || formDataToSubmit?.nospp || "";

const jenisSPP =
  formDataToSubmit?.type_id ||
  formDataToSubmit?.type ||
  formDataToSubmit?.jenis_spp ||
  "";

const tahun = formDataToSubmit?.tahun || "";

// Validasi field wajib
if (!kodeBiro || !noSPP || !jenisSPP || !tahun) {
  console.error("Data pengajuan tidak lengkap:", {
    kode_biro: kodeBiro,
    no_spp: noSPP,
    jenis_spp: jenisSPP,
    tahun,
    currentMenu,
    formDataToSubmit,
  });

  toast.error("Kode biro, No. SPP, Jenis SPP, dan Tahun wajib diisi.");
  return;
}

      // Field wajib
      payload.append("kode_biro", String(kodeBiro));
      payload.append("no_spp", String(noSPP));
      payload.append("jenis_spp", String(jenisSPP));
      payload.append(
        "employee_status",
        formDataToSubmit?.status_pegawai ?? ""
      );

      // Kategori penerima
      if (
        formDataToSubmit?.kategori_penerima &&
        formDataToSubmit.kategori_penerima.length > 0
      ) {
        formDataToSubmit.kategori_penerima.forEach((cat) => {
          payload.append("category[]", cat);
        });
      }

      payload.append("tahun", String(tahun));
      payload.append("dokumen", formDataToSubmit?.dokumen?.[0]);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", finalJmlHal);

      payload.append(
        "feedback",
        formDataToSubmit?.catatan ?? formDataToSubmit?.feedback ?? ""
      );

      if (!isPengajuanPath(location.pathname)) {
        payload.append("status", "arsip");
      }

      const uploadedBy =
        formDataToSubmit?.uploaded_by ||
        userData?.name ||
        "";

      if (uploadedBy) {
        payload.append("uploaded_by", uploadedBy);
      }

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
            `${import.meta.env.REACT_APP_API_BASE_URL}/archive/create`,
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
      let encryptedLink =
        formDataToEdit.link === null || formDataToEdit.link === undefined
          ? null
          : CryptoJS.AES.encrypt(
              formDataToEdit.link || "",
              ENCRYPTION_KEY,
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
      payload.append("employee_status", formDataToEdit.status_pegawai ?? null);
      if (
        formDataToEdit.kategori_penerima &&
        formDataToEdit.kategori_penerima.length > 0
      ) {
        formDataToEdit.kategori_penerima.forEach((cat) => {
          payload.append("category[]", cat);
        });
      }
      payload.append("tahun", formDataToEdit.tahun);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", finalJmlHal);
      payload.append("is_edit", variantModal === "Edit" ? "true" : "false");

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
            `${import.meta.env.REACT_APP_API_BASE_URL}/archive/edit/${formDataToEdit?.id}`,
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

    const kelengkapanChecked = dataToCheck.kelengkapan.map(
      (item) => item.value,
    );
    const verifikasiChecked = dataToCheck.verifikasi.map((item) => item.value);

    const allKelengkapanChecked = (questions || []).every((q) =>
      kelengkapanChecked.includes(q.id_question),
    );
    const allVerifikasiChecked = (verifications || []).every((v) =>
      verifikasiChecked.includes(v.id_question),
    );

    const isAllChecked = allKelengkapanChecked && allVerifikasiChecked;
    const hasQuestions = questions?.length > 0 || verifications?.length > 0;

    if (strictStatuses.includes(dataToCheck.status)) {
      if (!isAllChecked) {
        return {
          valid: false,
          message:
            "Semua Kelengkapan & Verifikasi harus dicentang untuk status ini.",
        };
      }
    }

    if (isAllChecked && hasQuestions) {
      if (!strictStatuses.includes(dataToCheck.status)) {
        return {
          valid: false,
          message:
            "Karena semua persyaratan terpenuhi, status wajib diubah menjadi 'Diproses (Lengkap)'.",
        };
      }
    }

    return { valid: true };
  };

  // HANYA UNTUK MODAL ADD/EDIT
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("HANDLE SUBMIT TERPANGGIL");

    let isAnyFile = formData?.dokumen || formData?.document;
    try {
      if (
        variantModal === "Add" &&
        isAnyFile &&
        isPengajuanPath(location.pathname)
      ) {
      if (
        !formData?.no_spp ||
        !formData.tahun ||
        !(formData.type_id || formData.type) ||
        !formData.dokumen
      ) {
        toast.error("Mohon lengkapi semua field yang diperlukan.");
        return;
      }
      } else if (
        variantModal === "Add" &&
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

        } else if (variantModal === "Edit") {
          const noSPP = String(formData?.no_spp ?? formData?.nospp ?? "").trim();
          const tahun = String(formData?.tahun ?? "").trim();
          const jenisSPP = formData?.type_id || formData?.type || formData?.jenis_spp;

          if (!noSPP || !tahun || !String(jenisSPP ?? "").trim()) {
            console.log("Validasi Edit SPP:", {
              no_spp: noSPP,
              tahun,
              type: formData?.type,
              type_id: formData?.type_id,
              jenis_spp: formData?.jenis_spp,
            });

            toast.error("No. SPP, Tahun, dan Jenis SPP wajib diisi.");
            return;
          }
        }

      const typeName =
        (types || [])
          .find((t) => t.type_id === formData?.type_id)
          ?.type?.toLowerCase() || "";

      const isLsBendahara =
        typeName.includes("ls bendahara") || typeName.includes("ls_bendahara");

      if (kategoriOptions.length > 0) {
        const selectedKategori = formData?.kategori_penerima || [];

        if (!isLsBendahara && selectedKategori.length === 0) {
          toast.error("Kategori Penerima wajib dipilih minimal satu!");
          return; // Hentikan proses submit
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

      if (variantModal === "Add") {
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
        kategori_penerima: [],
        status_pegawai: null,
        jml_hal: 0,
      });
      await fetchTable();
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
    setFormData({
      ...row,
      type: row.jenis_spp,
      link: jenisFile === "file" ? null : row.document?.path,
      kategori_penerima: row.category || [],
    });
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

        xhr.open(
          "POST",
          `${import.meta.env.REACT_APP_API_BASE_URL}/archive/pdf/merge`,
        );
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

  const selectedTypeName =
    (types || [])
      .find((t) => t.type_id === formData?.type_id)
      ?.type?.toLowerCase() || "";

  const getKategoriOptions = (name, masterCategories = []) => {
    if (!name) return [];
    const typeName = name.toLowerCase();
    const biroIds = [
      "rokeu",
      "romas",
      "rokum",
      "rosdm",
      "rocan",
      "roum",
      "roks",
      "ppsdm",
      "poltek",
    ];
    let allowedIds = [];

    // 2. Tentukan ID apa saja yang boleh muncul berdasarkan nama tipe SPP
    if (typeName.includes("gaji")) {
      allowedIds = [...biroIds];
    } else if (
      typeName.includes("tukin") ||
      typeName.includes("tunjangan kinerja")
    ) {
      allowedIds = [
        "menteri",
        "wakil_menteri",
        "staf_khusus",
        "staf_ahli",
        "sekjen",
        "ajudan",
        ...biroIds,
      ];
    } else if (typeName.includes("ppnpn")) {
      allowedIds = [...biroIds, "wakil_menteri", "staf_khusus"];
    } else if (typeName.includes("uang makan")) {
      allowedIds = [...biroIds];
    } else if (typeName.includes("uang lembur")) {
      allowedIds = [...biroIds];
    } else if (
      typeName.includes("ls bendahara") ||
      typeName.includes("ls_bendahara")
    ) {
      allowedIds = ["dom", "dowm"];
    }

    // 3. Kembalikan data utuh dari DB yang lolos filter
    return masterCategories.filter((cat) =>
      allowedIds.includes(cat.category_id),
    );
  };

  const kategoriOptions = getKategoriOptions(selectedTypeName, categories);

  const statusPegawai = [
    "gaji",
    "tukin",
    "tunjangan kinerja",
    "uang_makan",
    "uang_lembur",
    "uang makan",
    "uang lembur",
  ].some((keyword) => selectedTypeName.includes(keyword));

  return {
    // Data & Context
    userData,
    location,
    currentMenu,
    columns,
    dataTable,
    types,
    categories,
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
    jumlahDiprosesPIC,
    jumlahPerluDiperbaiki,
    jumlahPerluDiperbaikiPAPIC,
    canSubmitTest,
    canAddSubmission,
    userSummaryNote,
    fetchUserSummary,
    totalDiperbaikiRevGte1,
    summaryNote,
    fetchPicSummary,
    formData,
    jenisFile,
    pdfToOpen,

    // Modal Flags
    isOpenModal,
    isOpenPDF,
    variantModal,

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
    handleStatusChange,
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
    fetchCategories,
    kategoriOptions,
    statusPegawai,
  };
}