import React, { useContext, useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
// Paper udah gak kita pakai, ganti div murni Tailwind biar support Dark Mode
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import {
  Plus,
  Filter,
  Search,
  FileSearch,
  X,
  Check,
  Edit2,
  Folder,
  Link2,
  Calendar,
} from "lucide-react";
import FileInput from "@/components/FileInput";
import { validationSchema } from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import CustomPDFViewer from "@/components/PDFViewer";
import themeColors from "@/constants/color";
import TableSortLabel from "@/components/TableSortLabel";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";
import { columns } from "@/pages/ListSatuankerja/satkerHooks";
import { useSatkerLogic } from "./hooks/useSatkerLogic";

function Arsip() {
  const { listMenu, userData } = useContext(AppContext);
  const {
    openEditModal,
    formData,
    setFormData,
    fetchTable,
    fetchType,
    dataTable,
    setFilter,
    pdfToOpen,
    setPDFtoOpen,
    filter,
    types,
    handleChange,
    handleSubmit,
  } = useSatkerLogic();

  // STATE LOKAL UNTUK UI
  const [isFiltered, setIsFiltered] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOpenPDF, setIsOpenPDF] = useState(false);
  const [variantModal, setVariantModal] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenJenis, setSelectOpenJenis] = useState(false);
  const [jenisFile, setJenisFile] = useState("file");

  const satkerOptions = useMemo(() => {
    if (userData?.role === "user") {
      const code =
        userData.biro_code || (userData.access_code && userData.access_code);
      if (code) {
        return [
          {
            label: userData.name || "Biro Anda",
            value: code,
          },
        ];
      }
      return [];
    }

    return (
      listMenu?.map((menu) => ({
        label: menu.name || menu.title,
        value: menu.code || menu.id,
      })) || []
    );
  }, [listMenu, userData]);

  const getFileExtension = (url) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      if (
        hostname.includes("drive.google.com") ||
        hostname.includes("docs.google.com")
      )
        return "gdrive";
      const parts = parsedUrl.pathname.split(".");
      if (parts.length > 1) return parts.pop().toLowerCase();
      return "";
    } catch {
      return "";
    }
  };

  const fileExtension = getFileExtension(pdfToOpen);

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const handleFilterChange = (key, value) => {
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

  const handleApplyFilter = (e) => {
    e.preventDefault();
    if (userData.role !== "user") {
      if (!filter.satker || !filter.tahun) {
        toast.error("Tahun dan Satuan Kerja wajib dipilih!");
        return;
      }
    } else {
      if (!filter.tahun) {
        toast.error("Tahun wajib dipilih!");
        return;
      }
    }
    const selectedSatkerName = satkerOptions.find(
      (s) => s.value === filter.satker,
    )?.label;
    setFilter((prev) => ({ ...prev, satkerName: selectedSatkerName }));
    setIsFiltered(true);
    setIsFilterModalOpen(false);
    setPage(0);
  };

  const handleResetFilter = () => {
    const isRegularUser = userData?.role === "user";

    setFilter({
      tahun: moment().year().toString(),
      satker:
        isRegularUser && satkerOptions.length > 0 ? satkerOptions.value : "",
      satkerName:
        isRegularUser && satkerOptions.length > 0 ? satkerOptions.label : "",
      searchKey: "",
      startDate: null,
      endDate: null,
    });
  };

  const getAcceptedFileType = () => ".pdf,.PDF,.rar,.RAR,.zip,.ZIP";

  useEffect(() => {
    if (isFiltered) fetchTable();
  }, [
    isFiltered,
    filter.tahun,
    filter.satker,
    filter.searchKey,
    filter.startDate,
    filter.endDate,
    page,
    rowsPerPage,
    sortBy,
    sortDir,
  ]);

  useEffect(() => {
    fetchType();
    if (!isFiltered) setIsFilterModalOpen(true);
  }, []);

  useEffect(() => {
    if (userData && userData.role === "user") {
      const userBiroCode =
        userData.biro_code || (userData.access_code && userData.access_code);
      const userBiroName = userData.name || "Biro Anda";

      if (userBiroCode && filter.satker !== userBiroCode) {
        setFilter((prev) => ({
          ...prev,
          satker: userBiroCode,
          satkerName: userBiroName,
        }));
      }
    }
  }, [userData, filter.satker, setFilter]);

  return (
    <div className="w-full h-full bg-slate-50/50 dark:bg-transparent rounded-xl overflow-hidden flex flex-col transition-colors">
      {/* STATE 1: EMPTY STATE */}
      {!isFiltered ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#111C30]/80 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md border border-slate-100 dark:border-white/10 min-h-[60vh] transition-colors">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
            <FileSearch size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Data Arsip Belum Ditampilkan
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
            Silakan pilih Tahun dan Satuan Kerja (Biro) terlebih dahulu untuk
            mulai melihat, mencari, atau mengelola dokumen arsip.
          </p>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-8 h-[42px] shadow-lg shadow-blue-500/30 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all"
            icon={<Filter size={18} strokeWidth={2.5} />}
          >
            Pilih Kriteria Arsip
          </Button>
        </div>
      ) : (
        /* STATE 2: TABLE DATA */
        <div className="flex flex-col gap-6">
          {/* HEADER FILTER & SEARCH */}
          <div className="bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/10 p-5 transition-colors flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Menampilkan Data:
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-white">
                {filter.satkerName}{" "}
                <span className="text-blue-500 font-black px-1.5 opacity-50">
                  |
                </span>{" "}
                {filter.tahun}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 w-full lg:w-auto">
              <div className="relative group w-full sm:w-auto">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Cari No SPP..."
                  className="w-full sm:w-[200px] pl-10 pr-4 py-2.5 h-[38px] bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filter.searchKey}
                  onChange={(e) =>
                    handleFilterChange("searchKey", e.target.value)
                  }
                />
              </div>

              <Button
                variant="custom"
                onClick={() => setIsFilterModalOpen(true)}
                className="w-full sm:w-fit px-4 h-[38px] bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
                icon={<Filter size={16} strokeWidth={2.5} />}
              >
                Ubah Filter
              </Button>

              {userData.role !== "user" && (
                <Button
                  variant="custom"
                  onClick={() => {
                    setIsOpenModal(true);
                    setFormData((prev) => ({ ...prev, tahun: filter.tahun }));
                    setVariantModal("Add");
                  }}
                  className="w-full sm:w-fit px-4 h-[38px] shadow-md shadow-blue-500/30 active:scale-95 transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  icon={<Plus size={16} strokeWidth={2.5} />}
                >
                  Tambah Arsip
                </Button>
              )}
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="w-full overflow-x-auto rounded-[20px] bg-white dark:bg-[#111C30]/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/10 transition-colors duration-300 table-scroll">
            <Table aria-label="interactive data table">
              <TableHeader>
                <TableRow>
                  {columns
                    .filter((col) => !col.hiddenInArsip && !col.hiddenIfUser)
                    .map((col) => (
                      <TableCell
                        key={col.key}
                        component="th"
                        align="center"
                        onClick={() =>
                          col.sortable && handleSortChange(col.key)
                        }
                        className={`py-4 px-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap transition-colors ${
                          col.sortable
                            ? "cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 select-none group"
                            : "cursor-default"
                        }`}
                      >
                        {col.sortable ? (
                          <TableSortLabel
                            active={sortBy === col.key}
                            direction={sortDir}
                            className="group-hover:text-blue-500 dark:group-hover:text-blue-400"
                          >
                            {col.label}
                          </TableSortLabel>
                        ) : (
                          col.label
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataTable.map((row, index) => (
                  <TableRow
                    key={index}
                    className="transition-colors duration-200 hover:bg-slate-50/80 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/10 last:border-none group"
                  >
                    {columns
                      .filter((col) => !col.hiddenInArsip && !col.hiddenIfUser)
                      .map((col) => {
                        if (col.key == "spp_number")
                          return (
                            <TableCell
                              key={col.key}
                              align="center"
                              className="py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-200 whitespace-nowrap"
                            >
                              {row?.["no_spp"]}
                            </TableCell>
                          );
                        if (col.key === "created_at")
                          return (
                            <TableCell
                              key={col.key}
                              align="center"
                              className="py-3.5 px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-300 whitespace-nowrap"
                            >
                              {moment(row?.[col.key]).format("YYYY/MM/DD")}
                            </TableCell>
                          );
                        if (col.key === "revisi")
                          return (
                            <TableCell
                              key={col.key}
                              align="center"
                              className="py-3.5 px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-300 whitespace-nowrap"
                            >
                              Revisi ke-{row?.[col.key]}
                            </TableCell>
                          );

                        if (
                          [
                            "document",
                            "document_spm",
                            "document_sp2d",
                          ].includes(col.key)
                        ) {
                          const docObj = row[col.key];
                          return (
                            <TableCell
                              key={col.key}
                              align="center"
                              onClick={() => {
                                if (typeof docObj?.url === "string") {
                                  setIsOpenPDF(true);
                                  setPDFtoOpen(docObj?.url);
                                }
                              }}
                              className={`py-3.5 px-4 text-xs sm:text-sm font-bold whitespace-nowrap ${
                                typeof docObj?.url === "string"
                                  ? "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                                  : "text-slate-400 dark:text-slate-600"
                              }`}
                            >
                              {typeof docObj?.url === "string"
                                ? `Lihat File`
                                : "-"}
                            </TableCell>
                          );
                        }

                        const role = userData?.role;
                        const isAdminRole = [
                          "admin",
                          "pic",
                          "super_admin",
                          "superadmin",
                        ].includes(role);
                        if (isAdminRole && col.key === "action") {
                          return (
                            <TableCell
                              key={col.key}
                              align="center"
                              className="py-3.5 px-4"
                            >
                              <div className="flex flex-row justify-center items-center gap-2">
                                <button
                                  title="Edit"
                                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200 border border-blue-200 dark:border-blue-500/20 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                  onClick={() => {
                                    openEditModal(row);
                                    setIsOpenModal(true);
                                    setVariantModal("Edit");
                                  }}
                                >
                                  <Edit2 size={16} strokeWidth={2.5} />
                                </button>
                              </div>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={col.key}
                            align="center"
                            className="py-3.5 px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-300 whitespace-nowrap"
                          >
                            {row[col.key] ?? "-"}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Container disesuaikan */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/30 dark:bg-[#0D1627]/30">
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
            </div>
          </div>
        </div>
      )}

      {/* MODAL FILTER DATA (UDAH DI-UPGRADE NATIVE DATE!) */}
      <Modal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Data Arsip"
        width="500px"
        maxWidth="95vw"
        minWidth="0px"
      >
        <form onSubmit={handleApplyFilter} className="flex flex-col gap-4 p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tahun"
              name="tahun"
              value={filter.tahun}
              onChange={(e) => handleFilterChange("tahun", e.target.value)}
              options={[
                { label: "2026", value: "2026" },
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
                { label: "2022", value: "2022" },
                { label: "2021", value: "2021" },
                { label: "2020", value: "2020" },
                { label: "2019", value: "2019" },
              ]}
              required
            />
            <Select
              label="Satuan Kerja (Biro)"
              name="satker"
              value={filter.satker}
              onChange={(e) => handleFilterChange("satker", e.target.value)}
              options={satkerOptions}
              required
              disabled={userData?.role === "user"}
              isSearchable={userData?.role !== "user"}
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[11px] text-slate-500 dark:text-slate-400 font-bold px-1 uppercase tracking-wider">
              Tanggal{" "}
              <span className="bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-300 text-[9px] px-1.5 py-0.5 rounded ml-1 font-bold tracking-wider">
                OPSIONAL
              </span>
            </label>

            {/* DATE PICKER NATIVE MURNI (ANTI NGE-BUG) */}
            <div className="flex items-center bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl h-[42px] px-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all group overflow-hidden">
              <Calendar
                className="text-slate-400 group-focus-within:text-blue-500 transition-colors shrink-0 mr-2"
                size={16}
                strokeWidth={2.5}
              />

              <input
                type="date"
                className="bg-transparent border-none focus:ring-0 outline-none text-sm font-semibold text-slate-700 dark:text-white cursor-pointer [color-scheme:light] dark:[color-scheme:dark] w-full p-0"
                value={filter.startDate || ""}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />

              <span className="text-slate-300 dark:text-slate-600 mx-2 font-bold">
                -
              </span>

              <input
                type="date"
                className="bg-transparent border-none focus:ring-0 outline-none text-sm font-semibold text-slate-700 dark:text-white cursor-pointer [color-scheme:light] dark:[color-scheme:dark] w-full p-0"
                value={filter.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 border-t border-slate-100 dark:border-white/5 pt-5">
            <button
              type="button"
              onClick={handleResetFilter}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl transition-colors"
            >
              <X size={16} strokeWidth={2.5} /> HAPUS ISIAN
            </button>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/30 active:scale-95"
            >
              <Check size={16} strokeWidth={2.5} /> KIRIM
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL FORM ADD/EDIT */}
      <Modal
        open={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setVariantModal("");
          setFormData({});
        }}
        title={variantModal === "Add" ? "Form Pengarsipan" : "Form Edit"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col w-full relative">
          <div className="flex flex-col gap-5 p-5 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8">
                <Input
                  label="No. SPP"
                  name="no_spp"
                  value={formData?.no_spp || ""}
                  onChange={handleChange}
                  required
                  validate={(val) =>
                    validationSchema.onlyNumber(val) ||
                    validationSchema.numberspp(val) ||
                    ""
                  }
                  placeholder="Masukkan nomor SPP"
                />
              </div>
              <div className="md:col-span-4">
                <Input
                  label="Tahun"
                  name="tahun"
                  value={formData?.tahun || ""}
                  onChange={handleChange}
                  validate={validationSchema.tahun}
                  required
                  placeholder="Masukkan tahun"
                />
              </div>
            </div>

            <Select
              label="Jenis SPP"
              name="type"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type_id: e.target.value }))
              }
              value={formData?.type_id || ""}
              options={(types || []).map((q) => ({
                label: q.type,
                value: q.type_id,
              }))}
              isOpen={selectOpen}
              setIsOpen={(open) => {
                if (open) setSelectOpenJenis(false);
                setSelectOpen(open);
              }}
              isSearchable={true}
            />

            {variantModal === "Add" && (
              <Input
                label="Nama Pengirim"
                name="uploaded_by"
                value={formData?.uploaded_by || ""}
                onChange={handleChange}
                validate={validationSchema.name}
                required
                placeholder="Masukkan Nama Lengkap"
              />
            )}

            <Select
              label="Jenis File"
              name="jenis_file"
              value={jenisFile}
              onChange={(selected) => setJenisFile(selected.target.value)}
              options={[
                { label: "File Upload (PDF/RAR)", value: "file" },
                { label: "Link Google Drive", value: "link" },
              ]}
              isOpen={selectOpenJenis}
              setIsOpen={(open) => {
                if (open) setSelectOpen(false);
                setSelectOpenJenis(open);
              }}
            />

            {jenisFile === "link" && (
              <div className="p-5 bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex flex-col gap-4 transition-colors">
                <Input
                  label="Link Dokumen"
                  name="link"
                  value={formData?.link || ""}
                  onChange={handleChange}
                  validate={validationSchema.link}
                  required
                  placeholder="https://drive.google.com/..."
                />
                <Input
                  label="Jumlah Halaman"
                  name="jml_hal"
                  value={formData?.jml_hal || ""}
                  onChange={handleChange}
                  validate={validationSchema.onlyNumber}
                  required
                  placeholder="Contoh: 15"
                />
              </div>
            )}

            {jenisFile === "file" && (
              <div className="mt-1">
                <FileInput
                  accept={getAcceptedFileType()}
                  label="Dokumen SPP"
                  name="dokumen"
                  onChange={handleChange}
                  required={variantModal === "Add"}
                  value={formData?.document}
                />
              </div>
            )}

            {userData &&
              variantModal === "Edit" &&
              userData?.role !== "user" && (
                <div className="p-5 bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl flex flex-col gap-5 mt-2 transition-colors">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Dokumen Pendukung Tambahan
                  </span>
                  <FileInput
                    accept=".pdf"
                    label="Dokumen SPM"
                    name="dokumen_spm"
                    onChange={handleChange}
                    value={formData?.document_spm}
                  />
                  <FileInput
                    accept=".pdf"
                    label="Dokumen SP2D"
                    name="dokumen_sp2d"
                    onChange={handleChange}
                    value={formData?.document_sp2d}
                  />
                </div>
              )}
          </div>

          <div className="px-5 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0D1627] flex justify-end rounded-b-[20px] transition-colors">
            <Button
              variant="custom"
              type="submit"
              className="w-full md:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-500/30 active:scale-95 transition-all"
            >
              {variantModal === "Add" ? "Kirim Pengajuan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL VIEWER PDF */}
      <Modal
        open={isOpenPDF}
        onClose={() => setIsOpenPDF(false)}
        title="File Dokumen SPP"
        width={fileExtension === "pdf" ? "800px" : "450px"}
        maxWidth="100vw"
        minWidth="0px"
      >
        {fileExtension === "pdf" ? (
          <div
            style={{
              maxHeight: "calc(100vh - 250px)",
              overflowY: "auto",
              padding: 0,
            }}
          >
            <CustomPDFViewer pdfSource={pdfToOpen} />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0A111E] border border-blue-100 dark:border-blue-500/20 rounded-2xl p-8 shadow-xl shadow-blue-200/50 dark:shadow-none flex flex-col items-center text-center max-w-sm w-full mx-auto my-4 transition-colors">
            <div className="relative text-blue-500 mb-2">
              {fileExtension === "gdrive" ? (
                <Link2 size={84} strokeWidth={1.5} />
              ) : (
                <Folder size={84} strokeWidth={1.5} />
              )}

              <span className="absolute bottom-1 right-0 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wider uppercase">
                {fileExtension === "gdrive" ? "G-DRIVE" : "ZIP/RAR"}
              </span>
            </div>

            <p className="mt-4 text-slate-700 dark:text-white font-bold">
              File SPP ber-format{" "}
              {fileExtension === "gdrive" ? "Link" : "Arsip"}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Silakan {fileExtension === "gdrive" ? "buka" : "download"} untuk
              melihat isi file.
            </p>

            <button
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
              onClick={() => {
                if (fileExtension === "gdrive") {
                  window.open(pdfToOpen, "_blank", "noopener,noreferrer");
                } else {
                  const link = document.createElement("a");
                  link.href = pdfToOpen;
                  link.download = "";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              {fileExtension === "gdrive" ? "Buka Link" : "Download File"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Arsip;
