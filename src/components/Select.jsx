import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { requiredValidator } from "../services/GeneralHelper";
import themeColors from "../constants/color";

function Select({
  label = null,
  name,
  value,
  onChange,
  options = [],
  noPlaceholder = false,
  placeholder = `Pilih ${label} dari opsi berikut`,
  disabled = false,
  error = false,
  helperText = "",
  style,
  validate,
  required = false,
  isOpen,
  innerHeight = "3.0rem",
  setIsOpen,
}) {
  const containerRef = useRef(null);

  const [hovered, setHovered] = useState(null);
  const isFocused = false;

  const [localError, setLocalError] = useState("");

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

  const handleOptionClick = (val) => {
    if (val === value) {
      handleChange({ target: { name, value: "" } }); // unselect
    } else {
      handleChange({ target: { name, value: val } });
    }
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const containerStyle = {
    ...style,
    position: "relative",
    width: style?.width || "100%",
  };

  const showFloatingLabel = value;

  const labelStyle = {
    position: "absolute",
    top: noPlaceholder
      ? showFloatingLabel
        ? "-0.6rem"
        : "0.7rem"
      : placeholder
        ? "-0.6rem"
        : "0.7rem",
    left: "0.75rem",
    fontSize: noPlaceholder
      ? showFloatingLabel
        ? "0.75rem"
        : "1rem"
      : placeholder
        ? "0.75rem"
        : "1rem",
    color: error ? "#d32f2f" : isFocused ? "#3f51b5" : "#777",
    backgroundColor: "white",
    padding: "0 4px",
    transition: "all 0.2s ease",
    pointerEvents: "none",
  };

  const helperTextStyle = {
    fontSize: "0.75rem",
    color: error || localError ? "#d32f2f" : "#777",
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div ref={containerRef} style={containerStyle}>
      {label && (
        <label htmlFor={name} style={labelStyle}>
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          padding: "0.75rem",
          height: innerHeight,
          border: `1px solid ${error ? "#d93025" : "#ccc"}`,
          borderRadius: "4px",
          backgroundColor: disabled ? "#f5f5f5" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%", // 🔥 IMPORTANT
          }}
        >
          {selectedLabel || (
            <span style={{ color: "#999" }}>
              {noPlaceholder ? "" : placeholder}
            </span>
          )}
        </div>
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
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "0.75rem",
                color:
                  opt.value === value
                    ? themeColors.card
                    : hovered === opt.value
                      ? "#000"
                      : themeColors.primary.light,
                backgroundColor:
                  opt.value === value
                    ? "#59C7FF"
                    : hovered === opt.value
                      ? "#EAF6FF"
                      : themeColors.background,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {(helperText || localError) && (
        <div style={helperTextStyle}>{localError || helperText}</div>
      )}
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  style: PropTypes.object,
  validate: PropTypes.func,
  required: PropTypes.bool,
};

export default Select;
