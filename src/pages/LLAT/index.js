import React, { useContext, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AppContext } from "@/contexts/AppContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import { color } from "echarts";
import Breadcrumbs from "@/components/Breadcrumbs";
import Title from "@/components/Title";
import { User } from "lucide-react";

export default function LLATPage() {
  const { userData } = useContext(AppContext);
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([
    {
      id: "e1",
      date: "2025-10-07",
      title: "Pendaftaran Kontrak/Addendum s.d. 30 Sep 25",
    },
    { id: "e2", date: "2025-10-07", title: "SPM-LS BAST/BAPP s.d. 30 Sep 25" },
    {
      id: "e3",
      date: "2025-10-15",
      title:
        "Transaksi keuangan dan BMN, serta Rekonsiliasi UAKPA/UAKPA BUN s.d. 30 Sep 25",
    },
    {
      id: "e4",
      date: "2025-10-22",
      title: "SPM-LS BAST/BAPP 1 s.d. 15 Okt 25",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [newNote, setNewNote] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // handler ketika user klik tanggal
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleDatesSet = (info) => {
    const middle = new Date((info.start.getTime() + info.end.getTime()) / 2);

    const ym = `${middle.getFullYear()}-${String(
      middle.getMonth() + 1
    ).padStart(2, "0")}`;

    setCurrentMonth(ym);
    setSelectedDate(null);
  };

  const handleAddNote = () => {
    if (!selectedDate || !newNote.trim()) return;

    const id = `e${Date.now()}`;

    setEvents((prev) => {
      const next = [...prev, { id, date: selectedDate, title: newNote.trim() }];
      return next;
    });

    setNewNote("");
  };

  const colors = ["#E3F2FD", "#E8F5E9", "#FFF9C4", "#FCE4EC"];

  // semua event di bulan currentMonth
  const monthlyEvents = events.filter((e) => e.date.startsWith(currentMonth));

  // kelompokkan events by date
  const groupedEvents = monthlyEvents.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e.title);
    return acc;
  }, {});

  // buat daftar tanggal unik terurut
  const groupedEntriesSorted = Object.keys(groupedEvents)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({ date, notes: groupedEvents[date] }));

  // buat peta warna berdasarkan urutan tanggal
  const colorMap = {};
  groupedEntriesSorted.forEach((entry, idx) => {
    colorMap[entry.date] = colors[idx % colors.length];
  });

  // mapping events ke calendar (warna sesuai tanggal)
  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.date,
    allDay: true,
    backgroundColor: colorMap[e.date] || "#BBDEFB",
    borderColor: colorMap[e.date] || "#BBDEFB",
    textColor: "#000000",
  }));

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[{ name: "Pelaksanaan Anggara / LLAT", path: "/llat" }]}
        />
        <User name={"Test"} previlege={"Administrator"} />
      </div>
      <Title>Langkah - Langkah Akhir Tahun</Title>
      <div className="flex gap-6">
        {/* Kalender */}
        <Card className="w-3/5 p-4">
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
        <Card className="w-2/5 p-6 flex flex-col gap-4 overflow-y-auto max-h-[100vh]">
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
                style={{ backgroundColor: colors[idx % colors.length] }}
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

          {/* Tambah catatan: hanya admin atau pic, dan pilih tanggal terlebih dahulu */}
          {(userData?.role === "admin" || userData?.role === "pic") && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-600 mb-2">
                {selectedDate
                  ? `Tambah catatan untuk ${new Date(
                      selectedDate
                    ).toLocaleDateString("id-ID")}`
                  : "Klik tanggal di kalender untuk memilih tanggal"}
              </h3>

              <div className="flex gap-2">
                <Input
                  placeholder="Isi catatan..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  disabled={!selectedDate}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!selectedDate || !newNote.trim()}
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
