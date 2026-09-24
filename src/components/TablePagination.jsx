import React from "react";
// Import icon biar makin cakep (opsional, pastikan lucide-react terinstall)
import { ChevronLeft, ChevronRight } from "lucide-react";

function TablePagination({
  page,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full pt-1 pb-1 px-2">
      
      {/* Bagian Kiri: Dropdown Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Rows per page:
        </span>
        <div className="relative">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs font-bold rounded-lg pl-3 pr-8 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
          >
            {[5, 8, 10, 25, 50].map((value) => (
              <option key={value} value={value} className="text-slate-800 dark:text-white">
                {value}
              </option>
            ))}
          </select>
          {/* Ikon panah bawah custom buat select */}
          <ChevronDownIcon />
        </div>
      </div>

      {/* Bagian Kanan: Tombol Prev & Next */}
      <div className="flex items-center gap-4">
        
        {/* Tombol Prev */}
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
            page === 0
              ? "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              : "bg-white dark:bg-white/10 border-slate-200 dark:border-white/20 text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 hover:text-blue-500 dark:hover:text-blue-400 hover:-translate-x-0.5 shadow-sm"
          }`}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Prev
        </button>
        
        {/* Info Halaman */}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Page <strong className="text-slate-800 dark:text-white font-black">{page + 1}</strong> of <strong className="text-slate-800 dark:text-white font-black">{totalPages}</strong>
        </span>
        
        {/* Tombol Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
            page >= totalPages - 1
              ? "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              : "bg-white dark:bg-white/10 border-slate-200 dark:border-white/20 text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 hover:text-blue-500 dark:hover:text-blue-400 hover:translate-x-0.5 shadow-sm"
          }`}
        >
          Next
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}

// Mini Component untuk Ikon Select biar lebih rapi
const ChevronDownIcon = () => (
  <svg 
    className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
  </svg>
);

export default TablePagination;