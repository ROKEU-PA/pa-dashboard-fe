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
  style,
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

    if (required) validators.push(requiredValidator(label)); // use label as field name
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
    const errorMessage = runValidation(val);
    setLocalError(errorMessage);
  };

  const handleBlur = () => {
    setFocused(false);
    const errorMessage = runValidation(value);
    setLocalError(errorMessage);
  };

  const showFloatingLabel = isFocused || value;
  const isError = error || localError;

  const containerStyle = {
    width: style?.width ?? "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    ...style,
  };

  const labelStyle = {
    position: "absolute",
    top: showFloatingLabel ? "-0.6rem" : "0.7rem",
    left: "0.75rem",
    fontSize: showFloatingLabel ? "0.75rem" : "1rem",
    // Disamakan dengan warna biru Select.jsx (#308BFD)
    color: isError ? "#d32f2f" : isFocused ? "#308BFD" : "#777",
    backgroundColor: "white",
    padding: "0 4px",
    transition: "all 0.2s ease",
    pointerEvents: "none",
    zIndex: 10,
  };

  const toggleStyle = {
    position: "absolute",
    right: "0.5rem",
    top: "50%",
    transform: localError ? "translateY(-80%)" : "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    color: "#777",
  };

  const inputStyle = {
    padding: "0.75rem",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    border: isError ? "1px solid #d32f2f" : isFocused ? "1px solid #308BFD" : "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: disabled ? "#f5f5f5" : "#fff",
    color: "#333",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: isFocused && !isError ? "0 0 0 1px #308BFD" : isFocused && isError ? "0 0 0 1px #d32f2f" : "none",
    cursor: disabled ? "not-allowed" : "text",
  };

  const helperTextStyle = {
    fontSize: "0.75rem",
    color: isError ? "#d32f2f" : "#777",
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label} {required && <span style={{ color: "#d32f2f" }}>*</span>}</label>}
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={showFloatingLabel ? placeholder : ""}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        style={inputStyle}
      />
      {(helperText || localError) && (
        <div style={helperTextStyle}>{localError || helperText}</div>
      )}

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          style={toggleStyle}
          tabIndex={-1}
        >
          {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  style: PropTypes.object,
  validate: PropTypes.func,
  required: PropTypes.bool,
};

export default Input;