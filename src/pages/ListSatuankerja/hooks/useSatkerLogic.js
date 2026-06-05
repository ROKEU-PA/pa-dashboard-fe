import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
// Import konstanta dan helper yang sudah Anda miliki
import { columns, getCurrentSatuanKerja, isPengajuanPath } from "@/pages/ListSatuankerja/satkerHooks";

export function useSatkerLogic() {
  const { listMenu, userData } = useContext(AppContext);
  const location = useLocation();

  const auth = sessionStorage.getItem("auth");
  const accessToken = auth ? JSON.parse(auth)?.accessToken : null;

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [currentMenu, setCurrentMenu] = useState(
    getCurrentSatuanKerja(listMenu, location.pathname)
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
      if (key === "startDate" && newFilter.endDate && value > newFilter.endDate) {
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

  // ==========================================
  // 3. API CALLS
  // ==========================================
  const fetchTable = async () => {
    try {
      const now = isPengajuanPath(location.pathname) ? new Date().getFullYear() : filter.tahun;
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
        start_date: filter.startDate ? moment(filter.startDate).format("YYYY-MM-DD") : "",
        end_date: filter.endDate ? moment(filter.endDate).format("YYYY-MM-DD") : "",
      });

      const data = await apiRequest({ url: `/archive/list?${query}`, token: accessToken });
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
          setQuestions(data.data.questions);
          setVerifications(verif.data.questions);
        }
      } else {
        const data = await apiRequest({ url: `/pa/spp/type?id=` });
        if (data.success) {
          const filteredResult = data.data.filter((item) => item.type_id !== "verifikasi");
          setTypes(filteredResult);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fungsi submitData dan editData (bisa dipindahkan ke sini persis seperti aslinya)
  // ... [Masukkan submitData dan editData Anda di sini agar tidak memanjangkan contoh] ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... [Masukkan logika handleSubmit Anda yang panjang di sini] ...
    // Pastikan di akhir fungsi yang sukses memanggil: fetchTable()
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
    filter.tahun, filter.searchKey, page + 1, rowsPerPage, sortBy, sortDir,
    filter.startDate, filter.endDate, listMenu, location.pathname
  ]);

  // ==========================================
  // 6. KEMBALIKAN SEMUA YANG DIBUTUHKAN UI
  // ==========================================
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

    // Setters (jika dibutuhkan langsung oleh komponen Modal/UI)
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