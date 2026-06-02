import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AppContext } from "@/contexts/AppContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Breadcrumbs from "@/components/Breadcrumbs";
import Title from "@/components/Title";
import { User } from "lucide-react";
import { apiRequest } from "@/services/APIHelper";

export default function LLATPage() {
  const { userData } = useContext(AppContext);
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [newNote, setNewNote] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  });
  const colors = ["#E3F2FD", "#E8F5E9", "#FFF9C4", "#FCE4EC", "#D1C4E9"];

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleDatesSet = (info) => {
    const middle = new Date((info.start.getTime() + info.end.getTime()) / 2);

    const ym = `${middle.getFullYear()}-${String(
      middle.getMonth() + 1,
    ).padStart(2, "0")}`;

    setCurrentMonth(ym);
    setSelectedDate(null);
  };

  const handleAddNote = async () => {
    if (!selectedDate || !newNote.trim()) return;

    const existingEvent = events.find((e) => e.date === selectedDate);
    const existingColor = existingEvent?.color;

    const usedColors = [...new Set(events.map((e) => e.color))];
    const availableColors = colors.filter((c) => !usedColors.includes(c));
    const nextColor =
      availableColors[0] || colors[events.length % colors.length];

    const colorToUse = existingColor || nextColor;

    // --- optimistic update ---
    const optimisticId = `temp-${Date.now()}`;
    const optimisticEvent = {
      id: optimisticId,
      date: selectedDate,
      title: newNote.trim(),
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
                  title: saved.note ?? saved.title ?? newNote.trim(),
                  color: saved.color ?? colorToUse,
                  ...saved,
                }
              : ev,
          ),
        );
      } else {
        setEvents((prev) => prev.filter((ev) => ev.id !== optimisticId));
        console.error("gagal simpan note:", result);
        alert("Gagal menyimpan catatan.");
      }
    } catch (err) {
      setEvents((prev) => prev.filter((ev) => ev.id !== optimisticId));
      console.error(err);
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
    if (!colorMap[e.date]) {
      colorMap[e.date] = e.color || "#E3F2FD"; // fallback kalau kosong
    }
  });

  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.note,
    start: e.date,
    allDay: true,
    backgroundColor: e.color,
    borderColor: colorMap[e.date] || "#BBDEFB",
    textColor: "#000000",
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

  return (
    <div className="p-4 md:p-6  min-h-screen">
      <div className=" mx-auto flex flex-col lg:flex-row gap-12">
        {/* Kalender */}
        <Card className="w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            events={calendarEvents}
            height="auto"
          />
        </Card>

        {/* Panel Catatan Bulanan */}
        <Card className="w-full p-6 flex flex-col gap-4 overflow-y-auto text-sm md:text-base">
          <h2 className="text-xl font-semibold text-gray-700">
            Catatan Bulan{" "}
            {new Date(`${currentMonth}-01`).toLocaleString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          {groupedEntriesSorted.length > 0 ? (
            groupedEntriesSorted.map(({ date, notes }, idx) => (
              <div
                key={date}
                className="p-3 rounded-xl shadow-sm border"
                style={{ backgroundColor: colorMap[date] || "#E3F2FD" }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-700">
                    {new Date(date).getDate()}{" "}
                    {new Date(date).toLocaleString("id-ID", { month: "long" })}{" "}
                    {new Date(date).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {notes.length} {notes.length > 1 ? "catatan" : "catatan"}
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  {notes.map((n, i) => (
                    <li key={i} className="text-gray-800">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Belum ada catatan bulan ini.</p>
          )}

          {(userData?.role === "admin" || userData?.role === "pic") && (
            <div className="mt-4">
              <h3 className="text-sm md:text-base text-gray-600 mb-2">
                {selectedDate
                  ? `Tambah catatan untuk ${new Date(
                      selectedDate,
                    ).toLocaleDateString("id-ID")}`
                  : "Klik tanggal di kalender untuk memilih tanggal"}
              </h3>

              <div className="flex flex-col md:flex-row gap-2 w-full gap-2">
                <Input
                  placeholder="Isi catatan..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  disabled={!selectedDate}
                  className="w-full"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!selectedDate || !newNote.trim()}
                  className="w-full md:w-auto"
                >
                  Tambah
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
