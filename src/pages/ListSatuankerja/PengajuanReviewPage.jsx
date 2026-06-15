import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, Folder } from "lucide-react";
import { toast } from "react-toastify";
import { useSatkerLogic } from "./hooks/useSatkerLogic";
import Select from "@/components/Select";
import ChecklistComponent from "./components/ChecklistComponent";
import Textarea from "@/components/TextArea";
import CustomPDFViewer from "@/components/PDFViewer";
import Button from "@/components/Button";
import {
  statusColorClass,
  statusColorText,
  statusDots,
  statusLabel,
} from "./constants/styleConstants";
import { getCurrentSatuanKerja } from "./satkerHooks";

function PengajuanReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. TANGKAP DATA DARI TABEL
  const row = location.state?.row;
  const isReadOnly = location.pathname.includes("/detail");

  // 2. PANGGIL FUNGSI & DATA DARI HOOK
  const {
    fetchType,
    types,
    questions,
    verifications,
    editData,
    checklistIsValid,
  } = useSatkerLogic();

  // State pengontrol buka-tutup UI
  const [kelengkapanOpen, setKelengkapanOpen] = useState(true);
  const [verifikasiOpen, setVerifikasiOpen] = useState(true);

  // State File Viewer
  const [pdfToOpen, setPdfToOpen] = useState("");
  const [fileExtension, setFileExtension] = useState("");

  // State Form Utama
  const [formData, setFormData] = useState({
    id: null,
    no_spp: id,
    tahun: "",
    type_id: "",
    type: "",
    status: "",
    catatan: "",
    kelengkapan: [],
    verifikasi: [],
    kelengkapan_ids: [],
    verifikasi_ids: [],
    link: "",
    jml_hal: 0,
  });

  // ===============================================
  // EFEK 1: MENGISI DATA AWAL SAAT HALAMAN DIBUKA
  // ===============================================
  useEffect(() => {
    if (row) {
      fetchType();
      fetchType(row.type_id);
      // Set data form dasar dari tabel
      setFormData((prev) => ({
        ...prev,
        ...row,
        no_spp: row.no_spp,
        tahun: row.tahun,
        type_id: row.type_id,
        type: row.jenis_spp,
        status: row.status === "arsip" || !row.status ? "Diproses" : row.status,
        catatan: row.feedback || "",
        link: row.document?.path || row.link || "",
        jml_hal: row.jml_hal || 0,
        kelengkapan_ids: row.question_checklist || [],
        verifikasi_ids: row.verification_checklist || [],
      }));

      // Setup File Viewer URL & Ekstensi
      const fileUrl = row.document?.url || row.document?.path || row.link;
      const filePath = row.document?.path;
      if (fileUrl) {
        setPdfToOpen(fileUrl);
        if (
          filePath.includes("drive.google.com") ||
          filePath.includes("docs.google.com")
        ) {
          setFileExtension("gdrive");
        } else {
          const ext = filePath.split(".").pop().toLowerCase();
          setFileExtension(
            ["pdf", "rar", "zip"].includes(ext) ? ext : "unknown",
          );
        }
      }
    } else {
      // Kalau user nge-refresh paksa dan state hilang, kembalikan ke tabel
      toast.error("Data tidak ditemukan, silakan pilih dokumen dari tabel.");
      navigate("/satuan-kerja");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  // ===============================================
  // EFEK 2: MERAKIT CHECKLIST SETELAH DATA API TURUN
  // ===============================================
  useEffect(() => {
    if (questions?.length > 0 && formData.kelengkapan_ids) {
      const kelengkapanWithLabel = questions
        .filter((q) => formData.kelengkapan_ids.includes(q.id_question))
        .map((q) => ({ label: q.text, value: q.id_question }));

      const verifikasiWithLabel = verifications
        .filter((v) => formData.verifikasi_ids.includes(v.id_question))
        .map((v) => ({ label: v.text, value: v.id_question }));

      setFormData((prev) => ({
        ...prev,
        kelengkapan: kelengkapanWithLabel,
        verifikasi: verifikasiWithLabel,
      }));
    }
  }, [
    questions,
    verifications,
    formData.kelengkapan_ids,
    formData.verifikasi_ids,
  ]);

  // ===============================================
  // HANDLER SUBMIT
  // ===============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!formData.status) {
      toast.error("Status harus dipilih!");
      return;
    }

    if (!checklistIsValid(formData)) {
      toast.error(
        "Semua Kelengkapan & Verifikasi harus dicentang untuk status ini.",
      );
      return;
    }

    try {
      await editData(formData);
      navigate(-1);
    } catch (error) {
      console.error("Gagal simpan:", error);
    }
  };

  const getStatusOptions = () => {
    const initialStatus = row?.status || "baru";

    if (
      initialStatus === "baru" ||
      initialStatus === "Diproses" ||
      !row?.status
    ) {
      return [
        { label: "Baru ditambahkan", value: "baru" },
        { label: "Diproses (Butuh perbaikan)", value: "fix" },
        { label: "Diproses (Lengkap)", value: "approved" },
        { label: "Ditolak", value: "reject" },
      ];
    }

    if (initialStatus === "approved") {
      return [
        { label: "Diproses (Lengkap)", value: "approved" },
        { label: "SP2D", value: "sp2d" },
      ];
    }

    return [
      { label: "Diproses (Butuh perbaikan)", value: "fix" },
      { label: "Diproses (Lengkap)", value: "approved" },
      { label: "Ditolak", value: "reject" },
      { label: "SP2D", value: "sp2d" },
    ];
  };

  const statusOptions = getStatusOptions();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 p-4 md:p-6 flex flex-col gap-4">
      {/* 1. HEADER HALAMAN */}
      <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {isReadOnly ? "Detail SPP" : "Pengujian SPP"}
              <span className="text-blue-600">#{id}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isReadOnly
                ? "Hanya melihat detail dokumen dan hasil pengujian."
                : "Lakukan verifikasi dan pengecekan kelengkapan dokumen."}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 ${statusColorClass(formData.status)} ${statusColorText(formData.status)} rounded-full`}
        >
          <span
            className={`w-2 h-2 rounded-full ${statusDots(formData.status)} animate-pulse`}
          ></span>
          {statusLabel(formData.status)}
        </div>
      </div>

      {/* 2. MAIN LAYOUT (LAYAR DIBELAH DUA) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)]">
        {/* KIRI: VIEWER DOKUMEN (Porsi 7 kolom) */}
        <div className="lg:col-span-7 bg-slate-100 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative">
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 text-slate-200 border-b border-slate-700 z-10">
            <FileText size={18} />
            <span className="text-sm font-medium tracking-wide truncate">
              {fileExtension === "gdrive"
                ? "Link Google Drive"
                : `Dokumen_SPP_${id}.${fileExtension || "pdf"}`}
            </span>
          </div>

          <div className="flex-1 w-full h-full relative flex items-center justify-center bg-slate-200/50 overflow-hidden">
            {fileExtension === "pdf" ? (
              <div className="w-full h-full overflow-y-auto bg-slate-600">
                <CustomPDFViewer pdfSource={pdfToOpen} />
              </div>
            ) : fileExtension === "gdrive" ? (
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md border border-slate-200 max-w-sm w-full mx-4 text-center">
                <div className="w-16 h-16 bg-blue-50 text-[#308BFD] rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <p className="mb-6 text-slate-600 font-medium">
                  Dokumen ini berupa link Google Drive
                </p>
                <a
                  href={pdfToOpen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <button className="w-full bg-[#308BFD] hover:bg-blue-700 text-white py-2.5 rounded-lg">
                    Buka Link di Tab Baru
                  </button>
                </a>
              </div>
            ) : (
              <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-xl shadow-blue-200/50 flex flex-col items-center text-center max-w-sm w-full mx-4">
                <div className="relative text-[#308BFD] mb-2">
                  <Folder size={84} strokeWidth={1.5} />
                  <span className="absolute bottom-1 right-0 bg-[#308BFD] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                    ZIP/RAR
                  </span>
                </div>
                <p className="mt-4 text-slate-600 font-medium">
                  File SPP ber-format Arsip
                </p>
                <p className="text-xs text-slate-400 mt-1 mb-6">
                  Silakan download untuk melihat isi file.
                </p>
                <button
                  className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-[#59C6FF] to-[#308BFD] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = pdfToOpen;
                    link.download = "";
                    link.click();
                  }}
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* KANAN: FORM CHECKLIST (Porsi 5 kolom) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {/* Info Dasar */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Jenis SPP"
                  name="type_id"
                  value={formData.type_id}
                  options={types.map((t) => ({
                    label: t.type,
                    value: t.type_id,
                  }))}
                  disabled={true}
                  onChange={() => {}}
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  options={statusOptions}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                />
              </div>

              {/* Komponen Checklist Kelengkapan - Data API Mapped! */}
              <ChecklistComponent
                title="Kelengkapan Dokumen"
                checkedLabel="Lengkap"
                items={questions?.map((q) => ({
                  id: q.id_question,
                  label: q.text,
                }))}
                selectedIds={formData.kelengkapan}
                onChange={(updated) =>
                  setFormData({ ...formData, kelengkapan: updated })
                }
                disabled={isReadOnly}
                isOpen={kelengkapanOpen}
                setIsOpen={setKelengkapanOpen}
              />

              {/* Komponen Checklist Verifikasi - Data API Mapped! */}
              <ChecklistComponent
                title="Verifikasi"
                checkedLabel="Sesuai"
                items={verifications?.map((v) => ({
                  id: v.id_question,
                  label: v.text,
                }))}
                selectedIds={formData.verifikasi}
                onChange={(updated) =>
                  setFormData({ ...formData, verifikasi: updated })
                }
                disabled={isReadOnly}
                isOpen={verifikasiOpen}
                setIsOpen={setVerifikasiOpen}
              />

              {/* Catatan / Feedback */}
              <Textarea
                label="Catatan / Feedback"
                name="catatan"
                value={formData.catatan}
                onChange={(e) =>
                  setFormData({ ...formData, catatan: e.target.value })
                }
                disabled={isReadOnly}
                placeholder={
                  isReadOnly
                    ? "Tidak ada catatan."
                    : "Tambahkan catatan jika ada dokumen yang kurang atau salah..."
                }
                style={{ minHeight: "100px" }}
              />
            </div>

            {/* Footer Action */}
            {!isReadOnly && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#59C6FF] hover:bg-[#308BFD] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-w-[220px]"
                >
                  {/* Tambah shrink-0 di sini */}
                  <CheckCircle size={18} className="shrink-0" />
                  
                  {/* Tambah whitespace-nowrap di sini */}
                  <span className="whitespace-nowrap">Simpan Hasil Pengujian</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default PengajuanReviewPage;
