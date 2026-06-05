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

// Komponen yang sudah dipecah sebelumnya
import FilterSection from "./components/FilterSection";
import SatkerTable from "./components/SatkerTable";
import { useSatkerLogic } from "./hooks/useSatkerLogic"; 

import { isPengajuanPath } from "./satkerHooks"; // Sesuaikan path jika beda
import { validationSchema } from "@/services/GeneralHelper"; // Sesuaikan path

function ListSatuanKerjaPage() {
  // 1. Ambil SEMUA yang dibutuhkan dari custom hook
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
    openPengujianModal,
    openDetailModal,
    openPDFModal,
    // Modal states
    isOpenModal, setIsOpenModal,
    isOpenPDF, setIsOpenPDF,
    isCheckModal, setIsCheckModal,
    isDetailModal, setIsDetailModal,
    showModal, setShowModal,
    letiantModal, setVariantModal,
    // Form & Data states
    formData, setFormData,
    jenisFile, setJenisFile,
    pdfToOpen,
    types, questions, verifications,
    handleChange, handleSubmit,
    currentMenu
  } = useSatkerLogic();

  // 2. Local UI States untuk Dropdown (Hanya dipakai untuk tampilan modal)
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenJenis, setSelectOpenJenis] = useState(false);
  const [selectOpenStatus, setSelectOpenStatus] = useState(false);

  // 3. Helper Functions untuk Modal
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
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <Paper elevation={0} className="rounded-xl flex flex-col bg-white">
        
        {/* --- SECTION 1: FILTER (Menggunakan komponen terpisah) --- */}
        <FilterSection
          location={location}
          userData={userData}
          filter={filter}
          handleDateChange={handleDateChange}
          openAddModal={openAddModal}
        />

        {/* --- SECTION 2: TABLE (Menggunakan komponen terpisah) --- */}
        <div className="p-4 md:p-6">
          <SatkerTable
            columns={columns}
            dataTable={dataTable}
            location={location}
            userData={userData}
            handleSortChange={handleSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            openEditModal={openEditModal}
            openPengujianModal={openPengujianModal}
            openDetailModal={openDetailModal}
            openPDFModal={openPDFModal}
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
        </div>
      </Paper>


      {/* ========================================================= */}
      {/* KUMPULAN MODAL (Dikembalikan sesuai kode asli Anda)       */}
      {/* ========================================================= */}

      {/* 1. MODAL ADD / EDIT */}
      <Modal
        open={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setVariantModal("");
          setFormData({ no_spp: "", tahun: "", type: "", type_id: "", dokumen: null, uploaded_by: "", catatan: "" });
        }}
        title={isPengajuanPath(location.pathname) ? (letiantModal === "Add" ? "Form Pengajuan" : "Form Edit") : "Form Pengarsipan"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ padding: 10, width: "100%", display: "flex", flexDirection: "column", gap: 20, height: "450px", overflowY: "auto" }}
        >
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

          <Input
            label="Tahun"
            name="tahun"
            value={formData?.tahun}
            onChange={handleChange}
            validate={validationSchema.tahun}
            required
            placeholder="Masukkan tahun"
          />

          <Select
            label="Jenis SPP"
            name="type"
            onChange={(e) => setFormData((prev) => ({ ...prev, type_id: e.target.value }))}
            value={formData?.type_id}
            options={(types || []).map((q) => ({ label: q.type, value: q.type_id }))} 
            isOpen={selectOpen}
            setIsOpen={(open) => { if (open) setSelectOpenJenis(false); setSelectOpen(open); }}
          />

          {isPengajuanPath(location.pathname) && letiantModal === "Add" && (
            <Input label="Nama Pengirim" name="uploaded_by" value={formData?.uploaded_by} onChange={handleChange} validate={validationSchema.name} required placeholder="Masukkan Nama" />
          )}

          {!isPengajuanPath(location.pathname) && letiantModal === "Add" && (
            <Select
              label="Jenis File"
              name="jenis_file"
              value={jenisFile}
              onChange={(selected) => setJenisFile(selected.target.value)}
              options={[{ label: "File Upload", value: "file" }, { label: "Link Drive", value: "link" }]}
              isOpen={selectOpenJenis}
              setIsOpen={(open) => { if (open) setSelectOpen(false); setSelectOpenJenis(open); }}
            />
          )}

          {jenisFile === "link" && (
            <>
              <Input label="Link" name="link" value={formData.link} onChange={handleChange} validate={validationSchema.link} required placeholder="Masukkan Link" />
              <Input label="Jumlah halaman file" name="jml_hal" value={formData.jml_hal} onChange={handleChange} validate={validationSchema.onlyNumber} required placeholder="Masukkan Jumlah halaman file" />
            </>
          )}

          {jenisFile === "file" && (
            <FileInput accept={getAcceptedFileType()} label="Dokumen" name="dokumen" onChange={handleChange} required={letiantModal === "Add"} value={formData?.document} />
          )}

          {userData && !isPengajuanPath(location.pathname) && letiantModal === "Edit" && userData?.role !== "user" && (
            <>
              <FileInput accept=".pdf" label="Dokumen SPM" name="dokumen_spm" onChange={handleChange} value={formData?.document_spm} />
              <FileInput accept=".pdf" label="Dokumen SP2D" name="dokumen_sp2d" onChange={handleChange} value={formData?.document_sp2d} />
            </>
          )}

          {!isPengajuanPath(location.pathname) && userData?.role === "pic" && (
            <Textarea label="Catatan" name="catatan" value={formData?.catatan ?? formData?.feedback ?? ""} onChange={handleChange} />
          )}

          <Button type="submit" style={{ float: "right" }}>Submit</Button>
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
          <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", padding: 0 }}>
            <CustomPDFViewer pdfSource={pdfToOpen} />
          </div>
        ) : fileExtension === "gdrive" ? (
          <div className="flex flex-col items-center p-6 text-center">
            <p className="mb-4">File berupa link Google Drive</p>
            <a href={pdfToOpen} target="_blank" rel="noopener noreferrer" className="w-full">
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
        onClose={() => { setIsCheckModal(false); setVariantModal(""); }}
        title="Form Pengujian"
        width={fileExtension === "pdf" ? "95vw" : "80vw"}
        maxWidth="95vw"
        bodyStyle={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        <div style={{ maxHeight: "80vh", overflowY: "auto", padding: window.innerWidth <= 768 ? "2px" : "0 20px" }}>
          <div style={{ display: "flex", flexDirection: window.innerWidth <= 768 ? "column" : "row", gap: 20, width: "100%" }}>
            
            {/* Bagian Kiri (Dokumen) */}
            {fileExtension === "pdf" ? (
              <div style={{ width: window.innerWidth <= 768 ? "100%" : "50%", maxHeight: window.innerWidth <= 768 ? "45vh" : "100%", overflowY: "auto" }}>
                <CustomPDFViewer pdfSource={pdfToOpen} />
              </div>
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center p-6 border rounded-xl bg-gray-50">
                 <div className="text-center">
                    <Folder size={84} strokeWidth={1.5} className="text-blue-500 mx-auto" />
                    <p className="mt-4 font-semibold text-gray-700">File RAR / ZIP</p>
                    <Button onClick={() => window.open(pdfToOpen)} className="mt-4">Download untuk Cek</Button>
                 </div>
              </div>
            )}

            {/* Bagian Kanan (Form) */}
            <div style={{ width: window.innerWidth <= 768 ? "100%" : "50%" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, padding: 10 }}>
                <Input label="No. SPP" name="no_spp" value={formData?.no_spp} disabled />
                <Select
                  label="Jenis SPP"
                  name="type"
                  value={formData?.type_id}
                  disabled
                  options={(types || []).map((q) => ({ label: q.type, value: q.type_id }))}
                />
                <ChecklistComponent
                  title="Kelengkapan"
                  items={(questions || []).map((q) => ({ id: q.id_question, label: q.text }))}
                  selectedIds={formData.kelengkapan}
                  onChange={(updated) => setFormData((prev) => ({ ...prev, kelengkapan: updated }))}
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
                  items={(verifications || []).map((q) => ({ id: q.id_question, label: q.text }))}
                  selectedIds={formData?.verifikasi}
                  onChange={(updated) => setFormData((prev) => ({ ...prev, verifikasi: updated }))}
                  disabled={formData.status === "sp2d"}
                />
                <Textarea label="Catatan" name="catatan" value={formData?.catatan ?? formData?.feedback ?? ""} onChange={handleChange} />
                <Button type="submit" style={{ width: "100%" }}>Submit</Button>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      {/* 4. MODAL DETAIL */}
      <Modal
        open={isDetailModal}
        onClose={() => { setIsDetailModal(false); setVariantModal(""); }}
        title="Detail"
        style={{ maxWidth: "600px", width: "90vw" }}
      >
        <div style={{ padding: 20, maxHeight: "70vh", overflowY: "auto" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Input label="No. SPP" name="no_spp" value={formData?.no_spp} disabled />
            <Select label="Jenis SPP" name="type" value={formData?.type_id} disabled options={(types || []).map((q) => ({ label: q.type, value: q.type_id }))} />
            <Select label="Status" name="status" value={formData?.status} disabled options={[{ label: "Diproses", value: formData?.status }]} />
            
            <div>
              <label className="font-semibold text-gray-700">Kelengkapan</label>
              <ul className="mt-2 space-y-2">
                {(questions || []).map((q) => (
                  <li key={q.id_question} className="flex gap-2 items-center text-sm">
                    <input type="checkbox" checked={formData?.kelengkapan?.includes(q.id_question)} readOnly className="rounded text-blue-500" />
                    <span>{q.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Verifikasi</label>
              <ul className="mt-2 space-y-2">
                {(verifications || []).map((v) => (
                  <li key={v.id_question} className="flex gap-2 items-center text-sm">
                    <input type="checkbox" checked={formData?.verifikasi?.includes(v.id_question)} readOnly className="rounded text-blue-500" />
                    <span>{v.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Textarea label="Catatan" name="catatan" value={formData?.feedback ?? "-"} disabled />
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