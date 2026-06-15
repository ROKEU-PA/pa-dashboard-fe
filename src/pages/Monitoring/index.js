import React, { useContext, useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";
import TablePagination from "@/components/TablePagination";
import { buildQueryString } from "@/services/GeneralHelper";
import User from "@/components/User";
import {
  statusColorClass,
  statusColorText,
  statusLabel,
} from "@/pages/ListSatuankerja/constants/styleConstants";

const StatCard = ({ label, value, color, textColor }) => (
  <div className={`p-4 rounded-xl shadow-sm border-l-4 ${color} bg-white flex flex-col justify-center min-h-[100px]`}>
    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{label}</span>
    <span className={`text-2xl font-black mt-1 ${textColor}`}>{value}</span>
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
  const [selectOpen, setSelectOpen] = useState(false);
  const [units, setUnits] = useState([]);

  const handleDateChange = (key, value) => {
    setPage(0); // Reset ke halaman pertama setiap kali input search berubah
    setFilter((prev) => {
      const newFilter = { ...prev, [key]: value };
      if (
        key === "startDate" &&
        newFilter.endDate &&
        value > newFilter.endDate
      ) {
        newFilter.endDate = null;
      }

      return newFilter;
    });
  };

  const fetchCount = async () => {
    try {
      const data = await apiRequest({ url: `/archive/summary/status` });
      let result = data.data;
      if (data.success) {
        setDataTable(result);
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
        start_date: filter.startDate
          ? moment(filter.startDate).format("YYYY-MM-DD").toString()
          : "",
        end_date: filter.endDate
          ? moment(filter.endDate).format("YYYY-MM-DD").toString()
          : "",
      });
      const data = await apiRequest({
        url: `/archive/summary/receipt?${query}`,
      });
      let result = data.data;
      if (data.success) {
        setDataReceiptTable(result?.data || []);
        if (result?.last_page) {
          setTotalPages(result.last_page);
        } else if (result?.total) {
          const calculatedPages = Math.ceil(Number(result.total) / rowsPerPage);
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

    return {
      ...totals,
      reject: totals.fix, 
    };
  }, [dataTable, filter.kode_satker, userData]);

  return (  
    <div>
      <Paper elevation={3}>
         {/* Search */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-20 p-5">
        <div className="flex flex-col gap-1 ">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Cari..."
            value={filter.searchKey}
            onChange={(e) => handleDateChange("searchKey", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 ">
          <label className="text-sm font-medium text-gray-700">Unit Kerja</label>
          <select
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-blue-100 disabled:cursor-not-allowed"
            value={userData?.role === "user" ? userData?.biro_code : filter.kode_satker}
            disabled={userData?.role === "user"}
            onChange={(e) => {
              setPage(0); 
              setFilter((prev) => ({
                ...prev,
                kode_satker: e.target.value,
              }));
            }}
          >
            <option value="">Semua Unit Kerja</option>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 m-4">
        <StatCard label="Total Data" value={stats.total} color="border-gray-500 bg-white" textColor="text-gray-800" />
        <StatCard label="Baru" value={stats.baru} color={statusColorClass("default")} textColor={statusColorText("default")} />
        <StatCard label="Diproses (Lengkap)" value={stats.approved} color={statusColorClass("approved")} textColor={statusColorText("approved")} />
        <StatCard label="Butuh Perbaikan" value={stats.fix} color={statusColorClass("fix")} textColor={statusColorText("fix")} />
        <StatCard label="Ditolak" value={stats.reject} color={statusColorClass("reject")} textColor={statusColorText("reject")} />
        <StatCard label="SP2D" value={stats.sp2d} color={statusColorClass("sp2d")} textColor={statusColorText("sp2d")} />
      </div>

        <div className="overflow-x-auto w-full border border-gray-200 rounded-lg shadow-sm">
          <Table className="w-full table-auto border-collapse min-w-[650px]">
            <TableHeader>
              <TableRow >
                {columnsTT.map((col) => (
                  <TableCell
                    key={col.key}
                    align="center"
                    className={`px-4 py-3.5 text-[15px] font-bold text-center whitespace-nowrap tracking-wider transition-colors ${
                      col.sortable ? 'hover:bg-blue-600/20 cursor-pointer' : ''}`}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {dataReceiptTable.length > 0 ? (
                dataReceiptTable.map((row, index) => (
                  <TableRow key={index} className="hover:bg-blue-50 transition-colors">
                    {columnsTT.map((col) => (
                      <td key={col.key} className="px-4 py-4 text-sm text-gray-600 text-center whitespace-nowrap">
                        {col.key === "status" ? (
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${statusColorClass(row[col.key])} ${statusColorText(row[col.key])}`}>
                            {statusLabel(row[col.key])}
                          </span>
                        ) : (
                          row[col.key] ?? "-"
                        )}
                      </td>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={columnsTT.length} className="px-4 py-8 text-sm text-gray-400 text-center">
                    Tidak ada data untuk ditampilkan
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
      </Paper>
    </div>
  );
}

export default MonitoringPage;