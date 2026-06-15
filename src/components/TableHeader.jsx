import React from "react";

function TableHeader({ children, className }) {
  return (
    // Menggabungkan warna biru default dengan className tambahan dari luar
    <thead className={`bg-gradient-to-b from-[#59C7FF] to-[#2F8AFD] text-white ${className}`}>
      {children}
    </thead>
  );
}

export default TableHeader;