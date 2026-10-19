import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  Info,
  ExternalLink,
  Trash2,
  Pencil,
  ChevronDown,
  LoaderCircle,
  X,
  Save,
  Plus,
  Clock,
  ClipboardList,
} from "lucide-react";

import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";

const LLAT_URL =
  "https://drive.google.com/file/d/12eRq9wcN4wNVJVFFLeJA3ti1bZSSiOVo/view?usp=sharing";

const NOTE_COLORS = [
  { background: "#DBEAFE", border: "#60A5FA" },
  { background: "#D1FAE5", border: "#34D399" },
  { background: "#FEF3C7", border: "#FBBF24" },
  { background: "#FCE7F3", border: "#F472B6" },
  { background: "#EDE9FE", border: "#A78BFA" },
];

const DEFAULT_COLOR = NOTE_COLORS[0].background;

const CALENDAR_CSS = `
.calendar-modern .fc {
  --fc-border-color: #e2e8f0;
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: #f8fafc;
  --fc-today-bg-color: #eff6ff;
  font-family: inherit;
}
.calendar-modern .fc .fc-toolbar {
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 1.25rem !important;
}
.calendar-modern .fc .fc-toolbar-title {
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 800;
}
.calendar-modern .fc .fc-button {
  min-height: 36px;
  padding: .45rem .75rem !important;
  border: 1px solid #dbeafe !important;
  border-radius: 9px !important;
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  box-shadow: none !important;
  font-size: .8rem !important;
  font-weight: 700 !important;
}
.calendar-modern .fc .fc-button:hover {
  background: #dbeafe !important;
}
.calendar-modern .fc .fc-button-primary:not(:disabled).fc-button-active,
.calendar-modern .fc .fc-today-button {
  background: #2563eb !important;
  border-color: #2563eb !important;
  color: white !important;
}
.calendar-modern .fc .fc-scrollgrid {
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px;
  overflow: hidden;
}
.calendar-modern .fc .fc-theme-standard td,
.calendar-modern .fc .fc-theme-standard th {
  border-color: #e8edf5 !important;
}
.calendar-modern .fc .fc-col-header-cell {
  padding: 10px 4px !important;
  background: #f8fafc;
}
.calendar-modern .fc .fc-col-header-cell-cushion {
  color: #64748b;
  font-size: .7rem;
  font-weight: 800;
  text-decoration: none !important;
  text-transform: uppercase;
}
.calendar-modern .fc .fc-daygrid-day {
  cursor: pointer;
}
.calendar-modern .fc .fc-daygrid-day-frame {
  min-height: 90px;
}
.calendar-modern .fc .fc-daygrid-day-number {
  padding: 8px !important;
  color: #475569;
  font-size: .8rem;
  font-weight: 700;
  text-decoration: none !important;
}
.calendar-modern .fc .fc-day-today {
  background: #eff6ff !important;
}
.calendar-modern .fc .fc-day-today .fc-daygrid-day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
  margin: 3px;
  border-radius: 8px;
  background: #2563eb;
  color: white !important;
}
.calendar-modern .fc .fc-col-header-cell.fc-day-sun {
  background: #fff1f2;
}
.calendar-modern .fc .fc-col-header-cell.fc-day-sun .fc-col-header-cell-cushion,
.calendar-modern .fc .fc-day-sun .fc-daygrid-day-number {
  color: #e11d48 !important;
}
.calendar-modern .fc td.fc-day-sun {
  background: #fffafa;
}
.calendar-modern .fc .fc-event {
  margin: 2px 3px !important;
  padding: 3px 5px !important;
  border-radius: 5px !important;
  border-left-width: 3px !important;
  font-size: .7rem !important;
  font-weight: 700 !important;
  cursor: pointer;
}
.calendar-modern .fc .fc-event-title {
  white-space: normal;
  overflow-wrap: anywhere;
}
.calendar-modern .fc .fc-daygrid-more-link {
  color: #2563eb;
  font-size: .7rem;
  font-weight: 800;
}
.dark .calendar-modern .fc {
  --fc-border-color: #334155;
  --fc-neutral-bg-color: #1e293b;
  --fc-today-bg-color: rgba(37,99,235,.18);
  color: #e2e8f0;
}
.dark .calendar-modern .fc .fc-toolbar-title {
  color: #f1f5f9 !important;
}
.dark .calendar-modern .fc .fc-scrollgrid,
.dark .calendar-modern .fc .fc-theme-standard td,
.dark .calendar-modern .fc .fc-theme-standard th {
  border-color: #334155 !important;
}
.dark .calendar-modern .fc .fc-col-header-cell {
  background: #1e293b;
}
.dark .calendar-modern .fc .fc-col-header-cell-cushion,
.dark .calendar-modern .fc .fc-daygrid-day-number {
  color: #cbd5e1;
}
.dark .calendar-modern .fc .fc-daygrid-day:hover {
  background: #1e293b;
}
.dark .calendar-modern .fc .fc-day-today {
  background: rgba(37,99,235,.18) !important;
}
.dark .calendar-modern .fc .fc-button {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #cbd5e1 !important;
}
.dark .calendar-modern .fc .fc-button-primary:not(:disabled).fc-button-active,
.dark .calendar-modern .fc .fc-today-button {
  background: #2563eb !important;
  color: white !important;
}
@media(max-width:640px) {
  .calendar-modern .fc .fc-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .calendar-modern .fc .fc-toolbar-title {
    font-size: 1.05rem !important;
  }
  .calendar-modern .fc .fc-button {
    min-height: 34px;
    padding: .4rem .55rem !important;
    font-size: .72rem !important;
  }
  .calendar-modern .fc .fc-daygrid-day-frame {
    min-height: 60px;
  }
  .calendar-modern .fc .fc-daygrid-day-number {
    padding: 5px !important;
    font-size: .72rem;
  }
}
`;

const getCurrentMonth = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
};

const normalizeNote = (item = {}) => ({
  ...item,
  id: item.id ?? item._id ?? "",
  date: item.date ?? item._date ?? "",
  time: item.time ?? item._time ?? "",
  note: item.note ?? item._note ?? item.title ?? "",
  color: item.color ?? item._color ?? DEFAULT_COLOR,
});

const getErrorMessage = (error) =>
  error?.message || "Terjadi kesalahan pada request.";

export default function CalendarPage() {
  const { userData } = useContext(AppContext);

  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  const [newNote, setNewNote] = useState("");
  const [newTime, setNewTime] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
    note: "",
    color: DEFAULT_COLOR,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelectedAgenda, setShowSelectedAgenda] = useState(true);
  const [showMonthlyRecap, setShowMonthlyRecap] = useState(false);

  const role = String(
    userData?.role ?? userData?._role ?? userData?.user_role ?? ""
  ).toLowerCase();

  const isAdminOrPIC = ["admin", "pic"].includes(role);

  const inputClass =
    "box-border w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

  /*
   * APIHelper.js tetap tidak diubah.
   * Token diambil dari sessionStorage dan diteruskan ke apiRequest.
   */
  const getAccessToken = () => {
    try {
      const auth = JSON.parse(
        sessionStorage.getItem("auth") || "null"
      );

      return auth?.accessToken || null;
    } catch (error) {
      console.error("Gagal membaca token:", error);
      return null;
    }
  };

  const ensureToken = () => {
    const token = getAccessToken();

    if (!token) {
      alert("Token login tidak ditemukan. Silakan login kembali.");
      return null;
    }

    return token;
  };

  // GET /api/calendar
  const fetchNotes = async () => {
    const token = ensureToken();

    if (!token) return;

    setIsLoading(true);

    try {
      const response = await apiRequest({
        url: "/calendar",
        method: "GET",
        token,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Gagal mengambil agenda."
        );
      }

      const rows = Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];

      setEvents(rows.map(normalizeNote));
    } catch (error) {
      console.error("GET Calendar error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data hari libur nasional
  useEffect(() => {
    let mounted = true;

    const fetchHolidays = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/guangrei/APIHariLibur_V2/main/holidays.json"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data hari libur.");
        }

        const data = await response.json();

        const holidayEvents = Object.keys(data).map((date) => ({
          id: `holiday-${date}`,
          title: data[date]?.summary || "National Holiday",
          start: date,
          allDay: true,
          backgroundColor: "#FEE2E2",
          borderColor: "#FCA5A5",
          textColor: "#DC2626",
          extendedProps: {
            isHoliday: true,
            date,
          },
        }));

        if (mounted) setHolidays(holidayEvents);
      } catch (error) {
        console.error("Holiday API error:", error);
      }
    };

    fetchHolidays();

    return () => {
      mounted = false;
    };
  }, []);

  const getBorderColor = (color) =>
    NOTE_COLORS.find((item) => item.background === color)?.border ||
    "#93C5FD";

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatMonth = (monthString) => {
    if (!monthString) return "";

    const [year, month] = monthString.split("-").map(Number);

    return new Date(year, month - 1, 1).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowSelectedAgenda(true);
  };

  const handleDatesSet = (info) => {
    const date = new Date(
      (info.start.getTime() + info.end.getTime()) / 2
    );

    setCurrentMonth(
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`
    );
  };

  // POST /api/calendar
  const handleAddNote = async () => {
    if (!isAdminOrPIC) {
      alert("Kamu tidak memiliki akses untuk menambahkan agenda.");
      return;
    }

    if (!selectedDate) {
      alert("Pilih tanggal terlebih dahulu.");
      return;
    }

    if (!newNote.trim()) {
      alert("Agenda tidak boleh kosong.");
      return;
    }

    if (isSaving) return;

    const token = ensureToken();

    if (!token) return;

    const existing = events.find(
      (event) => event.date === selectedDate
    );

    const usedColors = new Set(events.map((event) => event.color));

    const availableColors = NOTE_COLORS.filter(
      (item) => !usedColors.has(item.background)
    );

    const color =
      existing?.color ||
      availableColors[0]?.background ||
      NOTE_COLORS[events.length % NOTE_COLORS.length].background;

    setIsSaving(true);

    try {
      const response = await apiRequest({
        url: "/calendar",
        method: "POST",
        token,
        options: {
          body: {
            date: selectedDate,
            time: newTime || null,
            note: newNote.trim(),
            color,
            user_id: userData?.id ?? userData?._id ?? null,
          },
        },
      });

      console.log("POST Calendar response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Gagal menambahkan agenda."
        );
      }

      setNewNote("");
      setNewTime("");

      await fetchNotes();

      alert(response.message || "Agenda berhasil ditambahkan.");
    } catch (error) {
      console.error("POST Calendar error:", error);
      alert(`Gagal menambahkan agenda: ${getErrorMessage(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEdit = (item) => {
    if (!isAdminOrPIC) {
      alert("Kamu tidak memiliki akses untuk mengedit agenda.");
      return;
    }

    const note = normalizeNote(item);

    if (!note.id) {
      alert("ID agenda tidak ditemukan.");
      return;
    }

    setEditingId(String(note.id));

    setEditForm({
      date: note.date || "",
      time: note.time || "",
      note: note.note || "",
      color: note.color || DEFAULT_COLOR,
    });

    setSelectedDate(note.date || null);

    setTimeout(() => {
      document
        .getElementById("edit-agenda-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditForm({
      date: "",
      time: "",
      note: "",
      color: DEFAULT_COLOR,
    });
  };

  // PUT /api/calendar/{id}
  const handleUpdateNote = async () => {
    if (!isAdminOrPIC) {
      alert("Kamu tidak memiliki akses untuk mengedit agenda.");
      return;
    }

    if (!editingId) {
      alert("ID agenda tidak ditemukan.");
      return;
    }

    if (!editForm.date || !editForm.note.trim()) {
      alert("Tanggal dan agenda wajib diisi.");
      return;
    }

    if (isUpdating) return;

    const token = ensureToken();

    if (!token) return;

    setIsUpdating(true);

    try {
      const response = await apiRequest({
        url: `/calendar/${encodeURIComponent(editingId)}`,
        method: "PUT",
        token,
        options: {
          body: {
            date: editForm.date,
            time: editForm.time || null,
            note: editForm.note.trim(),
            color: editForm.color,
            user_id: userData?.id ?? userData?._id ?? null,
          },
        },
      });

      console.log("PUT Calendar response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Gagal memperbarui agenda."
        );
      }

      const updatedDate = editForm.date;

      handleCancelEdit();
      setSelectedDate(updatedDate);

      await fetchNotes();

      alert(response.message || "Agenda berhasil diperbarui.");
    } catch (error) {
      console.error("PUT Calendar error:", error);
      alert(`Gagal memperbarui agenda: ${getErrorMessage(error)}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // DELETE /api/calendar/{id}
  const handleDeleteNote = async (item) => {
    if (!isAdminOrPIC) {
      alert("Kamu tidak memiliki akses untuk menghapus agenda.");
      return;
    }

    const note = normalizeNote(item);

    if (!note.id) {
      alert("ID agenda tidak ditemukan.");
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      `Yakin ingin menghapus agenda ini?\n\n${note.note}\n${formatDate(
        note.date
      )}`
    );

    if (!confirmed) return;

    const token = ensureToken();

    if (!token) return;

    setDeletingId(String(note.id));

    try {
      const response = await apiRequest({
        url: `/calendar/${encodeURIComponent(note.id)}`,
        method: "DELETE",
        token,
      });

      console.log("DELETE Calendar response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Gagal menghapus agenda."
        );
      }

      if (String(editingId) === String(note.id)) {
        handleCancelEdit();
      }

      setEvents((previous) =>
        previous.filter(
          (event) => String(event.id) !== String(note.id)
        )
      );

      await fetchNotes();

      alert(response.message || "Agenda berhasil dihapus.");
    } catch (error) {
      console.error("DELETE Calendar error:", error);
      alert(`Gagal menghapus agenda: ${getErrorMessage(error)}`);
    } finally {
      setDeletingId(null);
    }
  };

  const noteEvents = events
    .filter((event) => event.date)
    .map((event) => ({
      id: String(event.id),
      title: event.time
        ? `${event.time.slice(0, 5)} ${event.note}`
        : event.note,
      start: event.time
        ? `${event.date}T${event.time.slice(0, 5)}`
        : event.date,
      allDay: !event.time,
      backgroundColor: event.color,
      borderColor: getBorderColor(event.color),
      textColor: "#334155",
      display: "block",
      extendedProps: {
        isNote: true,
        note: event.note,
        time: event.time,
        color: event.color,
        date: event.date,
        noteId: event.id,
      },
    }));

  const calendarEvents = [...holidays, ...noteEvents];

  const monthlyNotes = events
    .filter((event) => event.date?.startsWith(currentMonth))
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || "").localeCompare(b.time || "")
    );

  const selectedDateNotes = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );

  const renderAgendaActions = (note) => {
    if (!isAdminOrPIC) return null;

    return (
      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-200/70 pt-3 dark:border-slate-700">
        <button
          type="button"
          onClick={() => handleOpenEdit(note)}
          disabled={deletingId !== null || isUpdating}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10"
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => handleDeleteNote(note)}
          disabled={deletingId !== null || isUpdating}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          {deletingId === String(note.id) ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          {deletingId === String(note.id)
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    );
  };

  return (
    <div className="calendar-modern -mt-8 space-y-5">
      <style>{CALENDAR_CSS}</style>

      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
              <CalendarIcon size={21} />
            </div>

            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
                Agenda &amp; Catatan
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Manage your schedule and activities by date.
              </p>
            </div>
          </div>

          <a
            href={LLAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 sm:self-auto"
          >
            LLAT 2026
            <ExternalLink size={15} />
          </a>
        </div>
      </section>

      {/* Information */}
      <section className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/25 dark:bg-blue-500/10">
        <Info
          size={19}
          className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
        />
        <p className="text-sm leading-6 text-blue-800 dark:text-blue-200">
          Select a date on the calendar to view its agenda.
          {isAdminOrPIC
            ? " You can add, edit, or delete agendas from the side panel."
            : " Available agendas can be viewed on the calendar."}
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Calendar */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Activity Calendar
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {formatMonth(currentMonth)}
              </p>
            </div>

            {isLoading && (
              <span className="inline-flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <LoaderCircle size={14} className="animate-spin" />
                Loading...
              </span>
            )}
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="en"
            dayHeaderFormat={{ weekday: "short" }}
            firstDay={1}
            height="auto"
            events={calendarEvents}
            displayEventTime={false}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            dayMaxEvents={3}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{ today: "Today" }}
            eventClick={(info) => {
              const event = info.event;
              const date =
                event.extendedProps?.date ||
                event.startStr.slice(0, 10);

              setSelectedDate(date);
              setShowSelectedAgenda(true);

              if (event.extendedProps?.isHoliday) {
                alert(`${event.title}\n${formatDate(date)}`);
                return;
              }

              const time = event.extendedProps?.time;
              const note =
                event.extendedProps?.note || event.title;

              alert(
                `Date: ${date}` +
                  (time ? `\nTime: ${time.slice(0, 5)}` : "") +
                  `\nAgenda: ${note}`
              );
            }}
          />

          <div className="mt-5 flex flex-wrap gap-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="h-3 w-3 rounded-sm bg-blue-300" />
              Agenda
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="h-3 w-3 rounded-sm bg-red-200" />
              National holidays
            </div>
          </div>
        </section>

        {/* Side panel */}
        <aside className="space-y-4">
          {/* Add Agenda */}
          {isAdminOrPIC && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                  <CalendarPlus size={20} />
                </div>

                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white">
                    Add Agenda
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create a new activity
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="new-agenda-date"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Date
                  </label>
                  <input
                    id="new-agenda-date"
                    type="date"
                    value={selectedDate || ""}
                    onChange={(event) =>
                      setSelectedDate(event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-agenda-time"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Time
                  </label>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="new-agenda-time"
                      type="time"
                      value={newTime}
                      onChange={(event) =>
                        setNewTime(event.target.value)
                      }
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new-agenda-note"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Agenda
                  </label>
                  <textarea
                    id="new-agenda-note"
                    rows={3}
                    value={newNote}
                    onChange={(event) =>
                      setNewNote(event.target.value)
                    }
                    placeholder="Enter agenda details..."
                    className={inputClass}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={
                    isSaving || !selectedDate || !newNote.trim()
                  }
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Plus size={18} />
                  )}
                  {isSaving ? "Saving..." : "Save Agenda"}
                </button>

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Select a date before saving. Time is optional.
                </p>
              </div>
            </section>
          )}

          {/* Edit Agenda */}
          {isAdminOrPIC && editingId !== null && (
            <section
              id="edit-agenda-form"
              className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-500/30 dark:bg-slate-900"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pencil
                    size={19}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <div>
                    <h2 className="font-extrabold text-slate-900 dark:text-white">
                      Edit Agenda
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update your activity
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  aria-label="Cancel editing"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-agenda-date"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Date
                  </label>
                  <input
                    id="edit-agenda-date"
                    type="date"
                    value={editForm.date}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        date: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-agenda-time"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Time
                  </label>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="edit-agenda-time"
                      type="time"
                      value={editForm.time}
                      onChange={(event) =>
                        setEditForm((previous) => ({
                          ...previous,
                          time: event.target.value,
                        }))
                      }
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-agenda-note"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Agenda
                  </label>
                  <textarea
                    id="edit-agenda-note"
                    rows={4}
                    value={editForm.note}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        note: event.target.value,
                      }))
                    }
                    placeholder="Enter agenda details..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Agenda Color
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {NOTE_COLORS.map((item) => (
                      <button
                        key={item.background}
                        type="button"
                        title={item.background}
                        aria-label={`Select color ${item.background}`}
                        aria-pressed={
                          editForm.color === item.background
                        }
                        onClick={() =>
                          setEditForm((previous) => ({
                            ...previous,
                            color: item.background,
                          }))
                        }
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                          editForm.color === item.background
                            ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900"
                            : ""
                        }`}
                        style={{
                          backgroundColor: item.background,
                          borderColor: item.border,
                        }}
                      >
                        {editForm.color === item.background && "✓"}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateNote}
                  disabled={
                    isUpdating ||
                    !editForm.date ||
                    !editForm.note.trim()
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </section>
          )}

          {/* Selected Agenda */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() =>
                setShowSelectedAgenda((previous) => !previous)
              }
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white">
                    Selected Agenda
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedDate
                      ? formatDate(selectedDate)
                      : "Choose a date"}
                  </p>
                </div>
              </div>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  showSelectedAgenda ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSelectedAgenda && (
              <div className="mt-4 space-y-3">
                {!selectedDate && (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Select a date on the calendar to see its agenda.
                  </p>
                )}

                {selectedDate &&
                  selectedDateNotes.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      No agenda for this date.
                    </p>
                  )}

                {selectedDateNotes.map((note) => (
                  <article
                    key={note.id}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: getBorderColor(note.color),
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold text-slate-800 dark:text-slate-100">
                          {note.note}
                        </p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {note.time
                            ? `Time: ${note.time.slice(0, 5)}`
                            : "All day"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(note.date)}
                        </p>
                      </div>

                      <span
                        className="mt-1 h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: note.color }}
                      />
                    </div>

                    {renderAgendaActions(note)}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Monthly Recap */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() =>
                setShowMonthlyRecap((previous) => !previous)
              }
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white">
                    Monthly Recap
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {monthlyNotes.length} agenda(s) this month
                  </p>
                </div>
              </div>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  showMonthlyRecap ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMonthlyRecap && (
              <div className="mt-4 space-y-3">
                {monthlyNotes.length === 0 && (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    No agendas for {formatMonth(currentMonth)}.
                  </p>
                )}

                {monthlyNotes.map((note) => (
                  <article
                    key={note.id}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {formatDate(note.date)}
                      {note.time
                        ? ` • ${note.time.slice(0, 5)}`
                        : ""}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {note.note}
                    </p>

                    {renderAgendaActions(note)}
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}