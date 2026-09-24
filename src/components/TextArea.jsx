import React, { useState } from "react";
import PropTypes from "prop-types";
import { requiredValidator } from "@/services/GeneralHelper";

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  helperText = "",
  name,
  rows = 4,
  className = "", // Ditambahin biar gampang nge-custom dari luar
  validate,
  required = false,
}) {
  const [isFocused, setFocused] = useState(false);
  const [localError, setLocalError] = useState("");

  const runValidation = (val) => {
    const validators = [];

    // Fallback ke name kalau label gak dikasih
    if (required) validators.push(requiredValidator(label || name)); 
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

  const handleBlur = () => {
    setFocused(false);
    setLocalError(runValidation(value));
  };

  // Nambahin pengecekan value === 0 buat jaga-jaga
  const showFloatingLabel = isFocused || value || value === 0;
  const isError = error || localError;

  return (
    <div className={`relative flex flex-col w-full mt-1 ${className}`}>
      
      {/* ================= FLOATING LABEL ================= */}
      {label && (
        <label
          className={`absolute left-3 px-1.5 transition-all duration-200 pointer-events-none z-10 bg-white dark:bg-[#0A111E] ${
            showFloatingLabel
              ? "-top-2.5 text-xs font-bold"
              : "top-3.5 text-sm font-medium"
          } ${
            isError
              ? "text-red-500 dark:text-red-400"
              : isFocused
              ? "text-blue-500 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ================= TEXTAREA FIELD ================= */}
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={showFloatingLabel ? placeholder : ""}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        rows={rows}
        className={`w-full px-4 py-3 text-sm rounded-xl outline-none transition-all bg-transparent text-slate-800 dark:text-white resize-y min-h-[5rem] ${
          disabled
            ? "bg-slate-50 dark:bg-white/5 cursor-not-allowed opacity-60 border border-slate-200 dark:border-white/10"
            : isError
            ? "border border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        }`}
      />

      {/* ================= HELPER TEXT / ERROR ================= */}
      {(isError || helperText) && (
        <div className="text-xs font-medium text-red-500 mt-1.5 ml-1">
          {localError || helperText}
        </div>
      )}
    </div>
  );
}

Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
  validate: PropTypes.func,
  required: PropTypes.bool,
};

export default Textarea;