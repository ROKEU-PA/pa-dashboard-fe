import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";
import {
  ArrowLeft,
  FileText,
  Files,
  UploadCloud,
  CheckCircle2,
  ChevronDown,
  X,
  Sparkles,
  FolderOpen,
  CircleCheck,
  Clock3,
  RotateCcw,
  Trash2,
  Folder,
} from "lucide-react";

import { useSatkerLogic } from "./hooks/useSatkerLogic";
import { useBulkUpload } from "./hooks/useBulkUpload";

function TambahArsip() {
  const { listMenu, userData } = useContext(AppContext);
  const navigate = useNavigate();

  // =========================================================
  // LOGIC SINGLE DARI MENTOR
  // =========================================================

  const {
    formData,
    setFormData,
    types,
    fetchType,
    handleChange,
    handleSubmit,
    setVariantModal,
  } = useSatkerLogic();

  useEffect(() => {
    fetchType();
  }, [fetchType, setVariantModal]);

  const satkerOptions =
    userData?.role === "user"
      ? (() => {
          const code =
            userData?.biro_code || userData?.access_code;

          return code
            ? [
                {
                  label: userData?.name || "Biro Anda",
                  value: code,
                },
              ]
            : [];
        })()
      : (listMenu || []).map((menu) => ({
          label: menu?.name || menu?.title,
          value: menu?.code || menu?.id,
        }));

  console.log("TYPES:", types);

  // =========================================================
  // REF SINGLE
  // =========================================================

  const singleFileInputRef = React.useRef(null);

  // =========================================================
  // TAB
  // =========================================================

  const [activeTab, setActiveTab] = useState("single");

  // =========================================================
  // SINGLE
  // =========================================================

  const [singleFile, setSingleFile] = useState(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  // =========================================================
  // BULK LOGIC DARI useBulkUpload
  // =========================================================

  const {
    fileInputRef,
    folderInputRef,
    bulkFiles,
    isDragging,
    isAddMenuOpen,
    isUploading,
    setIsAddMenuOpen,
    handleBulkInputChange,
    handleFolderInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeBulkFile,
    clearBulkFiles,
    uploadBulkFiles,
    retryBulkFile,
    formatFileSize,
    getStatusStyle,
    totalFiles,
    successFiles,
    uploadingFiles,
    pendingFiles,
    failedFiles,
    progressPercentage,
  } = useBulkUpload();

  // =========================================================
  // SINGLE FILE
  // =========================================================

  const handleSingleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("File yang dipilih harus berupa PDF.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("Ukuran file maksimal 50 MB.");
      event.target.value = "";
      return;
    }

    setSingleFile(file);

    // Tetap masukkan file ke formData milik logic mentor
    handleChange({
      target: {
        name: "dokumen",
        value: file,
        files: [file],
      },
    });

    event.target.value = "";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 dark:bg-[#0f1724] dark:text-slate-100 p-5 md:p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="max-w-[1500px] mx-auto mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors mb-5"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#263449] shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 dark:group-hover:bg-[#1b2940] transition-all">
            <ArrowLeft size={16} />
          </span>
          Kembali ke Pilih Arsip
        </button>

        <div className="flex items-center gap-2">
          <span className="h-5 w-1.5 rounded-full bg-blue-600" />
          <span className="text-xs font-bold tracking-wider text-blue-600">
            E-Arsip
          </span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Tambah Dokumen
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-[1500px] mx-auto">
        <div className="bg-white dark:bg-[#111c2e] border border-gray-200 dark:border-[#263449] rounded-xl p-6">
          {/* =================================================
              TAB
          ================================================= */}

          <div className="px-5 md:px-7 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* SINGLE TAB */}

              <button
                type="button"
                onClick={() => setActiveTab("single")}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  activeTab === "single"
                    ? "border-blue-500 bg-blue-50/60 dark:bg-blue-500/10 shadow-sm"
                    : "border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111c2e] hover:border-blue-200 hover:bg-slate-50 dark:hover:bg-[#1b2940]"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                    activeTab === "single"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 dark:bg-[#0b1220] text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  <FileText size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        activeTab === "single"
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      Arsip Tunggal
                    </h3>

                    {activeTab === "single" && (
                      <CheckCircle2
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Tambahkan satu dokumen secara manual.
                  </p>
                </div>
              </button>

              {/* BULK TAB */}

              <button
                type="button"
                onClick={() => setActiveTab("bulk")}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  activeTab === "bulk"
                    ? "border-blue-500 bg-blue-50/60 dark:bg-blue-500/10 shadow-sm"
                    : "border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111c2e] hover:border-blue-200 hover:bg-slate-50 dark:hover:bg-[#1b2940]"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                    activeTab === "bulk"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 dark:bg-[#0b1220] text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  <Files size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        activeTab === "bulk"
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      Arsip Massal
                    </h3>

                    {activeTab === "bulk" && (
                      <CheckCircle2
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Upload banyak dokumen secara real-time.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* =================================================
              SINGLE
          ================================================= */}

          {activeTab === "single" && (
            <div className="p-5 md:p-7">
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#263449]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="text-gray-800 dark:text-white font-bold">
                      Informasi Dokumen
                    </h2>

                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Lengkapi informasi sebelum mengunggah dokumen.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span className="text-red-500">*</span>
                  Wajib diisi
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-7 mt-6"
              >
                {/* FORM */}

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* NO SPP */}

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        No. SPP
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="no_spp"
                        value={formData?.no_spp || ""}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan No. SPP"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#0b1220] text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    {/* BIRO */}

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Satuan Kerja
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          name="satker"
                          value={formData?.satker || ""}
                          onChange={handleChange}
                          required
                          className="appearance-none w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#0b1220] text-sm text-slate-600 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                          <option value="">Pilih Satuan Kerja</option>

                          {satkerOptions.map((item, index) => (
                            <option
                              key={item?.value || index}
                              value={item?.value || ""}
                            >
                              {item?.label || "-"}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* TAHUN */}

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Tahun
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="tahun"
                        value={formData?.tahun || ""}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan tahun"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#0b1220] text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    {/* JENIS */}

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Jenis SPP
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          name="type_id"
                          value={formData?.type_id || ""}
                          onChange={(e) => {
                            const selectedType = types?.find(
                              (item) => item?.type_id === e.target.value
                            );

                            setFormData((prev) => ({
                              ...prev,
                              type_id: e.target.value,
                              type: selectedType?.type || "",
                            }));
                          }}
                          required
                          className="appearance-none w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#0b1220] text-sm text-slate-600 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                          <option value="">Pilih Jenis SPP</option>

                          {(types || []).map((item, index) => (
                            <option
                              key={item?.type_id || index}
                              value={item?.type_id || ""}
                            >
                              {item?.type || "-"}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* INFO */}

                  <div className="flex items-center gap-2 mt-5 px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#0b1220] border border-slate-100 dark:border-[#263449]">
                    <Sparkles
                      size={15}
                      className="text-blue-500 dark:text-blue-400"
                    />

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pastikan informasi dokumen sudah sesuai sebelum
                      disimpan.
                    </p>
                  </div>
                </div>

                {/* FILE */}

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Dokumen SPP
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <label className="relative flex flex-col items-center justify-center min-h-[245px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0b1220] hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all cursor-pointer">
                    <input
                      ref={singleFileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleSingleFile}
                      className="hidden"
                    />

                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4">
                      {singleFile ? (
                        <FileText size={25} />
                      ) : (
                        <UploadCloud size={25} />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-100">
                      {singleFile ? "File siap diunggah" : "Upload dokumen"}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 text-center px-5">
                      {singleFile
                        ? singleFile.name
                        : "Klik untuk memilih file PDF"}
                    </p>

                    {!singleFile && (
                      <span className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm">
                        Pilih File
                      </span>
                    )}

                    <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
                      PDF • Maksimal 50 MB
                    </p>
                  </label>
                </div>

                {/* BUTTON */}

                <div className="xl:col-span-2 flex justify-end gap-3 mt-1 pt-5 border-t border-slate-100 dark:border-[#263449]">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#0b1220] text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1b2940] transition-all"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all"
                  >
                    Simpan Arsip
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================
              BULK
          ================================================= */}

          {activeTab === "bulk" && (
            <div className="p-5 md:p-7">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-[#263449]">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Files size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Upload Arsip Massal
                  </h2>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Tambahkan dokumen dan proses secara real-time.
                  </p>
                </div>
              </div>

              {/* =================================================
                  DROPZONE
              ================================================= */}

              <div className="mt-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center min-h-[250px] rounded-2xl border-2 border-dashed transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0b1220]"
                  }`}
                >
                  {/* INPUT FILE */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={handleBulkInputChange}
                    className="hidden"
                  />

                  {/* INPUT FOLDER */}

                  <input
                    ref={folderInputRef}
                    type="file"
                    webkitdirectory=""
                    directory=""
                    multiple
                    onChange={handleFolderInputChange}
                    className="hidden"
                  />

                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all ${
                      isDragging
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <UploadCloud size={28} />
                  </div>

                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-100">
                    {isDragging ? "Lepaskan file di sini" : "Tambah File"}
                  </h3>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center px-5">
                    Tambahkan PDF atau folder untuk diproses secara langsung
                  </p>

                  {/* ADD FILE */}

                  <div className="relative mt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 transition-all"
                    >
                      <UploadCloud size={15} />
                      Tambah File

                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          isAddMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isAddMenuOpen && (
                      <div className="absolute z-30 left-1/2 -translate-x-1/2 mt-2 w-56 bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#263449] rounded-xl shadow-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-[#1b2940] transition-colors"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <FileText size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-100">
                              File PDF
                            </p>

                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              Pilih satu atau banyak file
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => folderInputRef.current?.click()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-[#1b2940] transition-colors border-t border-slate-100 dark:border-[#263449]"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#0b1220] text-slate-600 dark:text-slate-300">
                            <Folder size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-100">
                              Folder
                            </p>

                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              Proses seluruh PDF di folder
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
                    PDF maksimal 50 MB per file
                  </p>
                </div>
              </div>

              {/* =================================================
                  INFO
              ================================================= */}

              <div className="flex items-start gap-3 mt-5 px-4 py-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <FolderOpen
                  size={17}
                  className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                />

                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Upload ke server
                  </p>

                  <p className="text-xs text-blue-600/80 dark:text-blue-300/80 mt-1 leading-relaxed">
                    Uploud File Pdf untuk di Proses
                  </p>
                </div>
              </div>

              {/* =================================================
                  STATISTICS
              ================================================= */}

              {totalFiles > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111c2e]">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Total
                    </p>

                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {totalFiles}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/10">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Berhasil
                    </p>

                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                      {successFiles}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/10">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Diproses
                    </p>

                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                      {uploadingFiles}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-red-100 dark:border-red-500/20 bg-red-50/40 dark:bg-red-500/10">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Gagal
                    </p>

                    <p className="text-xl font-bold text-red-700 dark:text-red-300 mt-1">
                      {failedFiles}
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  PROGRESS
              ================================================= */}

              {totalFiles > 0 && (
                <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-[#263449] bg-slate-50 dark:bg-[#0b1220]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Progress Upload
                    </span>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#263449] overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* =================================================
                  FILE LIST
              ================================================= */}

              {totalFiles > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Hasil Proses Dokumen
                      </h3>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        File baru dapat ditambahkan kapan saja.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearBulkFiles}
                      disabled={isUploading}
                      className="flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Bersihkan
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-[#263449] rounded-xl overflow-hidden">
                    {bulkFiles.map((file, index) => {
                      const statusStyle = getStatusStyle(file.status);

                      return (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between gap-4 p-4 bg-white dark:bg-[#111c2e] ${
                            index !== bulkFiles.length - 1
                              ? "border-b border-slate-100 dark:border-[#263449]"
                              : ""
                          }`}
                        >
                          {/* FILE INFO */}

                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#0b1220] text-blue-600 dark:text-blue-400 shrink-0">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 truncate">
                                {file.name}
                              </p>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {formatFileSize(file.size)}
                                </span>

                                {file.sourceType === "Folder" && (
                                  <>
                                    <span className="text-slate-300 dark:text-slate-600">
                                      •
                                    </span>

                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[300px]">
                                      {file.relativePath}
                                    </span>
                                  </>
                                )}
                              </div>

                              {file.error && (
                                <p className="text-[11px] text-red-500 mt-1">
                                  {file.error}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* STATUS */}

                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${statusStyle.wrapper}`}
                            >
                              {statusStyle.icon}
                              {file.status}
                            </span>

                            {/* RETRY */}

                            {(file.status === "Failed" ||
                              file.status === "Error") && (
                              <button
                                type="button"
                                onClick={() => retryBulkFile(file)}
                                disabled={isUploading}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#1b2940] transition-colors disabled:opacity-50"
                                title="Coba lagi"
                              >
                                <RotateCcw size={15} />
                              </button>
                            )}

                            {/* REMOVE */}

                            {!isUploading &&
                              file.status !== "Success" && (
                                <button
                                  type="button"
                                  onClick={() => removeBulkFile(file.id)}
                                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                  title="Hapus"
                                >
                                  <X size={16} />
                                </button>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =================================================
                  BULK BUTTON
              ================================================= */}

              {totalFiles > 0 && pendingFiles > 0 && (
                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-[#263449]">
                  <button
                    type="button"
                    onClick={clearBulkFiles}
                    disabled={isUploading}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#0b1220] text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1b2940] transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={uploadBulkFiles}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Clock3 size={16} className="animate-spin" />
                        Mengupload...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} />
                        Upload Semua
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* =================================================
                  ALL SUCCESS
              ================================================= */}

              {totalFiles > 0 &&
                pendingFiles === 0 &&
                uploadingFiles === 0 &&
                failedFiles === 0 && (
                  <div className="flex items-center justify-between gap-4 mt-6 px-4 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <CircleCheck
                        size={18}
                        className="text-emerald-600 dark:text-emerald-400"
                      />

                      <div>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Semua file berhasil diupload.
                        </p>

                        <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80 mt-0.5">
                          Dokumen sudah dikirim ke backend.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      Kembali
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TambahArsip;