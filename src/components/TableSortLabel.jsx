import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function TableSortLabel({
  active = false,
  direction = "asc",
  children,
  onClick,
}) {
  const icon =
    direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;

  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        gap: "4px",
      }}
    >
      <span>{children}</span>
      <span
        style={{
          opacity: active ? 1 : 0,
          transition: "opacity 0.2s",
          display: "flex",
          alignItems: "center",
        }}
        className="sort-icon"
      >
        {icon}
      </span>
    </span>
  );
}

export default TableSortLabel;
