import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  AlertCircle,
} from "lucide-react";

import { useSatkerLogic } from "./hooks/useSatkerLogic";
import { useBulkUpload } from "./hooks/useBulkUpload";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function TambahArsip() {
  const { listMenu, userData } = useContext(AppContext);
  const navigate = useNavigate();

  // =========================================================
  // LOGIC ARSIP TUNGGAL
  // =========================================================

  const {
    formData,
    setFormData,
    types,
    fetchType,
    handleChange,
    handleSubmit,
  } = useSatkerLogic();

  useEffect(() => {
    if (typeof fetchType === "function") {
      fetchType();
    }
  }, [fetchType]);

  // =========================================================
  // SATUAN KERJA
  // =========================================================

  const satkerOptions =
    userData?._role_ === "user"
      ? (() => {
          const code =
            userData?._biro_code_ ||
            userData?._access_code_;

          return code
            ? [
                {
                  label: userData?._name_ || "Biro Anda",
                  value: code,
                },
              ]
            : [];
        })()
      : (listMenu || []).map((menu) => ({
          label: menu?._name_ || menu?._title_ || "-",
          value: menu?._code_ || menu?._id_ || "",
        }));

  // =========================================================
  // TAB DAN FILE ARSIP TUNGGAL
  // =========================================================

  const [activeTab, setActiveTab] = useState("single");
  const [singleFile, setSingleFile] = useState(null);
  const singleFileInputRef = useRef(null);

  // =========================================================
  // LOGIC UPLOAD MASSAL
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

  // Pengaman tambahan pada komponen.
  // Pengaman utama request tetap harus ada di useBulkUpload.
  const uploadClickLockRef = useRef(false);

  // =========================================================
  // VALIDASI FILE ARSIP TUNGGAL
  // =========================================================

  const handleSingleFile = (event) => {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("File yang dipilih harus berupa PDF.");
      input.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("Ukuran file maksimal 50 MB.");
      input.value = "";
      return;
    }

    setSingleFile(file);

    // Pertahankan mekanisme form dari useSatkerLogic.
    handleChange({
      target: {
        name: "dokumen",
        value: file,
        files: [file],
      },
    });

    // Supaya file yang sama dapat dipilih kembali.
    input.value = "";
  };

  // =========================================================
  // RESET FORM ARSIP TUNGGAL
  // =========================================================

  const handleResetSingle = () => {
    setFormData((previous) => ({
      ...previous,
      no_spp: "",
      satker: "",
      tahun: "",
      type_id: "",
      type: "",
      dokumen: null,
    }));

    setSingleFile(null);

    if (singleFileInputRef.current) {
      singleFileInputRef.current.value = "";
    }
  };

  // =========================================================
  // UPLOAD MASSAL
  // =========================================================

  const handleUploadBulk = async () => {
    // Mencegah pemanggilan ganda dari komponen ini.
    if (uploadClickLockRef.current || isUploading) {
      return;
    }

    if (!pendingFiles) {
      return;
    }

    uploadClickLockRef.current = true;

    try {
      await uploadBulkFiles();
    } catch (error) {
      console.error("Gagal menjalankan upload massal:", error);
    } finally {
      uploadClickLockRef.current = false;
    }
  };

  // =========================================================
  // STATUS FILE
  // =========================================================

  const renderStatusIcon = (statusStyle) => {
    if (!statusStyle) {
      return <AlertCircle size={14} />;
    }

    if (statusStyle.icon) {
      return statusStyle.icon;
    }

    return <Clock3 size={14} />;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-5 text-slate-800 dark:bg-[#0f1724] dark:text-slate-100 md:p-6">
      {/* HEADER */}

      <div className="mx-auto mb-6 max-w-[1500px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all group-hover:border-blue-200 group-hover:bg-blue-50 dark:border-[#263449] dark:bg-[#111c2e] dark:group-hover:bg-[#1b2940]">
            <ArrowLeft size={16} />
          </span>

          Kembali ke Pilih Arsip
        </button>

        <div className="flex items-center gap-2">
          <span className="h-5 w-1.5 rounded-full bg-blue-600" />

          <span className="text-xs font-bold tracking-wider text-blue-600">
            E-Arsip
          </span>

          <span className="text-slate-300 dark:text-slate-600">
            /
          </span>

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Tambah Dokumen
          </span>
        </div>
      </div>

      {/* MAIN */}

      <div className="mx-auto max-w-[1500px]">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#263449] dark:bg-[#111c2e]">
          {/* TAB */}

          <div className="px-0 pt-2 md:px-1">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* TAB ARSIP TUNGGAL */}

              <button
                type="button"
                onClick={() => setActiveTab("single")}
                className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  activeTab === "single"
                    ? "border-blue-500 bg-blue-50/60 shadow-sm dark:bg-blue-500/10"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 dark:border-[#263449] dark:bg-[#111c2e] dark:hover:bg-[#1b2940]"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                    activeTab === "single"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-[#0b1220] dark:text-slate-400"
                  }`}
                >
                  <FileText size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">
                      Arsip Tunggal
                    </h3>

                    {activeTab === "single" && (
                      <CheckCircle2
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Tambahkan satu dokumen secara manual.
                  </p>
                </div>
              </button>

              {/* TAB ARSIP MASSAL */}

              <button
                type="button"
                onClick={() => setActiveTab("bulk")}
                className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  activeTab === "bulk"
                    ? "border-blue-500 bg-blue-50/60 shadow-sm dark:bg-blue-500/10"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 dark:border-[#263449] dark:bg-[#111c2e] dark:hover:bg-[#1b2940]"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                    activeTab === "bulk"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-[#0b1220] dark:text-slate-400"
                  }`}
                >
                  <Files size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">
                      Arsip Massal
                    </h3>

                    {activeTab === "bulk" && (
                      <CheckCircle2
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Upload banyak dokumen secara bersamaan.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* =================================================
              ARSIP TUNGGAL
          ================================================= */}

          {activeTab === "single" && (
            <div className="p-0 pt-7 md:p-2 md:pt-7">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-[#263449]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-800 dark:text-white">
                      Informasi Dokumen
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Lengkapi informasi sebelum mengunggah dokumen.
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 sm:flex">
                  <span className="text-red-500">*</span>
                  Wajib diisi
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 grid grid-cols-1 gap-7 xl:grid-cols-[1fr_420px]"
              >
                {/* FORM INFORMASI */}

                <div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* NOMOR SPP */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        No. SPP <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="no_spp"
                        value={formData?.no_spp || ""}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan No. SPP"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-[#263449] dark:bg-[#0b1220] dark:text-slate-100"
                      />
                    </div>

                    {/* SATUAN KERJA */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Satuan Kerja{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          name="satker"
                          value={formData?.satker || ""}
                          onChange={handleChange}
                          required
                          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-[#263449] dark:bg-[#0b1220] dark:text-slate-100"
                        >
                          <option value="">
                            Pilih Satuan Kerja
                          </option>

                          {satkerOptions.map((item, index) => (
                            <option
                              key={item.value || index}
                              value={item.value || ""}
                            >
                              {item.label || "-"}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>

                    {/* TAHUN */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Tahun <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="tahun"
                        value={formData?.tahun || ""}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan tahun"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-[#263449] dark:bg-[#0b1220] dark:text-slate-100"
                      />
                    </div>

                    {/* JENIS SPP */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Jenis SPP{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <select
                          name="type_id"
                          value={formData?.type_id || ""}
                          onChange={(event) => {
                            const selectedType = (types || []).find(
                              (item) =>
                                String(item?.type_id) ===
                                String(event.target.value)
                            );

                            setFormData((previous) => ({
                              ...previous,
                              type_id: event.target.value,
                              type: selectedType?.type || "",
                            }));
                          }}
                          required
                          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-[#263449] dark:bg-[#0b1220] dark:text-slate-100"
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
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* INFORMASI */}

                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 dark:border-[#263449] dark:bg-[#0b1220]">
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

                {/* FILE DOKUMEN */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Dokumen SPP{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <label className="relative flex min-h-[245px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 transition-all hover:border-blue-300 hover:bg-blue-50/30 dark:border-[#334155] dark:bg-[#0b1220] dark:hover:bg-blue-500/5">
                    <input
                      ref={singleFileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleSingleFile}
                      className="hidden"
                    />

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {singleFile ? (
                        <FileText size={25} />
                      ) : (
                        <UploadCloud size={25} />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-100">
                      {singleFile
                        ? "File siap diunggah"
                        : "Upload dokumen"}
                    </h3>

                    <p className="mt-1.5 max-w-full px-5 text-center text-xs text-slate-400 dark:text-slate-500">
                      {singleFile
                        ? singleFile.name
                        : "Klik untuk memilih file PDF"}
                    </p>

                    {!singleFile && (
                      <span className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                        Pilih File
                      </span>
                    )}

                    <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
                      PDF • Maksimal 50 MB
                    </p>
                  </label>

                  {singleFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSingleFile(null);

                        setFormData((previous) => ({
                          ...previous,
                          dokumen: null,
                        }));

                        if (singleFileInputRef.current) {
                          singleFileInputRef.current.value = "";
                        }
                      }}
                      className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      Hapus file terpilih
                    </button>
                  )}
                </div>

                {/* TOMBOL FORM */}

                <div className="mt-1 flex justify-end gap-3 border-t border-slate-100 pt-5 xl:col-span-2 dark:border-[#263449]">
                  <button
                    type="button"
                    onClick={handleResetSingle}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-[#263449] dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-[#1b2940]"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                  >
                    Simpan Arsip
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================
              ARSIP MASSAL
          ================================================= */}

          {activeTab === "bulk" && (
            <div className="p-0 pt-7 md:p-2 md:pt-7">
              {/* HEADER BULK */}

              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#263449]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Files size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Upload Arsip Massal
                  </h2>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Tambahkan dokumen dan proses secara bersamaan.
                  </p>
                </div>
              </div>

              {/* DROPZONE */}

              <div className="mt-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-slate-200 bg-slate-50/60 dark:border-[#334155] dark:bg-[#0b1220]"
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
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
                      isDragging
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    }`}
                  >
                    <UploadCloud size={28} />
                  </div>

                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-100">
                    {isDragging
                      ? "Lepaskan file di sini"
                      : "Tambah File"}
                  </h3>

                  <p className="mt-2 px-5 text-center text-xs text-slate-400 dark:text-slate-500">
                    Tambahkan PDF atau folder untuk diproses.
                  </p>

                  {/* MENU TAMBAH FILE */}

                  <div className="relative mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddMenuOpen((previous) => !previous)
                      }
                      disabled={isUploading}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <div className="absolute left-1/2 z-30 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#263449] dark:bg-[#111c2e]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddMenuOpen(false);
                            fileInputRef.current?.click();
                          }}
                          disabled={isUploading}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50 disabled:opacity-50 dark:hover:bg-[#1b2940]"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
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
                          onClick={() => {
                            setIsAddMenuOpen(false);
                            folderInputRef.current?.click();
                          }}
                          disabled={isUploading}
                          className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left transition-colors hover:bg-blue-50 disabled:opacity-50 dark:border-[#263449] dark:hover:bg-[#1b2940]"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-[#0b1220] dark:text-slate-300">
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

              {/* INFO UPLOAD */}

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5 dark:border-blue-500/20 dark:bg-blue-500/10">
                <FolderOpen
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                />

                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Upload ke server
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-blue-600/80 dark:text-blue-300/80">
                    File PDF akan dikirim ke backend untuk diproses.
                  </p>
                </div>
              </div>

              {/* STATISTIK */}

              {totalFiles > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#263449] dark:bg-[#111c2e]">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
                      {totalFiles}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Berhasil
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {successFiles}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Diproses
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">
                      {uploadingFiles}
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50/40 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Gagal
                    </p>

                    <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300">
                      {failedFiles}
                    </p>
                  </div>
                </div>
              )}

              {/* PROGRESS */}

              {totalFiles > 0 && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#263449] dark:bg-[#0b1220]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Progress Upload
                    </span>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#263449]">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* DAFTAR FILE */}

              {totalFiles > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Hasil Proses Dokumen
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Periksa status setiap dokumen.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearBulkFiles}
                      disabled={isUploading}
                      className="flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Bersihkan
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#263449]">
                    {bulkFiles.map((file, index) => {
                      const statusStyle = getStatusStyle(file.status);

                      return (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between gap-4 bg-white p-4 dark:bg-[#111c2e] ${
                            index !== bulkFiles.length - 1
                              ? "border-b border-slate-100 dark:border-[#263449]"
                              : ""
                          }`}
                        >
                          {/* INFORMASI FILE */}

                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-blue-600 dark:bg-[#0b1220] dark:text-blue-400">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-100">
                                {file.name}
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {formatFileSize(file.size)}
                                </span>

                                {file.sourceType === "Folder" && (
                                  <>
                                    <span className="text-slate-300 dark:text-slate-600">
                                      •
                                    </span>

                                    <span className="max-w-[300px] truncate text-[11px] text-slate-400 dark:text-slate-500">
                                      {file.relativePath}
                                    </span>
                                  </>
                                )}
                              </div>

                              {file.error && (
                                <p className="mt-1 text-[11px] text-red-500">
                                  {file.error}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* STATUS DAN AKSI */}

                          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <span
                              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${
                                statusStyle?.wrapper || ""
                              }`}
                            >
                              {renderStatusIcon(statusStyle)}
                              {file.status}
                            </span>

                            {(file.status === "Failed" ||
                              file.status === "Error") && (
                              <button
                                type="button"
                                onClick={() => retryBulkFile(file)}
                                disabled={isUploading}
                                title="Coba lagi"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-[#1b2940] dark:hover:text-blue-400"
                              >
                                <RotateCcw size={15} />
                              </button>
                            )}

                            {!isUploading &&
                              file.status !== "Success" && (
                                <button
                                  type="button"
                                  onClick={() => removeBulkFile(file.id)}
                                  title="Hapus"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-500/10"
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

              {/* TOMBOL UPLOAD */}

              {totalFiles > 0 && pendingFiles > 0 && (
                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-[#263449]">
                  <button
                    type="button"
                    onClick={clearBulkFiles}
                    disabled={isUploading}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#263449] dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-[#1b2940]"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={handleUploadBulk}
                    disabled={isUploading || pendingFiles === 0}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Clock3
                          size={16}
                          className="animate-spin"
                        />
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

              {/* SEMUA FILE BERHASIL */}

              {totalFiles > 0 &&
                pendingFiles === 0 &&
                uploadingFiles === 0 &&
                failedFiles === 0 && (
                  <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <CircleCheck
                        size={18}
                        className="text-emerald-600 dark:text-emerald-400"
                      />

                      <div>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Semua file berhasil diupload.
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-300/80">
                          Dokumen sudah dikirim ke backend.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
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