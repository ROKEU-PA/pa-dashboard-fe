import React, { useContext, useEffect, useState,useMemo } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";
import TablePagination from "@/components/TablePagination";
import { buildQueryString } from "@/services/GeneralHelper";
import Input from "@/components/Input";
import Select from "@/components/Select";
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

function TandaTerimaPage() {
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
        setDataReceiptTable(result?.data);
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
    page + 1,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
  ]);
 const stats = useMemo(() => {
    // Kita ambil data dari dataTable (hasil fetchCount) karena ini merepresentasikan data DB
    const sourceData = dataTable || [];
    
    // Jika user adalah role 'user', kita filter hanya untuk biro mereka
    // Jika admin, kita filter berdasarkan select Unit Kerja (jika ada yang dipilih)
    const filteredSummary = sourceData.filter(item => {
      const itemSatker = item?.kode_satker?.toString() || "";
      const userSatker = userData?.biro_code?.toString() || "";
      const filterSatker = filter?.kode_satker?.toString() || "";

      return userData?.role === "user" 
        ? itemSatker === userSatker 
        : (filterSatker ? itemSatker === filterSatker : true);
    });

    // Menghitung total dengan menjumlahkan nilai dari properti masing-masing row di dataTable
    const totals = filteredSummary.reduce((acc, curr) => {
      return {
        baru: acc.baru + (Number(curr.new) || 0),
        approved: acc.approved + (Number(curr.approved) || 0),
        fix: acc.fix + (Number(curr.reject) || 0), // Di kolom Anda 'reject' dilabeli Revisi/Fix
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
      <Paper
        elevation={3}
      >
       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-20 p-5">
        {/* Search Input */}
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

        {/* Select Unit Kerja */}
        <div className="flex flex-col gap-1 ">
          <label className="text-sm font-medium text-gray-700">Unit Kerja</label>
          <select
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-blue-100 disabled:cursor-not-allowed"
            value={userData?.role === "user" ? userData?.biro_code : filter.kode_satker}
            disabled={userData?.role === "user"}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                kode_satker: e.target.value,
              }))
            }
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
        <div className="overflow-x-auto w-full border rounded-lg">
          <Table className="w-full text-left border-collapse min-w-[650px]">
            <TableHeader className="border-b">
              <TableRow>
                {columnsTT.map((col) => (
                  <TableCell
                    key={col.key}
                  className={`px-4 py-3 font-bold text-center  tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {dataReceiptTable.map((row, index) => (
                <TableRow key={index} className="hover:bg-blue-50 transition-colors">
                  {columnsTT.map((col) => (
                   <td key={col.key} className="px-6 py-4  text-center">
                      {col.key === "status" ? (
                        <span className={`px-3 py-1 rounded-full whitespace-nowrap border ${statusColorClass(row[col.key])} ${statusColorText(row[col.key])}`}>
                          {statusLabel(row[col.key])}
                        </span>
                      ) : (
                        row[col.key] ?? "-"
                      )}
                    </td>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setPage(0); 
          }}
        />
      </Paper>
    </div>
  );
}

export default TandaTerimaPage;
