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
    <div className="rounded-[20px] bg-white dark:bg-[#111C30]/50 backdrop-blur-md overflow-hidden border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300">
      
      {/* ================= HEADER ================= */}
      <div
        className="px-5 py-4 bg-slate-50 dark:bg-[#0D1627] border-b border-slate-100 dark:border-white/10 flex justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 items-center transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
          {title}
        </span>

        {/* Progress Badge */}
        <div className="relative text-xs font-bold text-slate-600 dark:text-slate-200 bg-white dark:bg-[#0A111E] px-3 py-1 rounded-full min-w-[56px] text-center overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-200 dark:bg-emerald-500/30 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <span className="relative z-10">
            {selectedCount}/{total}
          </span>
        </div>
      </div>

      {/* ================= PROGRESS BAR TIPIS ================= */}
      <div className="h-[3px] bg-slate-100 dark:bg-white/5">
        <div
          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ================= BODY OPTIONS ================= */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-sm font-medium col-span-2">
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
                    flex items-start gap-3 px-5 py-3.5 text-left transition-all duration-200
                    border-b border-r border-slate-100 dark:border-white/5 w-full min-w-0 
                    ${isChecked ? "bg-emerald-50/50 dark:bg-emerald-500/10" : "bg-transparent"}
                    ${disabled ? "cursor-default opacity-60" : "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"}
                  `}
                >
                  {/* Checkbox Icon Custom */}
                  <div
                    className={`
                      mt-0.5 w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0
                      border-2 transition-all duration-300
                      ${
                        isChecked
                          ? "bg-emerald-500 border-emerald-500 scale-110 shadow-sm shadow-emerald-500/40"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A111E] hover:border-emerald-400 dark:hover:border-emerald-500"
                      }
                    `}
                  >
                    {isChecked && (
                      <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="animate-in zoom-in duration-200">
                        <path
                          d="M1.5 5L3.8 7.5L8.5 2.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Label Text */}
                  <span
                    className={`flex-1 min-w-0 break-words text-sm leading-snug transition-colors pr-2 ${
                      isChecked ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-600 dark:text-slate-300 font-medium"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Right Badge Indicator */}
                  {isChecked ? (
                    <span className="shrink-0 mt-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                      ✓ {checkedLabel}
                    </span>
                  ) : (
                    <span className="shrink-0 mt-0.5 text-slate-300 dark:text-slate-600 w-6 text-center font-bold">—</span>
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