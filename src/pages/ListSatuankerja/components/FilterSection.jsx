import React from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import DatePickerInput from "@/components/DatePickerInput";
import { Book, Plus, Search, Calendar } from "lucide-react";
import moment from "moment";
import { isPengajuanPath } from "@/pages/ListSatuankerja/satkerHooks";

export default function FilterSection({
  location,
  userData,
  filter,
  handleDateChange,
  openAddModal,
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-5 bg-white border-b border-gray-100 rounded-t-xl">
      
      {/* Bagian Kiri: Tombol Utama */}
      <div className="w-full lg:w-auto">
        {userData && (!isPengajuanPath(location.pathname) ? (
          <Button
            onClick={openAddModal}
            className="w-full sm:w-fit px-6 py-2.5 shadow-sm active:scale-95 transition-transform bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            icon={<Plus size={18} />}
          >
            Tambah Arsip
          </Button>
        ) : (
          userData?.role === "user" && (
            <Button
              onClick={openAddModal}
              className="w-full sm:w-fit px-6 py-2.5 shadow-sm active:scale-95 transition-transform bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              icon={<Plus size={18} />}
            >
              Tambah Pengajuan
            </Button>
          )
        ))}
      </div>

      {/* Bagian Kanan: Filter Group */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-end gap-3 w-full lg:flex-1 bg-white-50 p-2 rounded-xl border border-slate-100">
        <a
          href="https://drive.google.com/file/d/1N9xY5qyOoqafGK-H6K02kXAboUpLaX4A/view"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="w-full sm:w-fit bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            icon={<Book size={18} className="text-blue-500" />}
          >
            PMK 32 2025
          </Button>
        </a>

        {/* Input dengan styling modern minimalis */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari data..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[200px]"
            value={filter.searchKey}
            onChange={(e) => handleDateChange("searchKey", e.target.value)}
          />
        </div>

        {!isPengajuanPath(location.pathname) && (
          <input
            type="text"
            placeholder="Tahun"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[100px]"
            value={filter.tahun}
            onChange={(e) => handleDateChange("tahun", e.target.value)}
          />
        )}

        <div className="flex items-center gap-2">
          <DatePickerInput
            placeholder="Start Date"
            selected={filter.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            selectsStart
            startDate={filter.startDate}
            endDate={filter.endDate}
            className="border-gray-200 rounded-lg text-sm"
          />
          <span className="text-gray-400">-</span>
          <DatePickerInput
            placeholder="End Date"
            selected={filter.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            selectsEnd
            startDate={filter.startDate}
            endDate={filter.endDate}
            minDate={filter.startDate}
            className="border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}