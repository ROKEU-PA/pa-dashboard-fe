import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AppContext } from "@/contexts/AppContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  Info,
  CalendarX,
  Plus,
} from "lucide-react";
import { apiRequest } from "@/services/APIHelper";

export default function CalendarPage() {
  const { userData } = useContext(AppContext);
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newNote, setNewNote] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // State khusus nampung hari libur
  const [holidays, setHolidays] = useState([]);

  // Fungsi narik data libur nasional gratisan
  const fetchHolidays = async () => {
    try {
      // Tembak langsung file JSON dari repositori Open Source yang otomatis update
      const res = await fetch(
        "https://raw.githubusercontent.com/guangrei/APIHariLibur_V2/main/holidays.json",
      );
      const data = await res.json();

      // Map data JSON jadi format event FullCalendar
      const holidayEvents = Object.keys(data).map((date) => ({
        id: `holiday-${date}`,
        title: data[date].summary, // Ambil nama hari liburnya
        start: date,
        allDay: true,
        backgroundColor: "#fee2e2", // Merah soft
        borderColor: "#fca5a5", // Border merah
        textColor: "#dc2626", // Text merah tajam
        display: "block", // Biar bentuknya kotak solid
      }));

      setHolidays(holidayEvents);
    } catch (error) {
      console.error("Gagal narik data libur nasional:", error);
    }
  };

  // Panggil fungsinya sekali pas komponen pertama kali di-render
  useEffect(() => {
    fetchHolidays();
  }, []);

  const colors = ["#DBEAFE", "#D1FAE5", "#FEF9C3", "#FCE7F3", "#EDE9FE"];
  const borderColors = ["#93C5FD", "#6EE7B7", "#FDE047", "#F9A8D4", "#C4B5FD"];

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleDatesSet = (info) => {
    const middle = new Date((info.start.getTime() + info.end.getTime()) / 2);
    const ym = `${middle.getFullYear()}-${String(middle.getMonth() + 1).padStart(2, "0")}`;
    setCurrentMonth(ym);
    setSelectedDate(null);
  };

  const handleAddNote = async () => {
    if (!selectedDate || !newNote.trim()) return;

    const existingEvent = events.find((e) => e.date === selectedDate);
    const existingColor = existingEvent?.color;

    const usedColors = [...new Set(events.map((e) => e.color))];
    const availableColors = colors.filter((c) => !usedColors.includes(c));
    const nextColor = availableColors || colors[events.length % colors.length];

    const colorToUse = existingColor || nextColor;

    // --- optimistic update ---
    const optimisticId = `temp-${Date.now()}`;
    const optimisticEvent = {
      id: optimisticId,
      date: selectedDate,
      note: newNote.trim(), // FIX BUG LAMA: diganti note biar mapping bawahnya gak error
      color: colorToUse,
    };

    setEvents((prev) => [...prev, optimisticEvent]);

    try {
      const payload = {
        date: selectedDate,
        note: newNote.trim(),
        user_id: userData?.id || null,
        color: colorToUse,
      };

      const result = await apiRequest({
        url: "/calendar/create",
        method: "POST",
        options: { body: payload },
      });

      if (result?.success) {
        const saved = result.data;
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === optimisticId
              ? {
                  id: saved.id?.toString() || saved.id,
                  date: saved.date,
                  note: saved.note ?? saved.title ?? newNote.trim(),
                  color: saved.color ?? colorToUse,
                  ...saved,
                }
              : ev,
          ),
        );
      } else {
        setEvents((prev) => prev.filter((ev) => ev.id !== optimisticId));
        alert("Gagal menyimpan catatan.");
      }
    } catch (err) {
      setEvents((prev) => prev.filter((ev) => ev.id !== optimisticId));
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setNewNote("");
    }
  };

  const monthlyEvents = events.filter((e) => e.date.startsWith(currentMonth));

  const groupedEvents = monthlyEvents.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e.note);
    return acc;
  }, {});

  const groupedEntriesSorted = Object.keys(groupedEvents)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({ date, notes: groupedEvents[date] }));

  const colorMap = {};
  events.forEach((e) => {
    if (!colorMap[e.date]) colorMap[e.date] = e.color || "#E3F2FD";
  });

  const getBorderColor = (bgColor) => {
    const idx = colors.indexOf(bgColor);
    return idx !== -1 ? borderColors[idx] : "#BBDEFB";
  };

  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.note,
    start: e.date,
    allDay: true,
    backgroundColor: e.color,
    borderColor: getBorderColor(e.color),
    textColor: "#334155", // Teks agak gelap biar kebaca di background pastel
  }));

  const fetchNotes = async (month) => {
    try {
      const response = await apiRequest({
        url: `/calendar?month=${month}`,
      });
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentMonth) {
      fetchNotes(currentMonth);
    }
  }, [currentMonth]);

  const isAdminOrPic = userData?.role === "admin" || userData?.role === "pic";

  return (
    <div className="w-full min-h-[80vh] flex flex-col gap-6">
      {/* HEADER PAGE */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Agenda & Catatan
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Pantau aktivitas dan kelola catatan harian Anda
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 w-full">
        {/* ==================================================== */}
        {/* BAGIAN KIRI: KALENDER FULLCALENDAR                     */}
        {/* ==================================================== */}
        <div className="w-full xl:w-2/3 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          {/* CUSTOM CSS UNTUK OVERRIDE FULLCALENDAR BIAR MODERN */}
          <style>{`
            .fc .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 800 !important; color: #1e293b; }
            .fc .fc-button-primary { background-color: #f1f5f9 !important; border-color: transparent !important; color: #475569 !important; font-weight: 600 !important; border-radius: 0.5rem !important; text-transform: capitalize !important;}
            .fc .fc-button-primary:hover { background-color: #e2e8f0 !important; color: #0f172a !important; }
            .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #3b82f6 !important; color: white !important; }
            .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9 !important; }
            .fc-col-header-cell { padding: 12px 0 !important; background-color: #f8fafc; font-size: 0.85rem; text-transform: uppercase; color: #64748b; }
            .fc-daygrid-day { cursor: pointer; transition: background-color 0.2s; }
            .fc-daygrid-day:hover { background-color: #f8fafc; }
            .fc-daygrid-day-number { font-weight: 600; color: #475569; padding: 8px !important; }
            .fc-day-today { background-color: #eff6ff !important; }
            .fc-event { border-radius: 4px !important; padding: 2px 4px !important; font-size: 0.75rem !important; font-weight: 600 !important; border-left-width: 3px !important; margin-bottom: 2px !important; }
            .fc-theme-standard th.fc-day-sun {
              background-color: #fef2f2 !important;
            }
            .fc .fc-day-sun .fc-col-header-cell-cushion {
              color: #ef4444 !important;
              font-weight: 800 !important;
            }
            .fc-theme-standard td.fc-day-sun {
              background-color: #fff5f5 !important;
            }
            .fc .fc-day-sun .fc-daygrid-day-number {
              color: #ef4444 !important;
              font-weight: 800 !important;
            }
            .fc .fc-day-sun.fc-day-today {
              background-color: #fee2e2 !important;
            }
          `}</style>

          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            events={[...calendarEvents, ...holidays]}
            height="auto"
            firstDay={1}
          />
        </div>

        {/* ==================================================== */}
        {/* BAGIAN KANAN: PANEL CATATAN & FORM                     */}
        {/* ==================================================== */}
        <div className="w-full xl:w-1/3 flex flex-col gap-5">
          {/* FORM TAMBAH CATATAN (HANYA MUNCUL JIKA ADMIN/PIC) */}
          {isAdminOrPic && (
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 ${selectedDate ? "bg-blue-50 border-blue-200 shadow-md shadow-blue-100/50" : "bg-white border-slate-200 shadow-sm"}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarPlus
                  size={20}
                  className={selectedDate ? "text-blue-600" : "text-slate-400"}
                />
                <h3
                  className={`font-bold ${selectedDate ? "text-blue-800" : "text-slate-700"}`}
                >
                  {selectedDate
                    ? `Agenda: ${new Date(selectedDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
                    : "Tambah Catatan Baru"}
                </h3>
              </div>

              {!selectedDate ? (
                <div className="flex items-start gap-3 p-3 bg-slate-50 text-slate-500 rounded-xl text-sm border border-slate-100">
                  <Info size={18} className="mt-0.5 shrink-0" />
                  <p>
                    Silakan klik salah satu tanggal pada kalender di samping
                    terlebih dahulu untuk menambahkan catatan.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Ketik agenda atau catatan..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-white"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#59C6FF] hover:bg-[#308BFD] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-w-[220px]"
                  >
                    <Plus size={18} className="shrink-0" /> Simpan Catatan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DAFTAR CATATAN BULAN INI */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full max-h-[600px]">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">
                Rekap Bulan{" "}
                {new Date(`${currentMonth}-01`).toLocaleString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Total {groupedEntriesSorted.length} hari memiliki agenda.
              </p>
            </div>

            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 flex flex-col gap-4">
              {groupedEntriesSorted.length > 0 ? (
                groupedEntriesSorted.map(({ date, notes }) => {
                  const bgColor = colorMap[date] || "#DBEAFE";
                  const borderColor = getBorderColor(bgColor);

                  return (
                    <div
                      key={date}
                      className="relative p-4 rounded-xl border-l-4 transition-all hover:shadow-md"
                      style={{
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-slate-800 text-sm opacity-80">
                          {new Date(date).getDate()}{" "}
                          {new Date(date)
                            .toLocaleString("id-ID", {
                              month: "short",
                              year: "numeric",
                            })
                            .toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-1 bg-white/50 rounded-md text-slate-600">
                          {notes.length} ITEM
                        </span>
                      </div>

                      <ul className="flex flex-col gap-1.5 mt-2">
                        {notes.map((n, i) => (
                          <li
                            key={i}
                            className="text-sm font-semibold text-slate-700 flex items-start gap-2"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 opacity-60"
                              style={{ backgroundColor: borderColor }}
                            ></span>
                            <span className="leading-snug">{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <CalendarX size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-sm text-center px-4">
                    Tidak ada agenda atau catatan pada bulan ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
