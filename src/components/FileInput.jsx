import React, { useState, useId } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { UploadCloud, File, CheckCircle2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

function FileInput({
  label = "Upload File",
  name,
  onChange,
  accept = "*",
  required = false,
  helperText = "",
  value = null, // File existing dari database
}) {
  const [loading, setLoading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Bikin ID unik untuk mengamankan fungsi Klik pada Label
  const uniqueId = useId();

  const processFile = async (file, eventToPass) => {
    if (!file) return;

    setNewFileName(file.name);
    setLocalError("");

    try {
      setLoading(true);

      if (eventToPass) {
        onChange(eventToPass);
      }
      toast.info("Memproses file...", { autoClose: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("File siap dilampirkan!");
    } catch (err) {
      console.error("Error process file:", err);
      toast.error("Gagal memproses file.");
      setNewFileName(""); // Reset kalau gagal
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file, e);
    }
  };

  const preventDragDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    preventDragDefault(e);
    e.dataTransfer.dropEffect = "copy";
    if (!loading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    preventDragDefault(e);
    setIsDragging(false);
  };

  const handleDragEnter = (e) => {
    preventDragDefault(e);
    if (!loading) setIsDragging(true);
  };

  const handleDrop = (e) => {
    preventDragDefault(e);
    setIsDragging(false);

    if (loading) return;

    const files = Array.from(e.dataTransfer.files); // Convert ke array biasa

    if (files.length === 0) {
      console.log("Tidak ada file — cek apakah dragover juga di-handle");
      return;
    }

    const file = files[0];
    const syntheticEvent = {
      target: {
        name: name,
        files: e.dataTransfer.files, // pakai yang asli
        type: "file",
        value: "",
      },
    };

    processFile(file, syntheticEvent);
  };

  // Validasi visual merah jika wajib tapi masih kosong
  const isError =
    localError !== "" ||
    (required && !value && !newFileName && localError === "trigger");

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label Title */}
      <label className="text-md text-[#ccc]-700 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Tampilan Dokumen Existing */}
      {value && !newFileName && (
        <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <File size={16} className="text-blue-500 shrink-0" />
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline truncate font-medium"
              title={value.filename}
            >
              {value.filename || "Lihat Dokumen"}
            </a>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold shrink-0">
            Existing File
          </span>
        </div>
      )}

      {/* Kotak Drag & Drop menggunakan tag LABEL agar Klik otomatis jalan */}
      <label
        htmlFor={uniqueId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        className={`
          flex flex-col items-center justify-center w-full min-h-[120px] p-6 
          border-2 border-dashed rounded-xl transition-all duration-200 group
          ${loading ? "opacity-50 cursor-wait bg-slate-50" : "bg-slate-50 hover:bg-blue-50/50 cursor-pointer"}
          ${isError ? "border-red-400" : isDragging ? "border-blue-500 bg-blue-100/50 scale-[1.02]" : newFileName ? "border-emerald-400 bg-emerald-50/30" : "border-slate-300 hover:border-blue-400"}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-2 pb-3 pointer-events-none">
          {newFileName ? (
            <>
              <CheckCircle2 size={36} className="text-emerald-500 mb-3" />
              <p className="mb-1 text-sm font-semibold text-emerald-700 text-center truncate max-w-[250px]">
                {newFileName}
              </p>
              <p className="text-xs text-slate-500">
                Klik atau seret file lain untuk mengganti
              </p>
            </>
          ) : (
            <>
              <UploadCloud
                size={36}
                className={`mb-3 transition-colors ${isDragging ? "text-blue-600" : "text-blue-500"}`}
              />
              <p className="mb-1 text-sm font-semibold text-slate-700 text-center">
                <span className="text-blue-600">Klik untuk upload</span> atau
                seret file ke sini
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                {accept}
              </p>
            </>
          )}
        </div>

        {/* Input File Asli yang disembunyikan tapi diikat oleh htmlFor label */}
        <input
          id={uniqueId}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept={accept}
          disabled={loading}
          className="hidden"
        />
      </label>

      {/* Pesan Helper / Error */}
      {(isError || helperText) && (
        <span
          className={`text-xs ml-1 font-medium ${isError ? "text-red-500" : "text-slate-500"}`}
        >
          {localError ||
            helperText ||
            (required && !newFileName && !value ? "Dokumen wajib diisi" : "")}
        </span>
      )}
    </div>
  );
}

FileInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  required: PropTypes.bool,
};

export default FileInput;
