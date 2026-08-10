import React from "react";

function TableHeader({ children, className = "" }) {
  return (
    <thead 
      className={`bg-slate-50/80 dark:bg-[#0D1627]/80 border-b border-slate-200 dark:border-white/10 ${className}`}
    >
      {children}
    </thead>
  );
}

export default TableHeader;