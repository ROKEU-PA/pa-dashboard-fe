import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, Folder, Link2 } from "lucide-react";
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
          filePath?.includes("drive.google.com") ||
          filePath?.includes("docs.google.com")
        ) {
          setFileExtension("gdrive");
        } else {
          const ext = filePath?.split(".").pop().toLowerCase();
          setFileExtension(
            ["pdf", "rar", "zip"].includes(ext) ? ext : "unknown",
          );
        }
      }
    } else {
      toast.error("Data tidak ditemukan, silakan pilih dokumen dari tabel.");
      navigate("/satuan-kerja");
    }
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
    // WADAH UTAMA: Support Dark Mode dengan warna background seragam
    <div className="min-h-[calc(100vh-80px)] bg-[#f4f7fa] dark:bg-transparent p-4 md:p-6 flex flex-col gap-5 transition-colors duration-300">
      
      {/* 1. HEADER HALAMAN */}
      <div className="bg-white dark:bg-[#111C30]/80 backdrop-blur-md px-6 py-4 rounded-[20px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-between z-0 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              {isReadOnly ? "Detail SPP" : "Pengujian SPP"}
              <span className="text-blue-500 font-bold opacity-80">#{id}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {isReadOnly
                ? "Hanya melihat detail dokumen dan hasil pengujian."
                : "Lakukan verifikasi dan pengecekan kelengkapan dokumen."}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 ${statusColorClass(formData.status)} ${statusColorText(formData.status)} dark:bg-opacity-20 dark:border-opacity-30 border rounded-full font-bold shadow-sm text-xs`}
        >
          <span className={`w-2 h-2 rounded-full ${statusDots(formData.status)} animate-pulse`}></span>
          {statusLabel(formData.status)}
        </div>
      </div>

      {/* 2. MAIN LAYOUT (LAYAR DIBELAH DUA) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-170px)]">
        
        {/* KIRI: VIEWER DOKUMEN (Porsi 7 kolom) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-full relative transition-colors">
          
          <div className="bg-slate-50 dark:bg-[#0D1627] px-5 py-3.5 flex items-center gap-3 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-white/10 z-10 transition-colors">
            <FileText size={18} className="text-blue-500 shrink-0" strokeWidth={2.5} />
            <span className="text-xs font-bold tracking-wider uppercase truncate">
              {fileExtension === "gdrive"
                ? "Link Google Drive"
                : `Dokumen_SPP_${id}.${fileExtension || "pdf"}`}
            </span>
          </div>

          <div className="flex-1 w-full h-full relative flex items-center justify-center bg-slate-100/50 dark:bg-[#0A111E] overflow-hidden transition-colors">
            {fileExtension === "pdf" ? (
              <div className="w-full h-full overflow-y-auto">
                <CustomPDFViewer pdfSource={pdfToOpen} />
              </div>
            ) : fileExtension === "gdrive" ? (
              <div className="flex flex-col items-center bg-white dark:bg-[#111C30] p-8 rounded-[20px] shadow-lg shadow-blue-500/5 dark:shadow-none border border-slate-100 dark:border-white/10 max-w-sm w-full mx-4 text-center transition-colors">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                  <Link2 size={32} strokeWidth={2} />
                </div>
                <p className="mb-6 text-slate-700 dark:text-slate-200 font-bold">
                  Dokumen ini berupa link Google Drive
                </p>
                <a
                  href={pdfToOpen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/30 active:scale-95 text-white py-3 rounded-xl font-bold transition-all">
                    Buka Link di Tab Baru
                  </button>
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center bg-white dark:bg-[#111C30] p-8 rounded-[20px] shadow-lg shadow-blue-500/5 dark:shadow-none border border-slate-100 dark:border-white/10 max-w-sm w-full mx-4 text-center transition-colors">
                <div className="relative text-blue-500 mb-2">
                  <Folder size={84} strokeWidth={1.5} />
                  <span className="absolute bottom-1 right-0 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wider uppercase">
                    ZIP/RAR
                  </span>
                </div>
                <p className="mt-4 text-slate-700 dark:text-slate-200 font-bold">
                  File SPP ber-format Arsip
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 font-medium">
                  Silakan download untuk melihat isi file.
                </p>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/30 active:scale-95 text-white font-bold rounded-xl transition-all"
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
        <div className="lg:col-span-6 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col h-full overflow-hidden transition-colors">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 custom-scrollbar">
              
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
              <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0D1627] flex justify-end transition-colors">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 min-w-[220px]"
                >
                  <CheckCircle size={18} strokeWidth={2.5} className="shrink-0" />
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