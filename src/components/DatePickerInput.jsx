import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerInput({
  label,
  selected,
  onChange,
  placeholder = "",
  name,
  required = false,
  error = false,
  helperText = "",
  minDate,
  maxDate,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
}) {
  const [isFocused, setFocused] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const runValidation = (val) => {
    if (required && !val) return '${label} wajib diisi';
    return "";
  };

  useEffect(() => {
    const errorMessage = runValidation(selected);
    setLocalError(errorMessage);
  }, [selected]);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    const errorMessage = runValidation(selected);
    setLocalError(errorMessage);
  };

  const showFloatingLabel = isFocused || selected;

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  const labelStyle = {
    position: "absolute",
    
    // UBAH INI:
    zIndex: 1, 
    top: showFloatingLabel ? "-0.6rem" : "0.7rem",
    left: "0.75rem",
    fontSize: showFloatingLabel ? "0.75rem" : "1rem",
    color: error ? "#d32f2f" : isFocused ? "#3f51b5" : "#777",
    backgroundColor: "#ffffff", // Sesuai settingan terakhir (putih)
    padding: "0 4px",
    transition: "all 0.2s ease",
    pointerEvents: "none",
};

  const inputStyle = {
    // width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: '1px solid ${error || localError ? "#d32f2f" : "#ccc"}',
    borderRadius: "4px",
    backgroundColor: "transparent", 
    color: "#333",
  };

  const helperTextStyle = {
    fontSize: "0.75rem",
    color: error || localError ? "#d32f2f" : "#777",
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{label}</label>
      <DatePicker
        ref={inputRef}
        selected={selected}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderText={showFloatingLabel ? placeholder : ""}
        name={name}
        minDate={minDate}
        maxDate={maxDate}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
        customInput={<input style={inputStyle} />}
        wrapperClassName="date-picker-wrapper"
      />
      {(helperText || localError) && (
        <div style={helperTextStyle}>{localError || helperText}</div>
      )}
    </div>
  );

DatePickerInput.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  selectsStart: PropTypes.bool,
  selectsEnd: PropTypes.bool,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};
}
export default DatePickerInput;