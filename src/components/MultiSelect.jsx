import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { requiredValidator } from "../services/GeneralHelper";
import { ChevronDown, X } from "lucide-react";

function MultiSelect({
  label = null,
  name,
  value = [],
  onChange,
  options = [],
  placeholder = "Pilih opsi...",
  disabled = false,
  error = false,
  helperText = "",
  validate,
  required = false,
  isOpen,
  setIsOpen,
}) {
  const [localError, setLocalError] = useState("");
  const dropdownRef = useRef(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isDropdownOpen = isOpen !== undefined ? isOpen : internalIsOpen;

  const toggleDropdown = (newState) => {
    if (setIsOpen) setIsOpen(newState);
    setInternalIsOpen(newState);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsOpen]);

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

  const handleOptionClick = (clickedValue, e) => {
    if (e) e.stopPropagation();
    
    let newValue;
    if (value.some((v) => v.value === clickedValue)) {
      newValue = value.filter((v) => v.value !== clickedValue);
    } else {
      const selectedOption = options.find((opt) => opt.value === clickedValue);
      newValue = [...value, selectedOption];
    }

    onChange(newValue);
    setLocalError(runValidation(newValue));
  };

  const handleClearAll = (e) => {
    if (e) e.stopPropagation();
    onChange([]);
    setLocalError(runValidation([]));
  };

  const isError = error || localError;
  const showFloatingLabel = value.length > 0 || isDropdownOpen;

  return (
    <div ref={dropdownRef} className="relative flex flex-col w-full mt-1">
      
      {/* FLOATING LABEL DENGAN DARK MODE */}
      {label && (
        <label
          className={`absolute left-3 px-1.5 transition-all duration-200 pointer-events-none z-10 bg-white dark:bg-[#0A111E] ${
            showFloatingLabel
              ? "-top-2.5 text-xs font-bold"
              : "top-3.5 text-sm font-medium"
          } ${
            isError
              ? "text-red-500 dark:text-red-400"
              : isDropdownOpen
              ? "text-blue-500 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* INPUT BOX (SELECT TRIGGER) */}
      <div
        onClick={() => !disabled && toggleDropdown(!isDropdownOpen)}
        className={`w-full px-3 py-2 min-h-[42px] rounded-xl outline-none transition-all flex items-center justify-between select-none ${
          disabled
            ? "bg-slate-50 dark:bg-white/5 cursor-not-allowed opacity-60 border border-slate-200 dark:border-white/10"
            : isError
            ? "bg-transparent border border-red-500 focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            : isDropdownOpen
            ? "bg-transparent border border-blue-500 ring-2 ring-blue-500/20 cursor-pointer"
            : "bg-transparent border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer"
        }`}
      >
        {/* WADAH TAGS (PILLS) */}
        <div className="flex flex-wrap gap-1.5 flex-1 items-center mr-2">
          {value.length > 0 ? (
            value.map((v) => (
              <span
                key={v.value}
                className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-500/20"
              >
                {v.label}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-red-500 transition-colors" 
                  onClick={(e) => handleOptionClick(v.value, e)} 
                />
              </span>
            ))
          ) : (
            <span
              className={`truncate ${
                showFloatingLabel
                  ? "text-slate-400 dark:text-slate-500 font-medium text-sm pl-1 py-0.5"
                  : "opacity-0"
              }`}
            >
              {placeholder}
            </span>
          )}
        </div>
        
        <ChevronDown
          size={18}
          className={`transition-all duration-200 shrink-0 ${
            isDropdownOpen
              ? "text-blue-500 dark:text-blue-400 rotate-180"
              : "text-slate-400 dark:text-slate-500 rotate-0"
          }`}
        />
      </div>

      {/* DROPDOWN OPTIONS MENU */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full top-[105%] left-0 mt-1 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] max-h-60 flex flex-col overflow-hidden">
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* Tombol Clear All */}
            {value.length > 0 && (
              <div
                onClick={handleClearAll}
                className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-1 border-b border-rose-100 dark:border-rose-500/10 sticky top-0 z-10 backdrop-blur-sm"
              >
                <X size={14} strokeWidth={2.5} /> Clear All
              </div>
            )}
            
            {/* List Opsi */}
            <div className="py-1">
              {options.map((opt) => {
                const isSelected = value.some((v) => v.value === opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={(e) => handleOptionClick(opt.value, e)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors
                      ${isSelected 
                        ? "bg-blue-50/50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 font-semibold" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 pointer-events-none transition-all"
                    />
                    <span className="break-words">{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action (Selesai) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(false);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm transition-all border-t border-slate-100 dark:border-white/10 shrink-0"
          >
            Selesai
          </button>
        </div>
      )}

      {/* HELPER TEXT / ERROR MESSAGE */}
      {(isError || helperText) && (
        <div className="text-xs font-medium text-red-500 mt-1.5 ml-1">
          {localError || helperText}
        </div>
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
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.func,
  required: PropTypes.bool,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default MultiSelect;