import { useState } from "react";
import Button from "@/components/Button";
import {
  Plus,
  Search,
  Calendar,
  RefreshCcw,
  Filter,
  ChevronDown,
  Book,
  AlertCircle,
} from "lucide-react";
import { isPengajuanPath } from "@/pages/ListSatuankerja/satkerHooks";
import { FaFilePdf } from "react-icons/fa";

const STATUS_OPTIONS = [
  {
    value: "diproses",
    label: "Diproses (Butuh perbaikan)",
  },
  {
    value: "diproses_lengkap",
    label: "Diproses (Lengkap)",
  },
  {
    value: "ditolak",
    label: "Ditolak",
  },
  {
    value: "sp2d",
    label: "SP2D",
  },
];

export default function FilterSection({
  location,
  userData,
  filter,
  handleDateChange,
  handleStatusChange,
  _openAddModal,
  openAddModal,
  openMergeModal,
  jumlahPerluDiperbaikiPAPIC = 0,
  canAddSubmission,
  userSummaryNote = "",
}) {
  const [statusFocused, setStatusFocused] = useState(false);

  const isPengajuan = isPengajuanPath(location?.pathname);

  const role = String(
    userData?.role ||
      userData?.role_name ||
      userData?.rolename ||
      userData?.user?.role ||
      ""
  )
    .toLowerCase()
    .trim();

  const isUser = role === "user";

  const jumlahPerluDiperbaiki = Math.max(
    0,
    Number(jumlahPerluDiperbaikiPAPIC) || 0
  );

  /*
   * Jika API sudah memberikan boolean, gunakan keputusan API.
   * Jika belum, gunakan aturan fallback jumlah dokumen > 10.
   */
  const isTambahPengajuanDisabled =
    isPengajuan &&
    isUser &&
    (typeof canAddSubmission === "boolean"
      ? !canAddSubmission
      : jumlahPerluDiperbaiki > 10);

  const tooltipTambahPengajuan =
    String(userSummaryNote || "").trim() ||
    `Tambah Pengajuan dinonaktifkan karena terdapat ${jumlahPerluDiperbaiki} SPP yang perlu diperbaiki oleh PA PIC. Perbaiki SPP tersebut terlebih dahulu sebelum membuat pengajuan baru.`;

  const currentStatus = filter?.status || "";

  const selectedStatus =
    STATUS_OPTIONS.find((item) => item.value === currentStatus)?.label ||
    "Semua Status";

  // Pencarian dokumen
  const handleSearchChange = (value) => {
    handleDateChange("searchKey", value);
  };

  // Perubahan status menggunakan satu callback
  const handleStatusSelect = (value) => {
    const nextStatus = value || "";

    if (typeof handleStatusChange === "function") {
      handleStatusChange(nextStatus);
    } else if (typeof handleDateChange === "function") {
      handleDateChange("status", nextStatus);
    }
  };

  // Reset semua filter
  const handleResetFilter = () => {
    handleDateChange("searchKey", "");
    handleDateChange("tahun", "");
    handleDateChange("startDate", "");
    handleDateChange("endDate", "");
    handleStatusSelect("");
  };

  return (
    <div
      className="
        relative z-20 flex flex-wrap items-start justify-between gap-4
        overflow-visible
        rounded-[20px] border border-slate-100 bg-white p-5
        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
        backdrop-blur-md transition-colors duration-300
        dark:border-white/10 dark:bg-[#111C30]/80
        dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        xl:flex-nowrap
      "
    >
      {/* BAGIAN KIRI: TOMBOL */}
      <div className="relative z-30 flex shrink-0 flex-col gap-2 overflow-visible">
        <div className="relative flex min-h-[38px] items-center overflow-visible">
          {userData &&
            (!isPengajuan ? (
              <Button
                onClick={openAddModal}
                className="
                  flex h-[38px] w-fit items-center justify-center
                  gap-2 whitespace-nowrap rounded-xl border-0
                  bg-gradient-to-r from-blue-600 to-blue-500
                  px-4 text-sm font-bold text-white shadow-md
                  shadow-blue-500/30 transition-all duration-200
                  hover:from-blue-700 hover:to-blue-600
                  active:scale-95
                "
                icon={<Plus size={16} strokeWidth={2.5} />}
              >
                Tambah Arsip
              </Button>
            ) : (
              isUser && (
                <div className="group relative z-50 inline-flex overflow-visible">
                  <Button
                    onClick={() => {
                      if (isTambahPengajuanDisabled) return;
                      _openAddModal?.();
                    }}
                    disabled={isTambahPengajuanDisabled}
                    className={`
                      flex h-[38px] w-fit items-center justify-center
                      gap-2 whitespace-nowrap rounded-xl border-0
                      px-4 text-sm font-bold transition-all duration-200
                      ${
                        isTambahPengajuanDisabled
                          ? "cursor-not-allowed bg-slate-300 text-slate-500 opacity-70 shadow-none dark:bg-slate-700 dark:text-slate-400"
                          : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-blue-600 active:scale-95"
                      }
                    `}
                    icon={<Plus size={16} strokeWidth={2.5} />}
                  >
                    Tambah Pengajuan
                  </Button>

                  {isTambahPengajuanDisabled && (
                    <div
                      role="tooltip"
                      className="
                        pointer-events-none invisible absolute
                        left-0 top-full z-[9999] mt-1.5
                        w-44 max-w-[calc(100vw-2rem)]
                        overflow-hidden rounded-md
                        border border-orange-300
                        bg-orange-50
                        text-left text-[9px]
                        text-orange-900
                        shadow-sm
                        opacity-0 translate-y-1
                        transition-all duration-150
                        group-hover:visible group-hover:opacity-100
                        group-hover:translate-y-0
                        dark:border-orange-500/40
                        dark:bg-orange-950
                        dark:text-orange-100
                      "
                    >
                      <div
                        className="
                          flex items-center gap-1.5
                          border-b border-orange-300
                          bg-orange-100
                          px-2 py-1.5
                          dark:border-orange-500/40
                          dark:bg-orange-900/60
                        "
                      >
                        <div
                          className="
                            flex h-4 w-4 shrink-0 items-center justify-center
                            rounded bg-orange-200
                            text-orange-700
                            dark:bg-orange-400/20 dark:text-orange-300
                          "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                            <path d="M10.3 3.9 2.5 17.4a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                          </svg>
                        </div>

                        <span className="font-semibold text-orange-800 dark:text-orange-200">
                          Pengajuan Belum Tersedia
                        </span>
                      </div>

                      <div className="px-2 py-1.5">
                        <p className="leading-snug text-orange-800 dark:text-orange-200">
                          Upload perbaikan SPP terlebih dahulu agar dapat menambah pengajuan baru.
                        </p>

                        <div
                          className="
                            mt-1.5 flex items-center justify-between
                            rounded border border-orange-300
                            bg-orange-100 px-1.5 py-1
                            dark:border-orange-500/40
                            dark:bg-orange-900/40
                          "
                        >
                          <span className="font-medium text-orange-800 dark:text-orange-200">
                            SPP perlu diperbaiki
                          </span>

                          <span
                            className="
                              rounded bg-orange-200
                              px-1.5 py-0.5
                              font-bold text-orange-800
                              dark:bg-orange-400/20
                              dark:text-orange-300
                            "
                          >
                            {jumlahPerluDiperbaiki}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                  )
                  ))}
                  </div>

        {/* TOMBOL GABUNG PDF */}
        <Button
          onClick={openMergeModal}
          className="
            flex h-[38px] w-fit items-center justify-center
            gap-2 whitespace-nowrap rounded-xl border
            border-red-200 bg-red-500 px-4 text-sm font-bold
            text-white transition-colors hover:bg-red-600 active:scale-95
            dark:border-red-500/30 dark:bg-red-500/15
            dark:text-red-400 dark:hover:bg-red-500/25
          "
          icon={<FaFilePdf size={16} />}
        >
          Gabungkan PDF
        </Button>
      </div>

      {/* BAGIAN KANAN: FILTER */}
      <div
        className="
          flex w-full flex-wrap items-end justify-start gap-3.5
          xl:w-auto xl:justify-end
        "
      >
        {/* TOMBOL PMK */}
        <div className="flex shrink-0 flex-col gap-1.5">
          <label className="select-none text-[10px] font-bold opacity-0">
            Referensi
          </label>

          <a
            href="https://drive.google.com/file/d/1N9xY5qyOoqafGK-H6K02kXAboUpLaX4A/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="
                flex h-[38px] w-fit items-center justify-center
                gap-2 whitespace-nowrap rounded-xl border
                border-blue-200 bg-blue-50 px-4 text-sm
                font-bold text-blue-600 transition-colors
                hover:bg-blue-100 dark:border-blue-500/20
                dark:bg-blue-500/10 dark:text-blue-400
                dark:hover:bg-blue-500/20
              "
              icon={<Book size={16} strokeWidth={2.5} />}
            >
              PMK 32 2025
            </Button>
          </a>
        </div>

        {/* PENCARIAN DOKUMEN */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-none">
          <label
            className="
              pl-1 text-[10px] font-bold uppercase tracking-wider
              text-[#18324f] dark:text-blue-400
            "
          >
            Pencarian Dokumen
          </label>

          <div className="group relative">
            <Search
              size={16}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-[#18324f]/50 transition-colors
                group-focus-within:text-blue-600
                dark:text-slate-400 dark:group-focus-within:text-blue-400
              "
            />

            <input
              type="text"
              placeholder="Cari data..."
              value={filter?.searchKey || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="
                h-[38px] w-full rounded-xl border border-[#e2e8f0]
                bg-[#f5f8fc] py-0 pl-9 pr-3 text-sm font-semibold
                text-[#18324f] outline-none transition-all
                placeholder:text-[#18324f]/40 focus:border-blue-500
                focus:ring-2 focus:ring-blue-500/20
                dark:border-white/10 dark:bg-[#0A111E]
                dark:text-white dark:placeholder:text-slate-500
                sm:w-[170px]
              "
            />
          </div>
        </div>

        {/* FILTER STATUS */}
        <div className="flex shrink-0 flex-col gap-1.5">
          <label
            className="
              pl-1 text-[10px] font-semibold uppercase tracking-wider
              text-slate-500 dark:text-slate-400
            "
          >
            Filter Status
          </label>

          <div className="relative w-[220px]">
            <Filter
              size={15}
              className="
                pointer-events-none absolute left-3 top-1/2
                z-10 -translate-y-1/2 text-slate-400
              "
            />

            <select
              value={currentStatus}
              onChange={(e) => handleStatusSelect(e.target.value)}
              onFocus={() => setStatusFocused(true)}
              onBlur={() => setStatusFocused(false)}
              className={`
                h-[42px] w-full cursor-pointer appearance-none
                rounded-xl border bg-white pl-10 pr-10
                text-sm font-semibold text-slate-700 outline-none
                transition-all duration-200
                dark:bg-[#0A111E] dark:text-white
                ${
                  statusFocused
                    ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"
                    : "border-slate-200 hover:border-slate-300 dark:border-white/10"
                }
              `}
            >
              <option value="">Semua Status</option>

              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className={`
                pointer-events-none absolute right-3 top-1/2
                -translate-y-1/2 text-slate-600 transition-transform
                dark:text-slate-300
                ${statusFocused ? "rotate-180" : ""}
              `}
            />
          </div>

          {currentStatus && (
            <span className="sr-only">{selectedStatus}</span>
          )}
        </div>

        {/* FILTER TAHUN */}
        {!isPengajuan && (
          <div className="flex shrink-0 flex-col gap-1.5">
            <label className="select-none text-[10px] font-bold opacity-0">
              Tahun
            </label>

            <input
              type="text"
              placeholder="Tahun"
              value={filter?.tahun || ""}
              onChange={(e) =>
                handleDateChange("tahun", e.target.value)
              }
              className="
                h-[38px] w-[80px] rounded-xl border
                border-[#e2e8f0] bg-[#f5f8fc] px-3
                py-0 text-center text-sm font-semibold
                text-[#18324f] outline-none transition-all
                placeholder:text-[#18324f]/40 focus:border-blue-500
                focus:ring-2 focus:ring-blue-500/20
                dark:border-white/10 dark:bg-[#0A111E]
                dark:text-white dark:placeholder:text-slate-500
              "
            />
          </div>
        )}

        {/* PERIODE TANGGAL */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-none">
          <label
            className="
              pl-1 text-[10px] font-bold uppercase tracking-wider
              text-[#18324f] dark:text-blue-400
            "
          >
            Periode Tanggal
          </label>

          <div
            className="
              group flex h-[38px] w-full items-center overflow-hidden
              rounded-xl border border-[#e2e8f0] bg-[#f5f8fc] px-3
              transition-all focus-within:border-blue-500
              focus-within:ring-2 focus-within:ring-blue-500/20
              dark:border-white/10 dark:bg-[#0A111E] sm:w-auto
            "
          >
            <Calendar
              size={16}
              strokeWidth={2.5}
              className="mr-1.5 shrink-0 text-[#18324f] dark:text-blue-400"
            />

            <input
              type="date"
              value={filter?.startDate || ""}
              onChange={(e) =>
                handleDateChange("startDate", e.target.value)
              }
              className="
                w-full cursor-pointer bg-transparent p-0
                text-sm font-bold text-[#18324f] outline-none
                [color-scheme:light] dark:text-white
                dark:[color-scheme:dark] sm:w-[115px]
              "
            />

            <span className="mx-1.5 font-bold text-[#18324f]/50 dark:text-slate-500">
              -
            </span>

            <input
              type="date"
              min={filter?.startDate || undefined}
              value={filter?.endDate || ""}
              onChange={(e) =>
                handleDateChange("endDate", e.target.value)
              }
              className="
                w-full cursor-pointer bg-transparent p-0
                text-sm font-bold text-[#18324f] outline-none
                [color-scheme:light] dark:text-white
                dark:[color-scheme:dark] sm:w-[115px]
              "
            />
          </div>
        </div>

        {/* RESET FILTER */}
        <div className="flex shrink-0 flex-col gap-1.5">
          <label className="select-none text-[10px] font-bold opacity-0">
            Reset
          </label>

          <button
            type="button"
            onClick={handleResetFilter}
            title="Reset Filter"
            aria-label="Reset Filter"
            className="
              flex h-[38px] items-center justify-center
              rounded-xl border border-transparent bg-[#f5f8fc]
              px-3 text-[#18324f] transition-all
              hover:bg-[#e2e8f0] dark:border-white/5
              dark:bg-white/5 dark:text-white dark:hover:bg-white/10
            "
          >
            <RefreshCcw size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
