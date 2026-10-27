import React, { useEffect, useState } from "react";

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
import { apiRequest } from "@/services/APIHelper";
import { CalendarDays, Folder, Clock } from "lucide-react";
import FilterSection from "./components/FilterSection";
import SatkerTable from "./components/SatkerTable";
import { useSatkerLogic } from "./hooks/useSatkerLogic";
import { isPengajuanPath, getCurrentSatuanKerja } from "./satkerHooks";
import { validationSchema } from "@/services/GeneralHelper";

function ListSatuanKerjaPage() {
  const {
    fetchTable,
    fetchType,
    fetchCategories,
    setCurrentMenu,
    kategoriOptions,
    statusPegawai,
    location,
    listMenu,
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
    handleStatusChange,
    handleSortChange,
    setPage,
    setRowsPerPage,
    openAddModal,
    openEditModal,
    openMergeModal,
    isOpenModal,
    setIsOpenModal,
    isOpenPDF,
    setIsOpenPDF,
    showModal,
    setShowModal,
    variantModal,
    setVariantModal,
    isOpenMergeModal,
    setIsOpenMergeModal,
    formData,
    setFormData,
    jenisFile,
    setJenisFile,
    pdfToOpen,
    types,
    handleChange,
    handleSubmit,
    currentMenu,
    handleMergeSubmit,
    setArchiveFile,
    isLoadingMerge,
    jumlahDiprosesPIC,
    jumlahPerluDiperbaiki,
    jumlahPerluDiperbaikiPAPIC,
    canAddSubmission,
    userSummaryNote,
  } = useSatkerLogic();

  const role = String(
    userData?.role ??
      userData?._role ??
      userData?.role_name ??
      userData?.user?.role ??
      ""
  )
    .trim()
    .toLowerCase();

  const isAllowedPendingModal = [
    "user",
    "pic",
    "admin",
    "pa pic",
  ].includes(role);

  useEffect(() => {
    if (isAllowedPendingModal) {
      setShowModal(true);
    }
  }, [isAllowedPendingModal, setShowModal]);

  const [pendingSummary, setPendingSummary] = useState({
    jumlahDiprosesPIC: 0,
    jumlahPerluDiperbaiki: 0,
    jumlahPerluDiperbaikiPAPIC: 0,
    canSubmitApprove: true,
    canSubmitFix: true,
    canSubmitTest: true,
    canAddSubmission: true,
    activeTab: "diproses",
    notePIC: "",
    noteUser: "",
  });

  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenJenis, setSelectOpenJenis] = useState(false);
  const [selectOpenStatus, setSelectOpenStatus] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showAllUpcomingEvents, setShowAllUpcomingEvents] = useState(false);
  const [searchUpcoming, setSearchUpcoming] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);

  const upcomingPerPage = 8;

  const filteredUpcomingEvents = upcomingEvents.filter((event) =>
    (event.note || "").toLowerCase().includes(searchUpcoming.toLowerCase())
  );

  const totalUpcomingPages = Math.ceil(
    filteredUpcomingEvents.length / upcomingPerPage
  );

  const paginatedUpcomingEvents = filteredUpcomingEvents.slice(
    (upcomingPage - 1) * upcomingPerPage,
    upcomingPage * upcomingPerPage
  );

  useEffect(() => {
    let isMounted = true;

    const fetchUpcomingEvents = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastDay = new Date(today);
        lastDay.setDate(today.getDate() + 6);

        const getMonthKey = (date) =>
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

        const months = [
          ...new Set([
            getMonthKey(today),
            getMonthKey(lastDay),
          ]),
        ];

        const responses = await Promise.all(
          months.map((month) =>
            apiRequest({
              url: `/calendar?month=${month}`,
            })
          )
        );

        const allEvents = responses.flatMap((response) =>
          response?.success && Array.isArray(response.data)
            ? response.data
            : []
        );

        const normalizedEvents = allEvents.map((event) => {
          const date = event.date ?? event._date ?? event._Date ?? "";
          const time = event.time ?? event._time ?? event.Time ?? "";
          const note =
            event.note ??
            event._note ??
            event._Note ??
            event.title ??
            event._title ??
            event._Title ??
            "";

          return {
            ...event,
            id: String(event.id ?? event._id ?? `${date}-${note}`),
            date,
            time,
            note,
          };
        });

        const filteredEvents = normalizedEvents
          .filter((event) => {
            if (!event.date) return false;

            const eventDate = new Date(`${event.date}T00:00:00`);

            return (
              !Number.isNaN(eventDate.getTime()) &&
              eventDate >= today &&
              eventDate <= lastDay
            );
          })
          .sort((a, b) => a.date.localeCompare(b.date));

        const uniqueEvents = Array.from(
          new Map(
            filteredEvents.map((event) => [
              `${event.date}-${event.note}`,
              event,
            ])
          ).values()
        );

        if (isMounted) {
          setUpcomingEvents(uniqueEvents);
        }
      } catch (error) {
        console.error("Gagal mengambil Upcoming Events:", error);

        if (isMounted) {
          setUpcomingEvents([]);
        }
      }
    };

    fetchUpcomingEvents();

    return () => {
      isMounted = false;
    };
  }, []);

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

  useEffect(() => {
    fetchTable();
    fetchType();
    fetchCategories();

    setCurrentMenu(
      getCurrentSatuanKerja(listMenu, location.pathname)
    );
  }, [
    filter.tahun,
    filter.searchKey,
    filter.status,
    filter.startDate,
    filter.endDate,
    page,
    rowsPerPage,
    sortBy,
    sortDir,
    listMenu,
    location.pathname,
  ]);

  const handleToggleKategori = (katId) => {
    setFormData((prev) => {
      const existing = prev.kategori_penerima || [];

      if (existing.includes(katId)) {
        return {
          ...prev,
          kategori_penerima: existing.filter((id) => id !== katId),
        };
      }

      return {
        ...prev,
        kategori_penerima: [...existing, katId],
      };
    });
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {/* SECTION 1: UPCOMING EVENTS COMPACT */}
      {upcomingEvents.length > 0 && (
        <section className="w-full mb-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-[#111C30]/80">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <CalendarDays size={18} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">
                  Upcoming Events
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Agenda 7 hari ke depan
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
              {upcomingEvents.slice(0, 4).map((event) => {
                const date = new Date(`${event.date}T00:00:00`);

                return (
                  <div
                    key={event.id}
                    className="flex min-w-[155px] items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2 py-1.5 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <span className="text-[9px] font-bold uppercase">
                        {date.toLocaleDateString("id-ID", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-sm font-extrabold leading-4">
                        {date.getDate()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                        {event.note || "Agenda"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {date.toLocaleDateString("id-ID", {
                          weekday: "short",
                        })}
                        {event.time && ` • ${event.time.slice(0, 5)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {upcomingEvents.length > 4 && (
              <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                +{upcomingEvents.length - 4} lainnya
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setShowAllUpcomingEvents(true);
                setUpcomingPage(1);
                setSearchUpcoming("");
              }}
              className="shrink-0 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              Lihat Semua
            </button>
          </div>
        </section>
      )}

      <Paper
        elevation={0}
        className="rounded-xl flex flex-col bg-white dark:!bg-transparent border border-gray-100 shadow-lg overflow-hidden"
      >
        <FilterSection
          location={location}
          userData={userData}
          filter={filter}
          handleDateChange={handleDateChange}
          handleStatusChange={handleStatusChange}
          openAddModal={openAddModal}
          openMergeModal={openMergeModal}
          jumlahPerluDiperbaikiPAPIC={
            pendingSummary.jumlahPerluDiperbaikiPAPIC
          }
          canAddSubmission={pendingSummary.canAddSubmission}
          userSummaryNote={pendingSummary.noteUser}
        />

        {/* SECTION 2: TABLE */}
        <SatkerTable
          columns={columns}
          dataTable={dataTable}
          location={location}
          userData={userData}
          handleSortChange={handleSortChange}
          sortBy={sortBy}
          sortDir={sortDir}
          openEditModal={openEditModal}
          jumlahDiprosesPIC={pendingSummary.jumlahDiprosesPIC}
          jumlahPerluDiperbaiki={pendingSummary.jumlahPerluDiperbaiki}
          jumlahPerluDiperbaikiPAPIC={
            pendingSummary.jumlahPerluDiperbaikiPAPIC
          }
          canSubmitTest={pendingSummary.canSubmitTest}
          canSubmitApprove={pendingSummary.canSubmitApprove}
          canSubmitFix={pendingSummary.canSubmitFix}
          activeTab={pendingSummary.activeTab}
          canAddSubmission={pendingSummary.canAddSubmission}
          picSummaryNote={pendingSummary.notePIC}
          userSummaryNote={pendingSummary.noteUser}
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
      {/* MODAL SEMUA UPCOMING EVENTS */}
      <Modal
        open={showAllUpcomingEvents}
        onClose={() => setShowAllUpcomingEvents(false)}
        title="Semua Upcoming Events"
        width="900px"
        maxWidth="95vw"
      >
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredUpcomingEvents.length} agenda dalam 7 hari ke depan
            </p>

            <input
              type="text"
              value={searchUpcoming}
              onChange={(e) => {
                setSearchUpcoming(e.target.value);
                setUpcomingPage(1);
              }}
              placeholder="Cari nama agenda..."
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 dark:border-white/10 dark:bg-[#111C30] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {paginatedUpcomingEvents.map((event) => {
              const date = new Date(`${event.date}T00:00:00`);

              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/10"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <span className="text-[10px] font-bold uppercase">
                      {date.toLocaleDateString("id-ID", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-extrabold leading-5">
                      {date.getDate()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-slate-800 dark:text-white">
                      {event.note || "Agenda"}
                    </p>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <p>
                        {date.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      {event.time && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                          <Clock size={14} />
                          {String(event.time).slice(0, 5)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {paginatedUpcomingEvents.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-slate-500">
                Agenda tidak ditemukan.
              </p>
            )}
          </div>

          {totalUpcomingPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
              <span className="text-xs text-slate-500">
                Halaman {upcomingPage} dari {totalUpcomingPages}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={upcomingPage === 1}
                  onClick={() => setUpcomingPage((page) => page - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40 dark:border-white/10"
                >
                  Sebelumnya
                </button>

                <button
                  type="button"
                  disabled={upcomingPage === totalUpcomingPages}
                  onClick={() => setUpcomingPage((page) => page + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40 dark:border-white/10"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

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
            kategori_penerima: [],
            status_pegawai: null,
          });
        }}
        title={
          isPengajuanPath(location.pathname)
            ? variantModal === "Add"
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
              name="type_id"
              onChange={(e) => {
                const selectedTypeId = e.target.value;
                const selectedType = (types || []).find(
                  (q) => q.type_id === selectedTypeId
                );

                setFormData((prev) => ({
                  ...prev,
                  type: selectedTypeId,
                  type_id: selectedTypeId,
                }));
              }}
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

            {statusPegawai && (
              <div className="relative flex items-center gap-6 p-4 pt-5 bg-transparent border border-slate-200 rounded-xl mt-1">
                <label className="absolute left-3 -top-2.5 px-1.5 bg-white dark:bg-[#0A111E] text-xs font-bold text-slate-500 dark:text-white z-10 pointer-events-none">
                  Jenis Pegawai <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700 dark:text-white">
                    <input
                      type="radio"
                      name="status_pegawai"
                      value="pns"
                      checked={formData.status_pegawai === "pns"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status_pegawai: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    PNS
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700 dark:text-white">
                    <input
                      type="radio"
                      name="status_pegawai"
                      value="pppk"
                      checked={formData.status_pegawai === "pppk"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status_pegawai: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    PPPK
                  </label>
                </div>
              </div>
            )}

            {/* Baris Kondisional: Kategori Penerima (Multi-Select) */}
            {kategoriOptions.length > 0 && (
              <div className="relative flex flex-col gap-2 p-4 pt-5 bg-transparent border border-slate-200 dark:border-white/10 rounded-xl mt-1">
                <label className="absolute left-3 -top-2.5 px-1.5 bg-white dark:bg-[#0A111E] text-xs font-bold text-slate-500 dark:text-white z-10 pointer-events-none">
                  Kategori Penerima (Bisa pilih lebih dari satu)
                  {formData.type_id !== "ls_bendahara" && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 mt-1">
                  {kategoriOptions.map((cat) => {
                    const isSelected = (
                      formData?.kategori_penerima || []
                    ).includes(cat.category_id);

                    return (
                      <button
                        key={cat.category_id}
                        type="button"
                        onClick={() => handleToggleKategori(cat.category_id)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all text-center ${
                          isSelected
                            ? "bg-blue-100 border-blue-500 text-blue-700 shadow-sm"
                            : "bg-white dark:bg-transparent border-slate-300 text-slate-600 dark:text-white hover:bg-slate-100"
                        }`}
                      >
                        {cat.category}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Baris 3: Nama Pengirim (Kondisional) */}
            {isPengajuanPath(location.pathname) && (
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

            {/* Baris 4: Jenis File (Kondisional) */}
            {!isPengajuanPath(location.pathname) && variantModal === "Add" && (
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
                  required={variantModal === "Add"}
                  value={formData?.document}
                />

                <p className="text-xs text-slate-500 dark:text-white font-medium italic ml-1">
                  * Maksimal 1,5 GB untuk jenis GUP & PTUP. Di luar jenis
                  tersebut maksimal 200 MB.
                </p>

                <p className="text-xs text-red-500 font-medium italic ml-1">
                  * Untuk file dibawah 50 MB Wajib berformat PDF.
                </p>
              </div>
            )}

            {/* Area Khusus Admin/PIC (SPM & SP2D) */}
            {userData &&
              !isPengajuanPath(location.pathname) &&
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
          <div className="px-5 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-transparent flex justify-end rounded-b-xl">
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-2.5 bg-[#308BFD] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/30 transition-all"
            >
              {variantModal === "Add"
                ? "Kirim Pengajuan"
                : "Simpan Perubahan"}
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

            <p className="mt-4 text-slate-600">
              File SPP ber-format (.rar)
            </p>

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

      {/* 3. MODAL MERGE PDF */}
      <Modal
        open={isOpenMergeModal}
        onClose={() => {
          setIsOpenMergeModal(false);
          setArchiveFile(null);
        }}
        title="Form Ekstrak & Gabung PDF"
      >
        <form
          onSubmit={handleMergeSubmit}
          className="flex flex-col w-full relative"
        >
          {/* BODY FORM (Scrollable) */}
          <div className="flex flex-col gap-5 p-5 max-h-[65vh] overflow-y-auto">
            {/* Banner Informasi / Panduan Penamaan */}
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl flex flex-col gap-2">
              <span className="text-sm font-bold text-blue-800">
                📌 Panduan Isi File ZIP/RAR
              </span>

              <p className="text-xs text-blue-700 leading-relaxed">
                Agar urutan halaman PDF tepat, <strong>wajib</strong> beri
                awalan angka pada nama file PDF di dalam kompresi Anda.
                <br />

                <span className="inline-block mt-1 font-medium bg-white px-2 py-1 rounded border border-blue-100">
                  Contoh: 1_Surat.pdf, 2_Lampiran.pdf, 3-Nota.pdf
                </span>
              </p>
            </div>

            {/* Input Upload ZIP/RAR */}
            <div className="mt-1">
              <FileInput
                accept=".zip,.rar,application/zip,application/x-rar-compressed"
                label="Unggah File (ZIP/RAR)"
                name="archive_file"
                onChange={(e) => setArchiveFile(e.target.files[0])}
                required={true}
              />

              <p className="text-xs text-slate-500 dark:text-white font-medium italic ml-1 mt-1.5">
                * Maksimal ukuran file kompresi 50 MB.
              </p>
            </div>
          </div>

          {/* FOOTER FORM (Action Button) */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-transparent flex justify-end gap-3 rounded-b-xl">
            <Button
              type="submit"
              disabled={isLoadingMerge}
              className="w-full md:w-auto px-8 py-2.5 bg-[#308BFD] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoadingMerge ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memproses...
                </>
              ) : (
                "Proses & Download"
              )}
            </Button>
          </div>
        </form>
      </Modal>
      {/* POPUP PENDING DOCUMENTS */}
      {/* POPUP PENDING DOCUMENTS */}
      {isAllowedPendingModal && (
        <PendingDocumentsModal
          open={showModal}
          onClose={() => setShowModal(false)}
          code={currentMenu?.code}
          onSummaryChange={(summary) => {
            setPendingSummary((prev) => ({
              ...prev,
              ...summary,
            }));
          }}
        />
      )}
    </div>
  );
}

export default ListSatuanKerjaPage;