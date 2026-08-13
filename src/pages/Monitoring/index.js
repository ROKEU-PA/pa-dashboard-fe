import React, { useContext, useEffect, useState, useMemo } from "react";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";
import TablePagination from "@/components/TablePagination";
import { buildQueryString } from "@/services/GeneralHelper";
import {
  Search,
  Building2,
  Calendar as CalendarIcon,
  RefreshCcw,
  Inbox,
  Send,
  CheckCircle2,
  Wrench,
  XCircle,
  FileText,
  MoreHorizontal,
  ArrowRight
} from "lucide-react";

// ==========================================
// 1. COMPONENTS
// ==========================================

const StatCard = ({ icon: Icon, label, value, total, colorClass, darkColorClass, iconColor, sparkline }) => {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="bg-white dark:bg-[#111C30]/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/10 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:border-white/20 transition-all duration-300 backdrop-blur-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass} ${darkColorClass}`}>
            <Icon size={22} className={iconColor} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-tight mt-0.5">{value}</span>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-center mt-4">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {label === "Total Data" ? "Semua SPP" : `${percentage}% dari total`}
        </span>
      </div>
    </div>
  );
};

const SummaryChart = ({ stats }) => {
  const total = stats.total || 1;
  const pctBaru = (stats.baru / total) * 100;
  const pctProses = (stats.approved / total) * 100;
  const pctPerbaikan = (stats.fix / total) * 100;
  const pctDitolak = (stats.ditolak / total) * 100;
  const pctSP2D = (stats.sp2d / total) * 100;

  const grad1 = pctBaru;
  const grad2 = grad1 + pctProses;
  const grad3 = grad2 + pctPerbaikan;
  const grad4 = grad3 + pctDitolak;

  const conicStyle = {
    background: `conic-gradient(
      #3b82f6 0% ${grad1}%, 
      #10b981 ${grad1}% ${grad2}%, 
      #f59e0b ${grad2}% ${grad3}%, 
      #ef4444 ${grad3}% ${grad4}%, 
      #14b8a6 ${grad4}% 100%
    )`
  };

  const legendData = [
    { label: "Baru", value: stats.baru, pct: pctBaru, color: "bg-blue-500" },
    { label: "Diproses (Lengkap)", value: stats.approved, pct: pctProses, color: "bg-emerald-500" },
    { label: "Butuh Perbaikan", value: stats.fix, pct: pctPerbaikan, color: "bg-amber-500" },
    { label: "Ditolak", value: stats.ditolak, pct: pctDitolak, color: "bg-red-500" },
    { label: "SP2D", value: stats.sp2d, pct: pctSP2D, color: "bg-teal-500" },
  ];

  return (
    <div className="bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 flex flex-col h-full transition-colors">
      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6">Ringkasan Status Hari Ini</h3>
      <div className="flex flex-col lg:flex-row items-center gap-8 flex-1">
        
        <div className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner" style={conicStyle}>
          <div className="absolute w-28 h-28 bg-white dark:bg-[#111C30] rounded-full flex flex-col items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.05)] transition-colors">
            <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.total}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Total Data</span>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-3">
          {legendData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800 dark:text-white">{item.value}</span>
                <span className="text-slate-400 dark:text-slate-500 w-8 text-right">{item.pct.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SppTypeMonthList = ({ statsArray }) => {
  return (
    <div className="bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 flex flex-col h-full mt-4 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Jenis SPP Bulan Ini
        </h3>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
          {moment().format("MMMM YYYY")}
        </span>
      </div>
      
      {/* Tambahin overflow-y-auto biar kalau lebih dari 5 bisa di-scroll cakep */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
        {statsArray.length > 0 ? (
          statsArray.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                  <FileText size={16} className={item.color} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1" title={item.title}>
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Total SPP diajukan</span>
                </div>
              </div>
              <span className="text-sm font-black text-slate-800 dark:text-white shrink-0 ml-2">{item.value}</span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
            <Inbox size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">Belum ada SPP bulan ini.</span>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

function MonitoringPage() {
  const { userData } = useContext(AppContext);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableNow, setDataNowTable] = useState([]);
  const [dataReceiptTable, setDataReceiptTable] = useState([]);
  const [filter, setFilter] = useState({ tahun: "", kode_satker: "", searchKey: "", startDate: null, endDate: null });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [sppTypesBulanIni, setSppTypesBulanIni] = useState([]);

  const handleFilterChange = (key, value) => {
    setPage(0);
    setFilter((prev) => {
      const newFilter = { ...prev, [key]: value };
      if (key === "startDate" && newFilter.endDate && value > newFilter.endDate) {
        newFilter.endDate = null;
      }
      return newFilter;
    });
  };

  const fetchCount = async () => {
    try {
      const data = await apiRequest({ url: `/archive/summary/status` });
      if (data.success && data.data) {
        setDataTable(data.data.all);
        setDataNowTable(data.data.now);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReceipt = async () => {
    try {
      const isUser = userData?.role === "user";
      const query = buildQueryString({
        biro_code: isUser ? userData?.biro_code : filter.kode_satker,
        search_key: filter.searchKey,
        page: page + 1,
        per_page: rowsPerPage,
        sort_by: sortBy,
        sort_dir: sortDir,
        start_date: filter.startDate ? moment(filter.startDate).format("YYYY-MM-DD") : "",
        end_date: filter.endDate ? moment(filter.endDate).format("YYYY-MM-DD") : "",
      });
      
      const data = await apiRequest({ url: `/archive/summary/receipt?${query}` });
      
      if (data.success) {
        setDataReceiptTable(data.data?.data || []);
        if (data.data?.last_page) {
          setTotalPages(data.data.last_page);
        } else if (data.data?.total) {
          const calculatedPages = Math.ceil(Number(data.data.total) / rowsPerPage);
          setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
        } else {
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSppTypesThisMonth = async () => {
    try {
      const isUser = userData?.role === "user";
      
      // Paksa start_date awal bulan dan end_date akhir bulan
      const startOfMonth = moment().startOf('month').format("YYYY-MM-DD");
      const endOfMonth = moment().endOf('month').format("YYYY-MM-DD");

      const query = buildQueryString({
        biro_code: isUser ? userData?.biro_code : filter.kode_satker,
        page: 1,
        per_page: 1000, // Tembak gede sekalian biar semua data bulan ini ketarik buat direkap
        start_date: startOfMonth,
        end_date: endOfMonth,
      });
      
      const data = await apiRequest({ url: `/archive/summary/receipt?${query}` });
      
      if (data.success && data.data?.data) {
        const records = data.data.data;
        
        // Grouping & Counting data per 'jenis_spp'
        const grouped = records.reduce((acc, curr) => {
          const type = curr.jenis_spp || "Tidak Diketahui";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        // Palet warna biar tampilannya warna-warni cakep
        const colors = [
          { text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { text: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
          { text: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
          { text: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10" },
        ];

        // Ubah Object hasil grouping jadi Array, dan urutin dari yang terbanyak
        const statsArray = Object.keys(grouped).map((key, index) => ({
          title: key,
          value: grouped[key],
          color: colors[index % colors.length].text,
          bg: colors[index % colors.length].bg
        })).sort((a, b) => b.value - a.value);

        setSppTypesBulanIni(statsArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchReceipt();
    fetchSppTypesThisMonth();
  }, [filter.kode_satker, filter.searchKey, page, rowsPerPage, sortBy, sortDir, filter.startDate, filter.endDate]);

  const stats = useMemo(() => {
    const filteredSummary = (dataTable || []).filter(item => {
      const itemSatker = item?.kode_satker?.toString() || "";
      const userSatker = userData?.biro_code?.toString() || "";
      const filterSatker = filter?.kode_satker?.toString() || "";
      return userData?.role === "user" ? itemSatker === userSatker : (filterSatker ? itemSatker === filterSatker : true);
    });

    const totals = filteredSummary.reduce((acc, curr) => {
      return {
        baru: acc.baru + (Number(curr.new) || 0),
        approved: acc.approved + (Number(curr.approved) || 0),
        fix: acc.fix + (Number(curr.fix) || 0), // Catatan: curr.reject ini nama key API lu, sesuaikan
        ditolak: acc.ditolak + (Number(curr.reject) || 0),
        sp2d: acc.sp2d + (Number(curr.sp2d) || 0),
        total: acc.total + (Number(curr.total) || 0),
      };
    }, { baru: 0, approved: 0, fix: 0, ditolak: 0, sp2d: 0, total: 0 });
    
    return totals;
  }, [dataTable, filter.kode_satker, userData]);

  const statsNow = useMemo(() => {
    const filteredSummary = (dataTableNow || []).filter(item => {
      const itemSatker = item?.kode_satker?.toString() || "";
      const userSatker = userData?.biro_code?.toString() || "";
      const filterSatker = filter?.kode_satker?.toString() || "";
      return userData?.role === "user" ? itemSatker === userSatker : (filterSatker ? itemSatker === filterSatker : true);
    });
    
    const totals = filteredSummary.reduce((acc, curr) => {
      return {
        baru: acc.baru + (Number(curr.new) || 0),
        approved: acc.approved + (Number(curr.approved) || 0),
        fix: acc.fix + (Number(curr.fix) || 0), // Catatan: curr.reject ini nama key API lu, sesuaikan
        ditolak: acc.ditolak + (Number(curr.reject) || 0),
        sp2d: acc.sp2d + (Number(curr.sp2d) || 0),
        total: acc.total + (Number(curr.total) || 0),
      };
    }, { baru: 0, approved: 0, fix: 0, ditolak: 0, sp2d: 0, total: 0 });
    
    return totals;
  }, [dataTableNow, filter.kode_satker, userData]);

  // Modifikasi fungsi Helper Warna untuk Support Dark Mode
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes("baru")) return "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30";
    if (s?.includes("diproses")) return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30";
    if (s?.includes("perbaikan")) return "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/30";
    if (s?.includes("ditolak")) return "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/30";
    if (s?.includes("sp2d")) return "bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border-teal-500/30";
    return "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 border-slate-500/30";
  };

  return (  
    // Tambahkan transparent di dark mode karena AppLayout udah punya background-nya sendiri
    <div className="w-full flex flex-col gap-5 pb-10 bg-[#f4f7fa] dark:bg-transparent min-h-screen font-sans transition-colors">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Inbox} label="Total Data" value={stats.total} total={stats.total} colorClass="bg-slate-50" darkColorClass="dark:bg-white/5" iconColor="text-slate-500 dark:text-slate-300" sparkline="M5 10 Q10 10 15 5 T25 12 T35 8" />
        <StatCard icon={Send} label="Baru" value={stats.baru} total={stats.total} colorClass="bg-blue-50" darkColorClass="dark:bg-blue-500/10" iconColor="text-blue-500 dark:text-blue-400" sparkline="M5 12 Q12 12 18 4 T28 10 T35 5" />
        <StatCard icon={CheckCircle2} label="Diproses (Lengkap)" value={stats.approved} total={stats.total} colorClass="bg-emerald-50" darkColorClass="dark:bg-emerald-500/10" iconColor="text-emerald-500 dark:text-emerald-400" sparkline="M5 8 Q10 8 15 12 T25 4 T35 8" />
        <StatCard icon={Wrench} label="Butuh Perbaikan" value={stats.fix} total={stats.total} colorClass="bg-amber-50" darkColorClass="dark:bg-amber-500/10" iconColor="text-amber-500 dark:text-amber-400" sparkline="M5 12 Q12 12 18 4 T28 10 T35 5" />
        <StatCard icon={XCircle} label="Ditolak" value={stats.ditolak} total={stats.total} colorClass="bg-red-50" darkColorClass="dark:bg-red-500/10" iconColor="text-red-500 dark:text-red-400" sparkline="M5 10 Q10 10 15 5 T25 12 T35 8" />
        <StatCard icon={FileText} label="SP2D" value={stats.sp2d} total={stats.total} colorClass="bg-teal-50" darkColorClass="dark:bg-teal-500/10" iconColor="text-teal-500 dark:text-teal-400" sparkline="M5 8 Q10 8 15 12 T25 4 T35 8" />
      </div>

      {/* 2. FILTER SECTION */}
      <div className="bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 flex flex-col lg:flex-row gap-4 items-end transition-colors">
        
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Cari Dokumen</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Ketik kata kunci pencarian..."
              value={filter.searchKey}
              onChange={(e) => handleFilterChange("searchKey", e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Unit Kerja Satker</label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <select
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer disabled:bg-slate-100 dark:disabled:bg-white/5"
              value={userData?.role === "user" ? userData?.biro_code : filter.kode_satker}
              disabled={userData?.role === "user"}
              onChange={(e) => handleFilterChange("kode_satker", e.target.value)}
            >
              <option value="" className="text-black dark:text-white">Semua Unit Kerja (Keseluruhan)</option>
              {userData?.role === "user"
                ? dataTable.filter((q) => q.kode_satker === userData?.biro_code).map((q) => (
                    <option key={q.kode_satker} value={q.kode_satker} className="text-black dark:text-white">{q.unit_satker}</option>
                  ))
                : dataTable.map((q) => (
                    <option key={q.kode_satker} value={q.kode_satker} className="text-black dark:text-white">{q.unit_satker}</option>
                  ))
              }
            </select>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (GRID LAYOUT: Table 7/12, Right Panel 5/12) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* KIRI: Tabel SPP Terbaru */}
        <div className="xl:col-span-7 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col h-full transition-colors">
          
          <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Daftar SPP Terbaru</h3>
            </div>
          </div>

          <div className="overflow-x-auto w-full flex-1 table-scroll">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-[#0D1627]/50 border-b border-slate-100 dark:border-white/10">
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Nomor SPP</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis SPP</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Tanggal Kirim</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jam</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pengirim</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {dataReceiptTable.length > 0 ? (
                  dataReceiptTable.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-700 dark:text-gray-200">{row.spp_number}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-gray-300 font-medium">{row.jenis_spp}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-gray-400">{row.created_at || "-"}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-gray-400">{row.time_at || "-"}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-gray-300 font-medium capitalize">{row.created_by || "-"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(row.status)}`}>
                          {row.status || "Baru"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-sm font-medium text-slate-400 dark:text-slate-500 text-center bg-slate-50/30 dark:bg-transparent">
                      Tidak ada data SPP terbaru ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/30 dark:bg-[#0D1627]/30">
             <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(value) => {
                  setRowsPerPage(Number(value)); 
                  setPage(0); 
                }}
              />
          </div> */}
        </div>

        {/* KANAN: Widgets */}
        <div className="xl:col-span-5 flex flex-col gap-4 h-full">
          <SummaryChart stats={statsNow} />
          <SppTypeMonthList statsArray={sppTypesBulanIni} />
        </div>

      </div>
    </div>
  );
}

export default MonitoringPage;