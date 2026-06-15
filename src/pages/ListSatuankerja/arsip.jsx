import React, { useContext, useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Paper from "@/components/Paper";
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
} from "lucide-react";
import FileInput from "@/components/FileInput";
import { validationSchema } from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import DatePickerInput from "@/components/DatePickerInput";
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

  // 2. STATE LOKAL UNTUK UI
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
      // Cuma balikin array kalau kodenya valid
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
    console.log(filter);
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
    console.log(selectedSatkerName);
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

  // =======================================================================
  // EFFECTS
  // =======================================================================
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
    // 1. Pastiin userData beneran udah keload dari Context
    if (userData && userData.role === "user") {
      // 2. Tangkep kodenya (antisipasi kalau biro_code null, lari ke access_code array)
      const userBiroCode =
        userData.biro_code || (userData.access_code && userData.access_code);
      const userBiroName = userData.name || "Biro Anda";

      // 3. Kalau dapet kodenya, dan filter masih kosong ATAU beda, paksa set!
      if (userBiroCode && filter.satker !== userBiroCode) {
        console.log("🔥 AUTO SET SATKER TEMBUS BOS!", userBiroCode); // <-- Pantau di console!

        setFilter((prev) => ({
          ...prev,
          satker: userBiroCode,
          satkerName: userBiroName,
        }));
      }
    }
  }, [userData, filter.satker, setFilter]);

  return (
    <div className="w-full h-full bg-slate-50/50 rounded-xl overflow-hidden flex flex-col">
      {/* STATE 1: EMPTY STATE */}
      {!isFiltered ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <FileSearch size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Data Arsip Belum Ditampilkan
          </h2>
          <p className="text-slate-500 max-w-md mb-8">
            Silakan pilih Tahun dan Satuan Kerja (Biro) terlebih dahulu untuk
            mulai melihat, mencari, atau mengelola dokumen arsip.
          </p>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-8 py-3 text-base shadow-md hover:shadow-lg transition-all"
            icon={<Filter size={20} />}
          >
            Pilih Kriteria Arsip
          </Button>
        </div>
      ) : (
        /* STATE 2: TABLE DATA */
        <Paper
          elevation={3}
          className="p-4 md:p-6 rounded-xl flex flex-col gap-6 shadow-md border border-gray-100 bg-white"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Menampilkan Data:
              </span>
              <span className="text-lg font-bold text-slate-800">
                {filter.satkerName}{" "}
                <span className="text-blue-600 font-black px-2">|</span>{" "}
                {filter.tahun}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Cari No SPP..."
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-[200px]"
                  value={filter.searchKey}
                  onChange={(e) =>
                    handleFilterChange("searchKey", e.target.value)
                  }
                />
              </div>
              <Button
                letiant="secondary"
                onClick={() => setIsFilterModalOpen(true)}
                className="shadow-sm bg-white"
                icon={<Filter size={18} />}
              >
                Ubah Filter
              </Button>
              {userData.role !== "user" && (
                <Button
                  onClick={() => {
                    setIsOpenModal(true);
                    setFormData((prev) => ({ ...prev, tahun: filter.tahun }));
                    setVariantModal("Add");
                  }}
                  className="shadow-sm"
                  letiant="danger"
                  icon={<Plus size={18} />}
                >
                  Tambah Arsip
                </Button>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm scrollbar-thin scrollbar-thumb-gray-300">
            <Table sx={{ minWidth: 650 }} aria-label="interactive data table">
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
                        style={{ cursor: col.sortable ? "pointer" : "default" }}
                      >
                        {col.sortable ? (
                          <TableSortLabel
                            active={sortBy === col.key}
                            direction={sortDir}
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
                    className="transition-all duration-200 hover:bg-blue-50/80 group border-b border-gray-100 last:border-none"
                  >
                    {columns
                      .filter((col) => !col.hiddenInArsip && !col.hiddenIfUser)
                      .map((col) => {
                        if (col.key == "spp_number")
                          return (
                            <TableCell key={col.key} align="center">
                              {row?.["no_spp"]}
                            </TableCell>
                          );
                        if (col.key === "created_at")
                          return (
                            <TableCell key={col.key} align="center">
                              {moment(row?.[col.key]).format("YYYY/MM/DD")}
                            </TableCell>
                          );
                        if (col.key === "revisi")
                          return (
                            <TableCell key={col.key} align="center">
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
                              style={{
                                color: themeColors.primary.light,
                                cursor:
                                  typeof docObj?.url === "string"
                                    ? "pointer"
                                    : "default",
                              }}
                            >
                              {typeof docObj?.url === "string"
                                ? `Lihat File`
                                : "-"}
                            </TableCell>
                          );
                        }

                        // if (col.key === "jml_hal") return <TableCell key={col.key} align="center">{row.jml_hal || "-"}</TableCell>;

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
                              className="flex flex-col gap-2 min-w-[120px]"
                            >
                              <div className="flex flex-row justify-center items-center gap-2">
                                <button
                                  title="Edit"
                                  className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-200"
                                  onClick={() => {
                                    // Panggil openEditModal dari Hook lu!
                                    openEditModal(row);
                                    setIsOpenModal(true);
                                    setVariantModal("Edit");
                                  }}
                                >
                                  <Edit2 size={16} />
                                </button>
                              </div>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={col.key} align="center">
                            {row[col.key] ?? "-"}
                          </TableCell>
                        );
                      })}
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
      )}

      {/* MODAL FILTER DATA */}
      <Modal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Data Arsip"
        width="500px"
        maxWidth="95vw"
        minWidth="0px"
      >
        <form onSubmit={handleApplyFilter} className="flex flex-col gap-4 p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              value={filter.satker} // KEMBALIKAN KE SINI BRO!
              onChange={(e) => handleFilterChange("satker", e.target.value)}
              options={satkerOptions}
              required
              disabled={userData?.role === "user"}
              isSearchable={userData?.role !== "user"}
            />
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <label className="text-[12px] text-slate-500 font-semibold px-1">
              Jenis Tanggal{" "}
              <span className="bg-red-400 text-white text-[9px] px-1.5 py-0.5 rounded ml-1 font-bold tracking-wider">
                OPSIONAL
              </span>
            </label>
            <div className="flex items-center gap-2 w-full [&_.react-datepicker-wrapper]:w-full">
              <DatePickerInput
                label=""
                placeholderText="Tanggal Awal"
                selected={filter.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                selectsStart
                startDate={filter.startDate}
                endDate={filter.endDate}
              />
              <span className="font-bold text-slate-400 text-xs">S.D</span>
              <DatePickerInput
                label=""
                placeholderText="Tanggal Akhir"
                selected={filter.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                selectsEnd
                startDate={filter.startDate}
                endDate={filter.endDate}
                minDate={filter.startDate}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleResetFilter}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-lg transition-colors"
            >
              <X size={16} strokeWidth={2.5} /> HAPUS ISIAN
            </button>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#7D8CEA] hover:bg-[#6A78D1] text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
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
        {/* PANGGIL handleSubmit DARI HOOK LU DI SINI */}
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
              <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col gap-4">
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
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-5 mt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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

          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-xl">
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-2.5 bg-[#308BFD] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/30 transition-all"
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
          <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-xl shadow-blue-200/50 flex flex-col items-center text-center max-w-sm w-full mx-4">
            <div className="relative text-[#308BFD] mb-2">
              {fileExtension === "gdrive" ? (
                <Link2 size={84} strokeWidth={1.5} />
              ) : (
                <Folder size={84} strokeWidth={1.5} />
              )}

              <span className="absolute bottom-1 right-0 bg-[#308BFD] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wider uppercase">
                {fileExtension === "gdrive" ? "G-DRIVE" : "ZIP/RAR"}
              </span>
            </div>

            <p className="mt-4 text-slate-600 font-medium">
              File SPP ber-format{" "}
              {fileExtension === "gdrive" ? "Link" : "Arsip"}
            </p>

            <p className="text-xs text-slate-400 mt-1 mb-6">
              Silakan {fileExtension === "gdrive" ? "buka" : "download"} untuk
              melihat isi file.
            </p>

            <button
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-[#59C6FF] to-[#308BFD] hover:from-[#49bbf5] hover:to-[#257be0] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
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
              {/* 4. Teks tombolnya otomatis nyesuain */}
              {fileExtension === "gdrive" ? "Buka Link" : "Download File"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Arsip;
