import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { requiredValidator } from "../services/GeneralHelper";
import themeColors from "../constants/color";

function MultiSelect({
  label,
  name,
  value = [],
  onChange,
  options = [],
  placeholder = `Pilih ${label} dari opsi berikut`,
  disabled = false,
  error = false,
  helperText = "",
  style,
  validate,
  required = false,
  isOpen,
  setIsOpen,
}) {
  //   const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleOptionClick = (clickedValue) => {
    let newValue;
    if (value.some((v) => v.value === clickedValue)) {
      newValue = value.filter((v) => v.value !== clickedValue);
    } else {
      const selectedOption = options.find((opt) => opt.value === clickedValue);
      newValue = [...value, selectedOption];
    }

    onChange(newValue);

    const errorMessage = runValidation(newValue);
    setLocalError(errorMessage);
  };

  const handleClearAll = () => {
    onChange([]);
    const errorMessage = runValidation([]);
    setLocalError(errorMessage);
  };

  const containerStyle = {
    ...style,
    position: "relative",
    width: style?.width || "100%",
  };

  const labelStyle = {
    position: "absolute",
    top: "-0.6rem",
    left: "0.75rem",
    fontSize: "0.75rem",
    color: error ? "#d32f2f" : "#777",
    backgroundColor: "white",
    padding: "0 4px",
    pointerEvents: "none",
  };

  const helperTextStyle = {
    fontSize: "0.75rem",
    color: error || localError ? "#d32f2f" : "#777",
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          padding: "0.75rem",
          minHeight: "1.1rem",
          border: `1px solid ${error ? "#d93025" : "#ccc"}`,
          borderRadius: "4px",
          backgroundColor: disabled ? "#f5f5f5" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {value.length > 0 ? (
          value.map((v) => (
            <span
              key={v.value}
              style={{
                backgroundColor: themeColors.primary.light,
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.8rem",
              }}
            >
              {v.label}
            </span>
          ))
        ) : (
          <span style={{ color: "#999" }}>{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: themeColors.background,
            zIndex: 10,
            maxHeight: "220px",
            overflowY: "auto",
            marginTop: "4px",
          }}
        >
          {value.length > 0 && (
            <div
              onClick={handleClearAll}
              style={{
                padding: "0.75rem",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                fontWeight: "bold",
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
              }}
            >
              ✕ Clear All
            </div>
          )}
          {options.map((opt) => {
            const isSelected = value.some((v) => v.value === opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => handleOptionClick(opt.value)}
                style={{
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: isSelected
                    ? themeColors.primary.light
                    : themeColors.background,
                  color: isSelected
                    ? themeColors.card
                    : themeColors.primary.light,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  style={{ pointerEvents: "none" }}
                />
                {opt.label}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#3bb999",
              color: "white",
              border: "none",
              borderRadius: "0 0 4px 4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Selesai
          </button>
        </div>
      )}

      {(helperText || localError) && (
        <div style={helperTextStyle}>{localError || helperText}</div>
      )}
    </div>
  );
}

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  style: PropTypes.object,
  validate: PropTypes.func,
  required: PropTypes.bool,
};

export default MultiSelect;
