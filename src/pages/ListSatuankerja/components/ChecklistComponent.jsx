import React, { useState } from "react";
import PropTypes from "prop-types";

function ChecklistComponent({
  items = [],
  selectedIds = [],
  onChange,
  title = "Daftar Kelengkapan",
  checkedLabel = "Lengkap",
  emptyMessage = "Tidak ada item tersedia.",
  disabled = false,
}) {
  const [visibleOptions, setVisiblleOptions] = useState(true);
  const selectedCount = items.filter((item) =>
    selectedIds.includes(item.id),
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
    <div className="rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div
        className="px-4 pb-3 border-b border-slate-200 flex justify-between cursor-pointer hover:bg-slate-100 items-center"
        onClick={() => setVisiblleOptions(!visibleOptions)}
      >
        <span className="text-xs font-medium tracking-wider text-slate-600">
          {title}
        </span>

        <div className="relative text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full min-w-[56px] text-center overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-200 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <span className="relative z-10">
            {selectedCount}/{total}
          </span>
        </div>
      </div>

      <div className="h-[3px] bg-slate-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      {visibleOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
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
                  border-b border-slate-100
                  ${isChecked ? "bg-emerald-50" : "bg-white"}
                  ${disabled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"}
                `}
                >
                  {/* Checkbox */}
                  <div
                    className={`
                    w-[18px] h-[18px] rounded flex items-center justify-center shrink-0
                    border-2 transition
                    ${
                      isChecked
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300 bg-white"
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

                  {/* Label */}
                  <span
                    className={`flex-1 text-sm ${
                      isChecked ? "text-emerald-800" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Badge */}
                  {isChecked ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full whitespace-nowrap">
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
};

export default ChecklistComponent;
