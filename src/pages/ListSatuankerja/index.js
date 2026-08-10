import React, { useState } from "react";
import Paper from "@/components/Paper";
import TablePagination from "@/components/TablePagination";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Textarea from "@/components/TextArea";
import FileInput from "@/components/FileInput";
import Button from "@/components/Button";
import CustomPDFViewer from "@/components/PDFViewer";
import PendingDocumentsModal from "./pendingDocumentsModal";
import ChecklistComponent from "./components/ChecklistComponent";
import { Folder } from "lucide-react";

import FilterSection from "./components/FilterSection";
import SatkerTable from "./components/SatkerTable";
import { useSatkerLogic } from "./hooks/useSatkerLogic";

import { isPengajuanPath } from "./satkerHooks";
import { validationSchema } from "@/services/GeneralHelper";

function ListSatuanKerjaPage() {
  const {
    location,
    userData,
    filter,
    dataTable,
    columns,
    page,
    totalPages,
    rowsPerPage,
    sortBy,
    sortDir,
    handleDateChange,
    handleSortChange,
    setPage,
    setRowsPerPage,
    openAddModal,
    openEditModal,
    // Modal states
    isOpenModal,
    setIsOpenModal,
    isOpenPDF,
    setIsOpenPDF,
    isCheckModal,
    setIsCheckModal,
    isDetailModal,
    setIsDetailModal,
    showModal,
    setShowModal,
    letiantModal,
    setVariantModal,
    // Form & Data states
    formData,
    setFormData,
    jenisFile,
    setJenisFile,
    pdfToOpen,
    types,
    questions,
    verifications,
    handleChange,
    handleSubmit,
    currentMenu,
  } = useSatkerLogic();

  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenJenis, setSelectOpenJenis] = useState(false);
  const [selectOpenStatus, setSelectOpenStatus] = useState(false);

  const getAcceptedFileType = () => ".pdf,.PDF,.rar,.RAR,.zip,.ZIP";

  const getFileExtension = (url) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      const pathname = parsedUrl.pathname;
      if (
        hostname.includes("drive.google.com") ||
        hostname.includes("docs.google.com") ||
        hostname.includes("drive.googleusercontent.com")
      ) {
        return "gdrive";
      }
      const parts = pathname.split(".");
      if (parts.length > 1) {
        return parts.pop().toLowerCase();
      }
      return "";
    } catch {
      return "";
    }
  };

  const fileExtension = getFileExtension(pdfToOpen);

  return (
    <div className="w-full bg-white dark:!bg-transparent dark:border-none rounded-xl shadow-lg dark:shadow-none border border-gray-100 overflow-hidden flex flex-col">
      
      <Paper 
        elevation={0} 
        className="rounded-xl flex flex-col bg-white dark:!bg-transparent"
      >
        {/* --- SECTION 1: FILTER --- */}
        <FilterSection
          location={location}
          userData={userData}
          filter={filter}
          handleDateChange={handleDateChange}
          openAddModal={openAddModal}
        />

        {/* --- SECTION 2: TABLE --- */}
        <SatkerTable
          columns={columns}
          dataTable={dataTable}
          location={location}
          userData={userData}
          handleSortChange={handleSortChange}
          sortBy={sortBy}
          sortDir={sortDir}
          openEditModal={openEditModal}
        />

        <div className="mt-4">
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
      </Paper>

      {/* 1. MODAL ADD / EDIT */}
      <Modal
        open={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setVariantModal("");
          setFormData({
            no_spp: "",
            tahun: "",
            type: "",
            type_id: "",
            dokumen: null,
            uploaded_by: "",
            catatan: "",
          });
        }}
        title={
          isPengajuanPath(location.pathname)
            ? letiantModal === "Add"
              ? "Form Pengajuan"
              : "Form Edit"
            : "Form Pengarsipan"
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col w-full relative">
          {/* BODY FORM (Scrollable) */}
          <div className="flex flex-col gap-5 p-5 max-h-[65vh] overflow-y-auto">
            {/* Baris 1: No SPP & Tahun (Grid 70/30) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8">
                <Input
                  label="No. SPP"
                  name="no_spp"
                  value={formData?.no_spp}
                  onChange={handleChange}
                  required
                  validate={(val) => {
                    const onlyNumberError = validationSchema.onlyNumber(val);
                    if (onlyNumberError) return onlyNumberError;
                    const numbersppError = validationSchema.numberspp(val);
                    if (numbersppError) return numbersppError;
                    return "";
                  }}
                  placeholder="Masukkan nomor SPP"
                />
              </div>
              <div className="md:col-span-4">
                <Input
                  label="Tahun"
                  name="tahun"
                  value={formData?.tahun}
                  onChange={handleChange}
                  validate={validationSchema.tahun}
                  required
                  placeholder="Masukkan tahun"
                />
              </div>
            </div>

            {/* Baris 2: Jenis SPP */}
            <Select
              label="Jenis SPP"
              name="type"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type_id: e.target.value }))
              }
              value={formData?.type_id}
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

            {/* Baris 3: Nama Pengirim (Kondisional) */}
            {isPengajuanPath(location.pathname) && letiantModal === "Add" && (
              <Input
                label="Nama Pengirim"
                name="uploaded_by"
                value={formData?.uploaded_by}
                onChange={handleChange}
                validate={validationSchema.name}
                required
                placeholder="Masukkan Nama Lengkap"
              />
            )}

            {/* Baris 4: Jenis File (Kondisional) */}
            {!isPengajuanPath(location.pathname) && letiantModal === "Add" && (
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
            )}

            {/* Area Khusus Link Drive */}
            {jenisFile === "link" && (
              <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col gap-4">
                <Input
                  label="Link Dokumen"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  validate={validationSchema.link}
                  required
                  placeholder="https://drive.google.com/..."
                />
                <Input
                  label="Jumlah Halaman"
                  name="jml_hal"
                  value={formData.jml_hal}
                  onChange={handleChange}
                  validate={validationSchema.onlyNumber}
                  required
                  placeholder="Contoh: 15"
                />
              </div>
            )}

            {/* Area Khusus File Upload */}
            {jenisFile === "file" && (
              <div className="mt-1">
                <FileInput
                  accept={getAcceptedFileType()}
                  label="Dokumen SPP"
                  name="dokumen"
                  onChange={handleChange}
                  required={letiantModal === "Add"}
                  value={formData?.document}
                />
                <p className="text-xs text-slate-500 font-medium italic ml-1">
                  * Maksimal 1,5 GB untuk jenis GUP & PTUP. Di luar jenis tersebut maksimal 200 MB.
                </p>
              </div>
            )}

            {/* Area Khusus Admin/PIC (SPM & SP2D) */}
            {userData &&
              !isPengajuanPath(location.pathname) &&
              letiantModal === "Edit" &&
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

            {/* Area Catatan */}
            {!isPengajuanPath(location.pathname) &&
              userData?.role === "pic" && (
                <Textarea
                  label="Catatan / Feedback"
                  name="catatan"
                  value={formData?.catatan ?? formData?.feedback ?? ""}
                  onChange={handleChange}
                />
              )}
          </div>

          {/* FOOTER FORM (Action Button) */}
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-xl">
            <Button
              type="submit"
              // Jika Button Anda mendukung className, ini akan membuatnya tampil beda
              className="w-full md:w-auto px-8 py-2.5 bg-[#308BFD] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/30 transition-all"
            >
              {letiantModal === "Add" ? "Kirim Pengajuan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. MODAL PDF VIEWER / DOWNLOAD */}
      <Modal
        open={isOpenPDF}
        onClose={() => setIsOpenPDF(false)}
        title=""
        width={fileExtension === "pdf" ? "80vw" : "40vw"}
        maxWidth="95vw"
      >
        {fileExtension === "pdf" ? (
          <div
            style={{
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
              padding: 0,
            }}
          >
            <CustomPDFViewer pdfSource={pdfToOpen} />
          </div>
        ) : fileExtension === "gdrive" ? (
          <div className="flex flex-col items-center p-6 text-center">
            <p className="mb-4">File berupa link Google Drive</p>
            <a
              href={pdfToOpen}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button style={{ width: "100%" }}>Buka Link</Button>
            </a>
          </div>
        ) : (
          <div className="m-4 mx-auto bg-white border border-blue-100 rounded-2xl p-6 shadow-xl shadow-blue-200/50 flex flex-col items-center text-center">
            <div className="relative text-[#308BFD]">
              <Folder size={84} strokeWidth={1.5} />
              <span className="absolute bottom-1 right-0 bg-[#308BFD] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                RAR
              </span>
            </div>
            <p className="mt-4 text-slate-600">File SPP ber-format (.rar)</p>
            <Button
              className="mt-4 w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-[#59C6FF] to-[#308BFD] text-white font-bold rounded-xl"
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfToOpen;
                link.download = "";
                link.click();
              }}
            >
              Download File
            </Button>
          </div>
        )}
      </Modal>

      {/* 3. MODAL PENGUJIAN */}
      <Modal
        open={isCheckModal}
        onClose={() => {
          setIsCheckModal(false);
          setVariantModal("");
        }}
        title="Form Pengujian"
        width={fileExtension === "pdf" ? "95vw" : "80vw"}
        maxWidth="95vw"
        bodyStyle={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            padding: window.innerWidth <= 768 ? "2px" : "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth <= 768 ? "column" : "row",
              gap: 20,
              width: "100%",
            }}
          >
            {/* Bagian Kiri (Dokumen) */}
            {fileExtension === "pdf" ? (
              <div
                style={{
                  width: window.innerWidth <= 768 ? "100%" : "50%",
                  maxHeight: window.innerWidth <= 768 ? "45vh" : "100%",
                  overflowY: "auto",
                }}
              >
                <CustomPDFViewer pdfSource={pdfToOpen} />
              </div>
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center p-6 border rounded-xl bg-gray-50">
                <div className="text-center">
                  <Folder
                    size={84}
                    strokeWidth={1.5}
                    className="text-blue-500 mx-auto"
                  />
                  <p className="mt-4 font-semibold text-gray-700">
                    File RAR / ZIP
                  </p>
                  <Button
                    onClick={() => window.open(pdfToOpen)}
                    className="mt-4"
                  >
                    Download untuk Cek
                  </Button>
                </div>
              </div>
            )}

            {/* Bagian Kanan (Form) */}
            <div style={{ width: window.innerWidth <= 768 ? "100%" : "50%" }}>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  padding: 10,
                }}
              >
                <Input
                  label="No. SPP"
                  name="no_spp"
                  value={formData?.no_spp}
                  disabled
                />
                <Select
                  label="Jenis SPP"
                  name="type"
                  value={formData?.type_id}
                  disabled
                  options={(types || []).map((q) => ({
                    label: q.type,
                    value: q.type_id,
                  }))}
                />
                <ChecklistComponent
                  title="Kelengkapan"
                  items={(questions || []).map((q) => ({
                    id: q.id_question,
                    label: q.text,
                  }))}
                  selectedIds={formData.kelengkapan}
                  onChange={(updated) =>
                    setFormData((prev) => ({ ...prev, kelengkapan: updated }))
                  }
                  disabled={formData.status === "sp2d"}
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData?.status}
                  onChange={handleChange}
                  options={[
                    { label: "Ditolak", value: "reject" },
                    { label: "Diproses (Lengkap)", value: "approved" },
                    { label: "Diproses (Butuh Perbaikan)", value: "fix" },
                    { label: "SP2D", value: "sp2d" },
                  ]}
                  isOpen={selectOpenStatus}
                  setIsOpen={(open) => setSelectOpenStatus(open)}
                />
                <ChecklistComponent
                  title="Verifikasi"
                  items={(verifications || []).map((q) => ({
                    id: q.id_question,
                    label: q.text,
                  }))}
                  selectedIds={formData?.verifikasi}
                  onChange={(updated) =>
                    setFormData((prev) => ({ ...prev, verifikasi: updated }))
                  }
                  disabled={formData.status === "sp2d"}
                />
                <Textarea
                  label="Catatan"
                  name="catatan"
                  value={formData?.catatan ?? formData?.feedback ?? ""}
                  onChange={handleChange}
                />
                <Button type="submit" style={{ width: "100%" }}>
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      {/* 4. MODAL DETAIL */}
      <Modal
        open={isDetailModal}
        onClose={() => {
          setIsDetailModal(false);
          setVariantModal("");
        }}
        title="Detail"
        style={{ maxWidth: "600px", width: "90vw" }}
      >
        <div style={{ padding: 20, maxHeight: "70vh", overflowY: "auto" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Input
              label="No. SPP"
              name="no_spp"
              value={formData?.no_spp}
              disabled
            />
            <Select
              label="Jenis SPP"
              name="type"
              value={formData?.type_id}
              disabled
              options={(types || []).map((q) => ({
                label: q.type,
                value: q.type_id,
              }))}
            />
            <Select
              label="Status"
              name="status"
              value={formData?.status}
              disabled
              options={[{ label: "Diproses", value: formData?.status }]}
            />

            <div>
              <label className="font-semibold text-gray-700">Kelengkapan</label>
              <ul className="mt-2 space-y-2">
                {(questions || []).map((q) => (
                  <li
                    key={q.id_question}
                    className="flex gap-2 items-center text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData?.kelengkapan?.includes(q.id_question)}
                      readOnly
                      className="rounded text-blue-500"
                    />
                    <span>{q.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Verifikasi</label>
              <ul className="mt-2 space-y-2">
                {(verifications || []).map((v) => (
                  <li
                    key={v.id_question}
                    className="flex gap-2 items-center text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData?.verifikasi?.includes(v.id_question)}
                      readOnly
                      className="rounded text-blue-500"
                    />
                    <span>{v.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Textarea
              label="Catatan"
              name="catatan"
              value={formData?.feedback ?? "-"}
              disabled
            />
          </form>
        </div>
      </Modal>

      <PendingDocumentsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        code={currentMenu?.code}
      />
    </div>
  );
}

export default ListSatuanKerjaPage;
