import React from "react";
import PropTypes from "prop-types";

function ChecklistComponent({
  items = [],
  selectedIds = [],
  onChange,
  title = "Daftar Kelengkapan",
  checkedLabel = "Lengkap",
  emptyMessage = "Tidak ada item tersedia.",
  disabled = false,
  isOpen = true,
  setIsOpen = () => {},
}) {
  const selectedCount = items.filter((item) =>
    selectedIds.some((selected) => selected.value === item.id)
  ).length;

  const total = items.length;
  const progressPct = total ? (selectedCount / total) * 100 : 0;

  const handleToggle = (item) => {
    if (disabled) return;

    const exists = selectedIds.some((selected) => selected.value === item.id);

    let updated;

    if (exists) {
      updated = selectedIds.filter((selected) => selected.value !== item.id);
    } else {
      updated = [...selectedIds, { value: item.id, label: item.label }];
    }

    onChange && onChange(updated);
  };

  return (
    <div className="rounded-lg bg-white overflow-hidden border border-slate-200 shadow-sm">
      {/* Header */}
      <div
        className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between cursor-pointer hover:bg-slate-100 items-center transition-colors"
        // PERBAIKAN 2: Menggunakan setIsOpen dan isOpen dari props
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold tracking-wider text-slate-700 uppercase">
          {title}
        </span>

        <div className="relative text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full min-w-[56px] text-center overflow-hidden border border-slate-200 shadow-inner">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-200 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <span className="relative z-10">
            {selectedCount}/{total}
          </span>
        </div>
      </div>

      {/* Progress Bar Tipis */}
      <div className="h-[3px] bg-slate-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Body Options */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm col-span-2">
              {emptyMessage}
            </div>
          ) : (
            items.map((item) => {
              const isChecked = selectedIds.some(
                (selected) => selected.value === item.id,
              );

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleToggle(item)}
                  disabled={disabled}
                  className={`
                  flex items-center gap-3 px-4 py-3 text-left transition
                  border-b border-r border-slate-100
                  ${isChecked ? "bg-emerald-50/50" : "bg-white"}
                  ${disabled ? "cursor-not-allowed opacity-60 grayscale" : "hover:bg-slate-50"}
                `}
                >
                  {/* Checkbox Icon */}
                  <div
                    className={`
                    w-[18px] h-[18px] rounded flex items-center justify-center shrink-0
                    border-2 transition-all duration-200
                    ${
                      isChecked
                        ? "bg-emerald-500 border-emerald-500 scale-105"
                        : "border-slate-300 bg-white hover:border-emerald-400"
                    }
                  `}
                  >
                    {isChecked && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1.5 5L3.8 7.5L8.5 2.5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Label Text */}
                  <span
                    className={`flex-1 text-sm transition-colors ${
                      isChecked ? "text-emerald-800 font-medium" : "text-slate-600"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Right Badge Indicator */}
                  {isChecked ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                      ✓ {checkedLabel}
                    </span>
                  ) : (
                    <span className="text-slate-300 w-6 text-center">—</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

ChecklistComponent.propTypes = {
  items: PropTypes.array.isRequired,
  selectedIds: PropTypes.array,
  onChange: PropTypes.func,
  title: PropTypes.string,
  checkedLabel: PropTypes.string,
  emptyMessage: PropTypes.string,
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default ChecklistComponent;