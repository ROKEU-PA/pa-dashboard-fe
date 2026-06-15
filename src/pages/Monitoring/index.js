import React, { useContext, useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Paper from "@/components/Paper";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";
import TablePagination from "@/components/TablePagination";
import { buildQueryString } from "@/services/GeneralHelper";
import {
  statusColorClass,
  statusColorText,
  statusLabel,
} from "@/pages/ListSatuankerja/constants/styleConstants";
import { Search, Building2, Activity } from "lucide-react";

const StatCard = ({ label, value, color, textColor }) => (
  <div className={`relative p-5 rounded-2xl shadow-sm border border-slate-100 ${color} flex flex-col justify-center min-h-[110px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden group`}>
    
    {/* KUNCINYA DI SINI: Ubah text-[11px] jadi text-sm atau text-xs biar lebih lega */}
    <span className="text-slate-500 text-sm uppercase font-bold tracking-wide z-10">{label}</span>
    
    <span className={`text-3xl font-black mt-1.5 z-10 ${textColor}`}>{value}</span>
    
    {/* Aksen background di pojok kanan bawah biar ga sepi */}
    <Activity size={64} className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-800" />
  </div>
);

const columns = [
  { key: "kode_satker", label: "Kode Satker" },
  { key: "unit_satker", label: "Unit Kerja" },
  { key: "new", label: "Baru" },
  { key: "reject", label: "Revisi" },
  { key: "approved", label: "Telah Diuji" },
  { key: "sp2d", label: "SP2D" },
  { key: "total", label: "Total" },
  { key: "arsip", label: "Total Arsip" },
];

const columnsTT = [
  { key: "spp_number", label: "Nomor SPP" },
  { key: "jenis_spp", label: "Jenis SPP" },
  { key: "created_at", label: "Tanggal Pengiriman" },
  { key: "time_at", label: "Jam" },
  { key: "created_by", label: "Pengirim" },
  { key: "status", label: "Status" },
];

function MonitoringPage() {
  const { userData } = useContext(AppContext);
  const [dataTable, setDataTable] = useState([]);
  const [dataReceiptTable, setDataReceiptTable] = useState([]);
  const [filter, setFilter] = useState({
    tahun: "",
    kode_satker: "",
    searchKey: "",
    startDate: null,
    endDate: null,
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleDateChange = (key, value) => {
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
      if (data.success) {
        setDataTable(data.data);
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

  useEffect(() => {
    fetchCount();
    fetchReceipt();
  }, [
    filter.kode_satker,
    filter.searchKey,
    page,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
  ]);

  const stats = useMemo(() => {
    const sourceData = dataTable || [];
    const filteredSummary = sourceData.filter(item => {
      const itemSatker = item?.kode_satker?.toString() || "";
      const userSatker = userData?.biro_code?.toString() || "";
      const filterSatker = filter?.kode_satker?.toString() || "";

      return userData?.role === "user" 
        ? itemSatker === userSatker 
        : (filterSatker ? itemSatker === filterSatker : true);
    });

    const totals = filteredSummary.reduce((acc, curr) => {
      return {
        baru: acc.baru + (Number(curr.new) || 0),
        approved: acc.approved + (Number(curr.approved) || 0),
        fix: acc.fix + (Number(curr.reject) || 0), 
        sp2d: acc.sp2d + (Number(curr.sp2d) || 0),
        total: acc.total + (Number(curr.total) || 0),
      };
    }, { baru: 0, approved: 0, fix: 0, sp2d: 0, total: 0 });

    return { ...totals, reject: totals.fix };
  }, [dataTable, filter.kode_satker, userData]);

  return (  
    <div className="w-full flex flex-col gap-6">
      
      {/* 2. AREA STATISTIK */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Data" value={stats.total} color="bg-slate-50 border-slate-200" textColor="text-slate-700"/>
        <StatCard label="Baru" value={stats.baru} color={statusColorClass("default")} textColor={statusColorText("default")} />
        <StatCard label="Diproses (Lengkap)" value={stats.approved} color={statusColorClass("approved")} textColor={statusColorText("approved")} />
        <StatCard label="Butuh Perbaikan" value={stats.fix} color={statusColorClass("fix")} textColor={statusColorText("fix")} />
        <StatCard label="Ditolak" value={stats.reject} color={statusColorClass("reject")} textColor={statusColorText("reject")} />
        <StatCard label="SP2D" value={stats.sp2d} color={statusColorClass("sp2d")} textColor={statusColorText("sp2d")} />
      </div>

      <Paper className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* 3. AREA FILTER & SEARCH (Lebih clean dengan Icon) */}
        <div className="flex flex-col md:flex-row gap-4 p-5 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col gap-1.5 w-full md:w-1/2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cari Dokumen</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                placeholder="Ketik kata kunci pencarian..."
                value={filter.searchKey}
                onChange={(e) => handleDateChange("searchKey", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-1/2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Kerja Satker</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <select
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed appearance-none"
                value={userData?.role === "user" ? userData?.biro_code : filter.kode_satker}
                disabled={userData?.role === "user"}
                onChange={(e) => {
                  setPage(0); 
                  setFilter((prev) => ({ ...prev, kode_satker: e.target.value }));
                }}
              >
                <option value="">Semua Unit Kerja (Keseluruhan)</option>
                {userData?.role === "user"
                  ? dataTable
                      .filter((q) => q.kode_satker === userData?.biro_code)
                      .map((q) => (
                        <option key={q.kode_satker} value={q.kode_satker}>{q.unit_satker}</option>
                      ))
                  : dataTable.map((q) => (
                      <option key={q.kode_satker} value={q.kode_satker}>{q.unit_satker}</option>
                    ))
                }
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <Table className="w-full table-auto border-collapse min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                {columnsTT.map((col) => (
                  <TableCell
                    key={col.key}
                    align="center"
                    className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center whitespace-nowrap"
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 bg-white">
              {dataReceiptTable.length > 0 ? (
                dataReceiptTable.map((row, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/50 transition-colors duration-200 group">
                    {columnsTT.map((col) => (
                      <td key={col.key} className="px-4 py-3.5 text-sm text-slate-600 text-center whitespace-nowrap">
                        {col.key === "status" ? (
                          <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${statusColorClass(row[col.key])} ${statusColorText(row[col.key])}`}>
                            {statusLabel(row[col.key])}
                          </span>
                        ) : col.key === "spp_number" ? (
                          <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{row[col.key]}</span>
                        ) : (
                          row[col.key] ?? "-"
                        )}
                      </td>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={columnsTT.length} className="px-4 py-12 text-sm font-medium text-slate-400 text-center bg-slate-50/30">
                    Tidak ada data dokumen ditemukan
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Container */}
        <div className="border-t border-slate-100 p-2">
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
        </div>
      </Paper>
    </div>
  );
}

export default MonitoringPage;