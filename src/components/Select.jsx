import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { requiredValidator } from "../services/GeneralHelper";
import { ChevronDown, Search } from "lucide-react";

function Select({
  label = null,
  name,
  value,
  onChange,
  options = [],
  noPlaceholder = false,
  placeholder = `Pilih opsi...`,
  disabled = false,
  error = false,
  helperText = "",
  validate,
  required = false,
  isOpen,
  setIsOpen,
  isSearchable = false,
}) {
  const containerRef = useRef(null);
  const [localError, setLocalError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const runValidation = (val) => {
    const validators = [];
    if (required) validators.push(requiredValidator(label));
    if (validate) validators.push(validate);

    for (const fn of validators) {
      const result = fn(val);
      if (result) return result;
    }
    return "";
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(e);
    setLocalError(runValidation(val));
  };

  const handleOptionClick = (val) => {
    if (val === value) {
      handleChange({ target: { name, value: "" } });
    } else {
      handleChange({ target: { name, value: val } });
    }
    setSearchTerm("");
    setIsOpen?.(false);
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;
  const isError = error || localError;

  // LOGIKA FLOATING LABEL
  const showFloatingLabel = value || isOpen;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen?.(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  // ==========================================
  // STYLE IDENTIK 100% DENGAN INPUT.JSX
  // ==========================================
  const containerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    marginTop: "0.25rem", // Jaga-jaga biar label ngambang ga kepotong
  };

  const labelStyle = {
    position: "absolute",
    top: showFloatingLabel ? "-0.6rem" : "0.75rem",
    left: "0.75rem",
    fontSize: showFloatingLabel ? "0.75rem" : "1rem",
    // Warna biru yang persis sama dengan Input.jsx
    color: isError ? "#d32f2f" : isOpen ? "#308BFD" : "#777",
    backgroundColor: "white",
    padding: "0 4px",
    transition: "all 0.2s ease",
    pointerEvents: "none",
    zIndex: 10,
  };

  const triggerStyle = {
    padding: "0.75rem",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    // Logika border warna biru saat terbuka, merah saat error
    border: isError ? "1px solid #d32f2f" : isOpen ? "1px solid #308BFD" : "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: disabled ? "#f5f5f5" : "#fff",
    color: "#333",
    transition: "all 0.2s ease",
    // Efek Shadow / Ring biru glowing persis Input.jsx
    boxShadow: isOpen && !isError ? "0 0 0 1px #308BFD" : isOpen && isError ? "0 0 0 1px #d32f2f" : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    userSelect: "none",
  };

  const helperTextStyle = {
    fontSize: "0.75rem",
    color: isError ? "#d32f2f" : "#777",
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Label */}
      {label && (
        <label style={labelStyle}>
          {label} {required && <span style={{ color: "#d32f2f" }}>*</span>}
        </label>
      )}

      {/* Input Box (Select Trigger) */}
      <div onClick={() => !disabled && setIsOpen?.(!isOpen)} style={triggerStyle}>
        {/* Placeholder text logic */}
        <span
          className={`truncate text-sm ${selectedLabel ? "font-medium text-slate-800" : (showFloatingLabel ? "text-slate-400" : "opacity-0")}`}
        >
          {selectedLabel || (noPlaceholder ? "" : placeholder)}
        </span>
        
        {/* Icon Panah */}
        <ChevronDown
          size={18}
          style={{
            color: isOpen ? "#308BFD" : "#999", // Warna panah ikut jadi biru
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.2s ease"
          }}
        />
      </div>

      {/* Dropdown Options List & Search (Tetap pakai Tailwind yang sudah diperbaiki) */}
      {isOpen && (
        <div className="absolute z-50 w-full top-[105%] left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto overflow-x-hidden flex flex-col">
          
          {isSearchable && (
            <div className="p-2 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  // Tailwind valid untuk custom hex
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#308BFD] focus:border-[#308BFD] transition-all placeholder:text-slate-400"
                  placeholder="Cari opsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400">Pencarian tidak ditemukan</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleOptionClick(opt.value)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer transition-colors break-words
                    ${opt.value === value 
                      ? "bg-[#EAF4FF] text-[#308BFD] font-semibold border-l-4 border-[#308BFD]" 
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#308BFD] border-l-4 border-transparent"}
                  `}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Helper / Error Text */}
      {(isError || helperText) && (
        <div style={helperTextStyle}>{localError || helperText}</div>
      )}
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.func,
  required: PropTypes.bool,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  isSearchable: PropTypes.bool,
};

export default Select;