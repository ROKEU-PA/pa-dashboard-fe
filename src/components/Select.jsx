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

  // ==========================================
  // JURUS HYBRID STATE (Otak Internal)
  // ==========================================
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Gunakan isOpen dari props JIKA ada, kalau tidak pakai internalIsOpen
  const isDropdownOpen = isOpen !== undefined ? isOpen : internalIsOpen;

  const toggleDropdown = (newState) => {
    if (setIsOpen) {
      setIsOpen(newState); // Lapor ke modal/parent lama
    }
    setInternalIsOpen(newState); // Ubah state internal
  };
  // ==========================================

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
    toggleDropdown(false); // Tutup setelah pilih
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;
  const isError = error || localError;

  // LOGIKA FLOATING LABEL
  const showFloatingLabel = value || isDropdownOpen;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        toggleDropdown(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div ref={containerRef} className="relative flex flex-col w-full mt-1">
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
        className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all flex items-center justify-between select-none ${
          disabled
            ? "bg-slate-50 dark:bg-white/5 cursor-not-allowed opacity-60 border border-slate-200 dark:border-white/10"
            : isError
            ? "bg-transparent border border-red-500 focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            : isDropdownOpen
            ? "bg-transparent border border-blue-500 ring-2 ring-blue-500/20 cursor-pointer"
            : "bg-transparent border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer"
        }`}
      >
        <span
          className={`truncate ${
            selectedLabel
              ? "font-semibold text-slate-800 dark:text-white"
              : showFloatingLabel
              ? "text-slate-400 dark:text-slate-500 font-medium"
              : "opacity-0"
          }`}
        >
          {selectedLabel || (noPlaceholder ? "" : placeholder)}
        </span>
        <ChevronDown
          size={18}
          className={`transition-all duration-200 shrink-0 ${
            isDropdownOpen
              ? "text-blue-500 dark:text-blue-400 rotate-180"
              : "text-slate-400 dark:text-slate-500 rotate-0"
          }`}
        />
      </div>

      {/* DROPDOWN OPTIONS LIST & SEARCH */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full top-[105%] left-0 mt-1 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] max-h-60 overflow-y-auto overflow-x-hidden flex flex-col">
          
          {isSearchable && (
            <div className="p-2 border-b border-slate-100 dark:border-white/10 sticky top-0 bg-white/95 dark:bg-[#111C30]/95 backdrop-blur-sm z-10 transition-colors">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Cari opsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>
            </div>
          )}

          <div className="flex flex-col py-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                Pencarian tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleOptionClick(opt.value)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer transition-colors break-words
                    ${opt.value === value 
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-l-4 border-blue-500" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 border-l-4 border-transparent"}
                  `}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
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

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) })).isRequired,
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