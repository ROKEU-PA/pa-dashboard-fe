import { FileText, X } from "lucide-react";
import React, { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);
  if (!open) return null;

  const stopPropagation = (e) => e.stopPropagation();

  const buttonStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    border: "none",
    background: "transparent",
    fontSize: "30px",
    cursor: "pointer",
    color: isHovered ? "#3f51b5" : "#000", // example hover effect
  };

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        onClick={stopPropagation}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          minWidth: minWidth,
          maxWidth: maxWidth,
          width: width,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        {/* <button
          onClick={onClose}
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Close modal"
        >
          ×
        </button> */}
        {/* {title && (
          <h2
            style={{
              marginTop: "0px",
              marginBottom: "2rem",
            }}
          >
            {title}
          </h2>
        )} */}
        {/* Area Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {/* Optional: Tambahin Icon di samping title biar makin cakep */}
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          </div>

          {/* Tombol Close (X) */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: "2rem", width: "100%" }}>{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}

export default Modal;
