import React, { useState } from "react";
import ReactDOM from "react-dom";

function Modal({
  open,
  onClose,
  title,
  children,
  width = "auto",
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
          minWidth: "40vw",
          maxWidth: maxWidth,
          width: width,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Close modal"
        >
          ×
        </button>
        {title && (
          <h2
            style={{
              marginTop: "0px",
              marginBottom: "2rem",
            }}
          >
            {title}
          </h2>
        )}

        <div style={{ marginTop: "2rem", width: "100%" }}>{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default Modal;
