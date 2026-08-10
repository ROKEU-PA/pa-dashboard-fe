import React, { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeClosed } from "lucide-react";
import { requiredValidator } from "@/services/GeneralHelper";

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  helperText = "",
  name,
  className = "", // Ditambahin biar gampang nge-custom dari luar
  validate = () => "",
  required = false,
}) {
  const [isFocused, setFocused] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const runValidation = (val) => {
    const validators = [];
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

  // Nambahin pengecekan value === 0 biar angka 0 gak dianggap kosong
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

      {/* ================= INPUT FIELD ================= */}
      <div className="relative w-full">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={showFloatingLabel ? placeholder : ""}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          // Kalau type password, kasih padding kanan extra (pr-10) biar teks gak nabrak icon mata
          className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all bg-transparent text-slate-800 dark:text-white ${
            isPassword ? "pr-10" : ""
          } ${
            disabled
              ? "bg-slate-50 dark:bg-white/5 cursor-not-allowed opacity-60 border border-slate-200 dark:border-white/10"
              : isError
              ? "border border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />

        {/* ================= PASSWORD TOGGLE ICON ================= */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
          >
            {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ================= HELPER TEXT / ERROR ================= */}
      {(isError || helperText) && (
        <div className="text-xs font-medium text-red-500 mt-1.5 ml-1">
          {localError || helperText}
        </div>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
  validate: PropTypes.func,
  required: PropTypes.bool,
};

export default Input;