import { FileText, X } from "lucide-react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

function Modal({
  open,
  onClose,
  title,
  children,
  width = "auto",
  minWidth = "40vw",
  maxWidth = "90%",
}) {
  // Jurus UX: Kunci scroll halaman belakang pas modal lagi kebuka
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const stopPropagation = (e) => e.stopPropagation();

  return ReactDOM.createPortal(
    // BACKDROP (Latar Belakang Gelap)
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 p-4"
    >
      {/* MODAL CONTAINER */}
      <div
        onClick={stopPropagation}
        style={{ width, minWidth, maxWidth }}
        className="bg-white dark:bg-[#111C30] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/10 flex flex-col max-h-[90vh] transform transition-all"
      >
        
        {/* ================= HEADER MODAL ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            {title && (
              <h2 className="text-lg font-black text-slate-800 dark:text-white transition-colors">
                {title}
              </h2>
            )}
          </div>

          {/* Tombol Close (X) */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* ================= KONTEN MODAL ================= */}
        {/* overflow-y-auto biar kalau isinya panjang (kayak form) bisa di-scroll tanpa ngerusak modal */}
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        
      </div>
    </div>,
    // Fallback ke document.body kalau misal id 'modal-root' gak ada di index.html lu
    document.getElementById("modal-root") || document.body
  );
}

export default Modal;