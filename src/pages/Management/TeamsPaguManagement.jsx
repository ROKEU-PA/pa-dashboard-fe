/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Chip from "@/components/Chip";
import { toast } from "react-toastify";
import { apiRequest } from "@/services/APIHelper";
import { formatCurrency } from "@/services/GeneralHelper";
import {
  Search,
  Upload,
  Wallet,
  FileSpreadsheet,
  TrendingUp,
  PieChart,
  X,
  FileText
} from "lucide-react";
import moment from "moment";

const columns = [
  { key: "kode_akun", label: "Kode Akun" },
  { key: "nama_tim", label: "Tim" },
  { key: "uraian", label: "Uraian Kegiatan" },
  { key: "pagu", label: "Pagu Revisi" },
  { key: "realisasi", label: "Realisasi" },
  { key: "sisa", label: "Sisa Anggaran" },
  { key: "persentase", label: "Serapan" },
];

const timColors = {
  "tata usaha": { bg: "#eff6ff", text: "#2563eb" }, 
  "ptuk": { bg: "#fef3c7", text: "#d97706" }, 
  "pelaksanaan anggaran": { bg: "#ecfdf5", text: "#059669" }, 
  "akuntansi & pelaporan": { bg: "#f3e8ff", text: "#9333ea" }, 
  "barang milik negara": { bg: "#fff1f2", text: "#e11d48" }, 
  default: { bg: "#f8fafc", text: "#475569" },
};

export default function TeamsPaguManagementPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  
  const [summaryData, setSummaryData] = useState([]);

  const [searchKey, setSearchKey] = useState("");
  const [filterTim, setFilterTim] = useState("");
  const [filterPeriode, setFilterPeriode] = useState(moment().format("YYYY-MM"));

  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importForm, setImportForm] = useState({
    month: moment().format("M"),
    year: moment().format("YYYY"),
    file: null,
  });

  const [selectMonthOpen, setSelectMonthOpen] = useState(false);
  const [selectYearOpen, setSelectYearOpen] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: moment().month(i).format("MMMM"),
    value: String(i + 1),
  }));
  const years = Array.from({ length: 5 }, (_, i) => ({
    label: String(moment().year() + i - 2),
    value: String(moment().year() + i - 2),
  }));

  const fetchSummary = async () => {
    try {
      const res = await apiRequest({ url: `/user/pagu/summary?periode=${filterPeriode}` });
      if (res?.success) setSummaryData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      let url = `/user/pagu?page=${page + 1}&per_page=${rowsPerPage}&periode=${filterPeriode}`;
      if (searchKey) url += `&search=${searchKey}`;
      if (filterTim) url += `&tim=${filterTim}`;
      const res = await apiRequest({ url });
      
      if (res?.success) {
        setTableData(res.data.data);
        setTotalPage(res.data.last_page);
      }
    } catch (err) {
      toast.error("Gagal menarik data pagu");
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchKey, filterTim, filterPeriode]);

  useEffect(() => {
    fetchSummary();
  }, [filterPeriode]);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importForm.file) return toast.warning("Pilih file Excel terlebih dahulu!");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("excel", importForm.file);
    formData.append("month", importForm.month);
    formData.append("year", importForm.year);

    try {
      const res = await apiRequest({ 
        url: "/user/pagu/import", 
        method: "POST", 
        options: { body: formData },
        isMultiType: true 
      });
      
      if (res.success) {
        toast.success(`Berhasil memproses ${res.total_insert_updated} baris data!`);
        setIsOpenImport(false);
        setImportForm({ ...importForm, file: null });
        fetchData();
        fetchSummary();
      } else {
        toast.error(res.message || "Gagal mengimpor data.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan server saat mengimpor data.");
    } finally {
      setIsUploading(false);
    }
  };

  const getProgressColor = (percent) => {
    if (percent > 90) return "bg-rose-500";
    if (percent > 70) return "bg-amber-400";
    return "bg-emerald-500";
  };

  // Kalkulasi Summary Dinamis Berdasarkan Filter Tim
  const activeSummary = filterTim 
    ? summaryData.filter(item => item.kode_tim === filterTim)
    : summaryData;

  const grandPagu = activeSummary.reduce((acc, curr) => acc + (parseFloat(curr.total_pagu) || 0), 0);
  const grandRealisasi = activeSummary.reduce((acc, curr) => acc + (parseFloat(curr.total_realisasi) || 0), 0);
  const grandSisa = activeSummary.reduce((acc, curr) => acc + (parseFloat(curr.total_sisa) || 0), 0);

  return (
    <div className="w-full min-h-[80vh] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0A111E] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Pagu & Realisasi Tim
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Monitoring serapan anggaran RPD per Tim Biro Keuangan dan Barang Milik Negara.
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-auto relative z-10">
           <Input 
             type="month" 
             value={filterPeriode}
             onChange={(e) => setFilterPeriode(e.target.value)}
             className="w-full md:w-[200px]"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#0A111E] border border-slate-100 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl"><FileSpreadsheet size={28} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Pagu Revisi</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{formatCurrency(grandPagu)}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A111E] border border-slate-100 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl"><TrendingUp size={28} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Realisasi</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{formatCurrency(grandRealisasi)}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A111E] border border-slate-100 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl"><PieChart size={28} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Sisa Anggaran</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{formatCurrency(grandSisa)}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A111E] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 p-6 flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full md:w-auto ml-auto">
            
            <select 
              className="w-full sm:w-[200px] h-10 px-3 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 outline-none dark:text-white"
              value={filterTim}
              onChange={(e) => setFilterTim(e.target.value)}
            >
              <option value="">Semua Tim</option>
              <option value="21580002">Tata Usaha</option>
              <option value="21580003">PTUK</option>
              <option value="21580004">Pelaksanaan Anggaran</option>
              <option value="21580005">Akuntansi & Pelaporan</option>
              <option value="21580006">Barang Milik Negara</option>
            </select>

            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari kode/uraian..."
                className="w-full h-10 pl-9 pr-4 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setIsOpenImport(true);
                setImportForm({ ...importForm, file: null }); 
              }}
              className="w-full sm:w-auto whitespace-nowrap shadow-md shadow-emerald-500/20"
              style={{ backgroundColor: '#10b981', borderColor: '#10b981' }} 
              icon={<Upload size={18} strokeWidth={2.5} />}
            >
              Import Excel
            </Button>
          </div>
        </div>

        <div className="border border-slate-100 dark:border-white/10 rounded-2xl overflow-auto w-full relative max-h-[35vh] 2xl:max-h-[calc(85vh-380px)] custom-scrollbar">
          <Table sx={{ minWidth: 1000 }}>
            <TableHeader className="bg-slate-50 dark:bg-white/5">
              <TableRow>
                {columns.map((data) => (
                  <TableCell
                    component="th"
                    align={data.key === 'pagu' || data.key === 'realisasi' || data.key === 'sisa' ? 'right' : data.key === 'persentase' ? 'center' : 'left'}
                    key={data.key}
                    className="py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {data.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-white/5">
              
              {tableData?.length > 0 ? (
                tableData.map((row, index) => {
                  const percent = parseFloat(row.persentase) || 0;
                  const timStyle = timColors[row.nama_tim?.toLowerCase()] || timColors.default;

                  return (
                    <TableRow key={row._id || index} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <TableCell className="font-bold text-slate-700 dark:text-slate-200 text-xs whitespace-nowrap">
                        {row.kode_akun}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.nama_tim?.toUpperCase() || "UNKNOWN"}
                          style={{
                            backgroundColor: timStyle.bg,
                            color: timStyle.text,
                            fontWeight: "bold", fontSize: "11px",
                          }}
                        />
                      </TableCell>
                      <TableCell className="w-[300px] text-slate-600 dark:text-slate-400 text-xs font-medium">
                        {row.uraian}
                      </TableCell>
                      <TableCell align="right" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {formatCurrency(row.pagu)}
                      </TableCell>
                      <TableCell align="right" className="text-xs font-semibold text-emerald-600">
                        {formatCurrency(row.realisasi)}
                      </TableCell>
                      <TableCell align="right" className="text-xs font-bold text-rose-500">
                        {formatCurrency(row.sisa)}
                      </TableCell>
                      <TableCell align="center" className="w-[120px]">
                        <div className="flex flex-col gap-1.5 items-center">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{percent}%</span>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full ${getProgressColor(percent)}`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-10 text-slate-500 dark:text-slate-400">
                    Belum ada data pagu & realisasi untuk periode ini.
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </div>

        <TablePagination
          page={page}
          totalPages={totalPage}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(e)}
        />
      </div>

      <Modal
        open={isOpenImport}
        onClose={() => !isUploading && setIsOpenImport(false)}
        title="Import Data Pagu & Realisasi"
        maxWidth="600px"
      >
        <div className="p-5">
          <form onSubmit={handleImport} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-2 gap-4 relative z-20">
              <Select
                label="Bulan Data"
                name="month"
                value={importForm.month}
                onChange={(e) => setImportForm({...importForm, month: e.target.value})}
                options={months}
                isOpen={selectMonthOpen}
                setIsOpen={(open) => {
                  setSelectMonthOpen(open);
                  if (open) setSelectYearOpen(false);
                }}
                required
              />
              <Select
                label="Tahun Data"
                name="year"
                value={importForm.year}
                onChange={(e) => setImportForm({...importForm, year: e.target.value})}
                options={years}
                isOpen={selectYearOpen}
                setIsOpen={(open) => {
                  setSelectYearOpen(open);
                  if (open) setSelectMonthOpen(false);
                }}
                required
              />
            </div>

            <div className="w-full mt-2 relative z-10">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">File Laporan FA Detail (16 Segmen) <span className="text-rose-500">*</span></p>
              
              {!importForm.file ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3">
                      <Upload className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Klik atau tarik file .xlsx ke sini
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Format didukung: XLSX, XLS (Max 5MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx, .xls"
                    onChange={(e) => setImportForm({...importForm, file: e.target.files[0]})}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{importForm.file.name}</p>
                      <p className="text-xs text-slate-500">{(importForm.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setImportForm({...importForm, file: null})}
                    className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-white/10 mt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpenImport(false)} disabled={isUploading}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={isUploading}>
                {isUploading ? "Memproses Data..." : "Mulai Import"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}