import React from "react";
import Button from "@/components/Button";
import { Book, Plus, Search, Calendar, RefreshCcw } from "lucide-react";
import { isPengajuanPath } from "@/pages/ListSatuankerja/satkerHooks";

export default function FilterSection({
  location,
  userData,
  filter,
  handleDateChange,
  openAddModal,
}) {
  const handleResetFilter = () => {
    handleDateChange("searchKey", "");
    handleDateChange("tahun", "");
    handleDateChange("startDate", "");
    handleDateChange("endDate", "");
  };

  return (
    // PENGATURAN WRAPPER: Pakai flex-wrap biar aman di zoom 100%
    <div className="flex flex-wrap xl:flex-nowrap justify-between items-end gap-4 p-5 bg-white dark:bg-[#111C30]/80 backdrop-blur-md border border-slate-100 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors duration-300">
      
      {/* ================= KIRI: TOMBOL TAMBAH ================= */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="text-[10px] font-bold opacity-0 select-none pointer-events-none">Spacer</label>
        
        {userData && (!isPengajuanPath(location.pathname) ? (
          <Button
            onClick={openAddModal}
            // TINGGI DIKUNCI DI h-[38px]
            className="w-fit whitespace-nowrap px-4 h-[38px] shadow-md shadow-blue-500/30 active:scale-95 transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-0"
            icon={<Plus size={16} strokeWidth={2.5} />}
          >
            Tambah Arsip
          </Button>
        ) : (
          userData?.role === "user" && (
            <Button
              onClick={openAddModal}
              // TINGGI DIKUNCI DI h-[38px]
              className="w-fit whitespace-nowrap px-4 h-[38px] shadow-md shadow-blue-500/30 active:scale-95 transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-0"
              icon={<Plus size={16} strokeWidth={2.5} />}
            >
              Tambah Pengajuan
            </Button>
          )
        ))}
      </div>

      {/* ================= KANAN: GROUP FILTER ================= */}
      {/* flex-wrap di sini bikin elemen yang gak muat otomatis turun rapi ke bawah */}
      <div className="flex flex-wrap items-end justify-start xl:justify-end gap-3.5 w-full xl:w-auto">
        
        {/* 1. Tombol PMK */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <label className="text-[10px] font-bold opacity-0 select-none pointer-events-none">Spacer</label>
          <a href="https://drive.google.com/file/d/1N9xY5qyOoqafGK-H6K02kXAboUpLaX4A/view" target="_blank" rel="noopener noreferrer">
            <Button
              // TINGGI DIKUNCI DI h-[38px]
              className="w-fit whitespace-nowrap px-4 h-[38px] bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-xl transition-colors text-sm font-bold flex items-center justify-center gap-2"
              icon={<Book size={16} strokeWidth={2.5} />}
            >
              PMK 32 2025
            </Button>
          </a>
        </div>

        {/* 2. Input Search */}
        <div className="flex flex-col gap-1.5 shrink-0 flex-1 sm:flex-none">
          <label className="text-[10px] font-bold text-[#18324f] dark:text-blue-400 uppercase tracking-wider pl-1">
            Pencarian Dokumen
          </label>
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#18324f]/50 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Cari data..."
              // TINGGI DIKUNCI DI h-[38px]
              className="w-full sm:w-[170px] pl-9 pr-3 py-0 h-[38px] bg-[#f5f8fc] dark:bg-[#0A111E] border border-[#e2e8f0] dark:border-white/10 rounded-xl text-sm font-semibold text-[#18324f] dark:text-white placeholder:text-[#18324f]/40 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={filter.searchKey || ""}
              onChange={(e) => handleDateChange("searchKey", e.target.value)}
            />
          </div>
        </div>

        {/* 3. Input Tahun (Jika bukan pengajuan) */}
        {!isPengajuanPath(location.pathname) && (
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="text-[10px] font-bold opacity-0 select-none pointer-events-none">Spacer</label>
            <input
              type="text"
              placeholder="Tahun"
              // TINGGI DIKUNCI DI h-[38px]
              className="w-[80px] px-3 py-0 h-[38px] bg-[#f5f8fc] dark:bg-[#0A111E] border border-[#e2e8f0] dark:border-white/10 rounded-xl text-sm font-semibold text-[#18324f] dark:text-white placeholder:text-[#18324f]/40 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-center"
              value={filter.tahun || ""}
              onChange={(e) => handleDateChange("tahun", e.target.value)}
            />
          </div>
        )}

        {/* 4. PERIODE TANGGAL */}
        <div className="flex flex-col gap-1.5 shrink-0 flex-1 sm:flex-none">
          <label className="text-[10px] font-bold text-[#18324f] dark:text-blue-400 uppercase tracking-wider pl-1">
            Periode Tanggal
          </label>
          {/* TINGGI DIKUNCI DI h-[38px] */}
          <div className="flex items-center bg-[#f5f8fc] dark:bg-[#0A111E] border border-[#e2e8f0] dark:border-white/10 rounded-xl h-[38px] px-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all group overflow-hidden w-full sm:w-auto">
            <Calendar className="text-[#18324f] dark:text-blue-400 shrink-0 mr-1.5" size={16} strokeWidth={2.5} />
            
            <input
              type="date"
              min="2026-01-01"
              max="2026-12-31"
              className="bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-[#18324f] dark:text-white cursor-pointer [color-scheme:light] dark:[color-scheme:dark] w-full sm:w-[115px] p-0"
              value={filter.startDate || ""}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
            
            <span className="text-[#18324f]/50 dark:text-slate-500 mx-1.5 font-bold">-</span>
            
            <input
              type="date"
              min="2026-01-01"
              max="2026-12-31"
              className="bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-[#18324f] dark:text-white cursor-pointer [color-scheme:light] dark:[color-scheme:dark] w-full sm:w-[115px] p-0"
              value={filter.endDate || ""}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* 5. Tombol Reset */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <label className="text-[10px] font-bold opacity-0 select-none pointer-events-none">Spacer</label>
          <button
            onClick={handleResetFilter}
            // TINGGI DIKUNCI DI h-[38px]
            className="flex items-center justify-center px-3 h-[38px] bg-[#f5f8fc] dark:bg-white/5 hover:bg-[#e2e8f0] dark:hover:bg-white/10 text-[#18324f] dark:text-white border border-transparent dark:border-white/5 rounded-xl transition-all"
            title="Reset Filter"
          >
            <RefreshCcw size={16} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}