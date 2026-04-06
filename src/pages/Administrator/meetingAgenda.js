import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  AlignLeft,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Holidays from "date-holidays";

export default function AgendaRapat() {
  const { userData } = useContext(AppContext);
  const calendarRef = useRef(null);
  const isGuest = userData?.role === "guest";

  const [events, setEvents] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("rapat_db") : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [holidays, setHolidays] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sholatData, setSholatData] = useState([]);
  const [loadingSholat, setLoadingSholat] = useState(true);
  const [viewTitle, setViewTitle] = useState("");

  const [locationType, setLocationType] = useState("Ruang Rapat Kecil");
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    desc: "",
    link: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("rapat_db", JSON.stringify(events));
  }, [events]);

  // Fetch Tgl Merah
  useEffect(() => {
    const hd = new Holidays("ID");
    const yearHolidays = hd.getHolidays(currentTime.getFullYear());

    const holidayEvents = yearHolidays.map((h) => ({
      title: h.name,
      start: h.date.split(" ")[0],
      display: "block",
      color: "#fee2e2",
      backgroundColor:"#fee2e2",
      isHoliday: true,
    }));

    setHolidays(holidayEvents);
  }, [currentTime]);

  // Fetch solat
    useEffect(() => {
      if (isGuest) {
        const fetchSholat = async () => {
          try {
            setLoadingSholat(true);
            const year = currentTime.getFullYear();
            const month = currentTime.getMonth() + 1;

            const response = await fetch(
              `https://api.aladhan.com/v1/calendar?latitude=-6.2088&longitude=106.8456&method=11&month=${month}&year=${year}`
            );
            const data = await response.json();
            const todayIdx = currentTime.getDate() - 1;

            let combinedData = data.data.slice(todayIdx, todayIdx + 3);

            if (combinedData.length < 3) {
              const nextMonth = month === 12 ? 1 : month + 1;
              const nextYear = month === 12 ? year + 1 : year;
              
              const responseNext = await fetch(
                `https://api.aladhan.com/v1/calendar?latitude=-6.2088&longitude=106.8456&method=11&month=${nextMonth}&year=${nextYear}`
              );
              const dataNext = await responseNext.json();
              
              const needed = 3 - combinedData.length;
              combinedData = [...combinedData, ...dataNext.data.slice(0, needed)];
            }

            setSholatData(combinedData);
            setLoadingSholat(false);
          } catch (error) {
            console.error("Gagal load jadwal sholat", error);
            setLoadingSholat(false);
          }
        };
        fetchSholat();
      }
    }, [isGuest, currentTime.getMonth()]); 

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setIsEditing(null);
    setFormData({ title: "", startTime: "09:00", endTime: "10:00", desc: "" });
    setShowModal(true);
  };

  const handleEditEvent = (ev) => {
    if (!ev || !ev.time) return;
    setIsEditing(ev.id);
    setSelectedDate(ev.start);

    const times = ev.time.split(" - ");
    const start = times[0] ? times[0].replace(".", ":") : "09:00";
    const end = times[1] ? times[1].replace(".", ":") : "10:00";
    setFormData({
      title: ev.title,
      startTime: start.replace(".", ":"),
      endTime: end.replace(".", ":"),
      desc: ev.location,
    });
    if (["Ruang Rapat Kecil", "Ruang Rapat Besar"].includes(ev.location)) {
      setLocationType(ev.location);
    } else {
      setLocationType("Lainnya");
    }
    setShowModal(true);
  };

  const handleSaveAgenda = () => {
    if (!formData.title) return alert("Judul wajib diisi!");
    const finalLocation =
      locationType === "Lainnya" ? formData.desc : locationType;
    if (locationType === "Lainnya" && !formData.desc)
      return alert("Lokasi manual harus diisi!");
    const isConflict = events.some((ev) => {
      if (isEditing && ev.id === isEditing) return false;

      const sameDate = ev.start === selectedDate;
      const sameLocation = ev.location === finalLocation;

      const newStart = formData.startTime;
      const newEnd = formData.endTime;
      const existingStart = ev.time.split(" - ")[0].replace(".", ":");
      const existingEnd = ev.time.split(" - ")[1].replace(".", ":");

      const overlap = newStart < existingEnd && newEnd > existingStart;
      return sameDate && sameLocation && overlap;
    });

    if (isConflict) {
      return alert(
        `Maaf Ruangan "${finalLocation}" sudah dipakai di jam tersebut.`
      );
    }

    const existingInDate = events.filter((ev) => ev.start === selectedDate);
    if (!isEditing && existingInDate.length >= 3) {
      return alert("Maksimal 3 kegiatan per hari!");
    }

    const timeString = `${formData.startTime.replace(
      ":",
      "."
    )} - ${formData.endTime.replace(":", ".")}`;

    if (isEditing) {
      setEvents(
        events.map((ev) =>
          ev.id === isEditing
            ? {
                ...ev,
                title: formData.title,
                time: timeString,
                location: finalLocation,
              }
            : ev
        )
      );
    } else {
      setEvents([
        ...events,
        {
          id: Date.now(),
          title: formData.title,
          start: selectedDate,
          time: timeString,
          location: finalLocation,
          status: "Proses",
          color: "text-blue-600 bg-blue-100",
        },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus agenda ini?")) {
      setEvents(events.filter((ev) => ev.id !== id));
      setShowModal(false);
    }
  };

  const formatTime = (date) => {
    return date
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(":", ".");
  };

  const isCurrentPrayTime = (prayTimeStr, nextPrayTimeStr) => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    const parseTime = (str) => {
      if (!str) return null;
      const [h, m] = str.split(" ")[0].split(":").map(Number);
      return h * 60 + m;
    };

    const pray = parseTime(prayTimeStr);
    const next = parseTime(nextPrayTimeStr);

    if (next) {
      return now >= pray && now < next;
    } else {
      return now >= pray && now < 1440; 
    }
  };

  const getEventsByDate = (dateISO) => {
    return events.filter((ev) => ev.start === dateISO);
  };

  const nextMonth = () => calendarRef.current.getApi().next();
  const prevMonth = () => calendarRef.current.getApi().prev();

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div>
        {!isGuest ? (
          <div className="bg-white relative rounded-[2rem] mt-2 md:mt-0 shadow-xl border border-slate-100 p-8  relative">
            <div className="flex justify-between items-center  md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10">
              <div className="flex items-center gap-4">
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-[#59c7ff] text-[#d5f1ff]  flex items-center justify-center shadow-sm border border-white z-20">
                  <Calendar size={24} />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight ">
                  {viewTitle ||
                    currentTime.toLocaleString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-3 bg-slate-100 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-3 bg-slate-100 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div
              className="calendar-admin relative 
            [&_.fc-theme-standard_td]:border-[#f1f5f9] 
            [&_.fc-theme-standard_th]:border-[#f1f5f9] 
            [&_.fc-col-header-cell]:bg-white 
            [&_.fc-col-header-cell]:py-2 md:[&_.fc-col-header-cell]:py-4 
            [&_.fc-col-header-cell]:text-[8px] md:[&_.fc-col-header-cell]:text-[15px] 
            [&_.fc-col-header-cell]:font-black [&_.fc-col-header-cell]:text-slate-400 [&_.fc-col-header-cell]:uppercase 

            [&_.fc-daygrid-day-frame]:flex 
            [&_.fc-daygrid-day-frame]:flex-col 
            [&_.fc-daygrid-day-frame]:min-h-[60px] md:[&_.fc-daygrid-day-frame]:min-h-[100px] 
            [&_.fc-daygrid-day-frame]:h-full

            [&_.fc-daygrid-day-events]:flex-grow 
            [&_.fc-daygrid-day-events]:flex 
            [&_.fc-daygrid-day-events]:flex-col 
            [&_.fc-daygrid-day-events]:justify-end 
            [&_.fc-daygrid-day-events]:pb-2
            [&_.fc-daygrid-event-h-harness]:mt-auto

            [&_.fc-daygrid-day-top]:flex-none 
            [&_.fc-daygrid-day-number]:p-1.5 md:[&_.fc-daygrid-day-number]:p-3 
            [&_.fc-daygrid-day-number]:text-[11px] md:[&_.fc-daygrid-day-number]:text-sm
            [&_.fc-daygrid-day-number]:font-extrabold 

            [&_.fc-day-sun_.fc-daygrid-day-number]:text-red-500
            [&_.is-holiday_.fc-daygrid-day-number]:text-red-600
            [&_.is-holiday]:bg-red-50/80
            [&_.is-holiday_.fc-daygrid-day-top]:z-10
            [&_.fc-daygrid-day:hover]:bg-blue-50 [&_.fc-daygrid-day:hover]:cursor-pointer 
            [&_.is-holiday:hover]:bg-red-100
            [&_.fc-daygrid-day.fc-day-today]:bg-gray-100/100

            [&_.fc-event]:border-none [&_.fc-event]:rounded-md md:[&_.fc-event]:rounded-lg 
            [&_.fc-event]:px-1 md:[&_.fc-event]:px-1.5 [&_.fc-event]:mb-0.5
            [&_.fc-event-title]:text-[7px] md:[&_.fc-event-title]:text-[9px] 
            [&_.fc-event-title]:font-black [&_.fc-event-title]:uppercase [&_.fc-event-title]:"
            >
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                locale="id"
                height="auto"
                datesSet={(arg) => setViewTitle(arg.view.title)}
                dateClick={handleDateClick}
                events={[
                  ...events.map(ev => ({ ...ev, id: String(ev.id) })), 
                  ...holidays
                ]}
                dayHeaderFormat={{ weekday: 'long' }}

                dayCellClassNames={(arg) => {
                const year = arg.date.getFullYear();
                const month = String(arg.date.getMonth() + 1).padStart(2, '0');
                const day = String(arg.date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                
                const isHoliday = holidays.some(h => h.start === dateStr);
                const isSunday = arg.date.getDay() === 0;

                return (isHoliday || isSunday) ? "is-holiday" : "";
              }}

                eventContent={(eventInfo) => {
                if (eventInfo.event.extendedProps.isHoliday) {
                  return (
                    <div className="w-full flex justify-center items-center pointer-events-none">
                      <span className="text-red-500 font-bold text-[7px] md:text-[9px] uppercase leading-tight text-center break-words whitespace-normal px-1">
                        {eventInfo.event.title}
                      </span>
                    </div>
                  );
                }
               
                return (
                  <div className="p-0.5 overflow-hidden">
                    <div className="text-[7px] md:text-[9px] font-bold truncate">
                      {eventInfo.event.title}
                    </div>
                  </div>
                );
              }}

                dayMaxEvents={3}
                eventClick={(info) => {
                  if (!info.event.extendedProps.isHoliday) {
                    const ev = events.find(
                      (e) => e.id === parseInt(info.event.id)
                    );
                    if (ev) handleEditEvent(ev);
                  }
                }}
              />

              {showModal && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-[2rem]">
                  <div className="bg-[#f1f5f9] w-full max-w-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-white animate-in zoom-in duration-200 overflow-y-auto">
                    <h4 className="text-center font-black text-slate-600 text-[10px] mb-6 uppercase tracking-widest">
                      {isEditing ? "Edit Agenda" : "Tambah Agenda"} •{" "}
                      {selectedDate}
                    </h4>

                    <div className="space-y-3 md:space-y-4">
                      <input
                        className="w-full p-3 md:p-4 rounded-xl text-sm md:text-base bg-white border-none font-bold outline-none shadow-sm focus:ring-4 ring-blue-100"
                        placeholder="Judul Rapat"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />

                      <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-slate-50">
                        < Clock className="ml-2 text-slate-400" size={18} />
                        <div className="flex items-center flex-1 justify-between gap-2">
                          <div className="relative flex-1 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                            <input
                              type="time"
                              className="w-full bg-transparent font-black md:text-xl text-sm py-2 px-1 text-center outline-none cursor-pointer relative z-10 
                              [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                              value={formData.startTime}
                              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                          </div>
                          <span className="font-black text-slate-300">-</span>
                          <div className="relative flex-1 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                            <input
                              type="time"
                              className="w-full bg-transparent font-black md:text-xl text-sm py-2 px-1 text-center outline-none cursor-pointer relative z-10 
                              [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                              value={formData.endTime}
                              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-xl shadow-sm flex items-center">
                        <MapPin className="ml-2 text-slate-400" size={18} />
                        <select
                          className="flex-1 p-2 outline-none font-bold bg-transparent cursor-pointer text-sm md:text-base"
                          value={locationType}
                          onChange={(e) => setLocationType(e.target.value)}
                        >
                          <option value="Ruang Rapat Kecil">
                            Ruang Rapat Kecil
                          </option>
                          <option value="Ruang Rapat Besar">
                            Ruang Rapat Besar
                          </option>
                          <option value="Lainnya">Lainnya...</option>
                        </select>
                      </div>

                      {locationType === "Lainnya" && (
                        <input
                          className="w-full p-3 rounded-xl border-2 border-blue-100 font-bold outline-none bg-white"
                          placeholder="Lokasi manual..."
                          value={formData.desc}
                          onChange={(e) =>
                            setFormData({ ...formData, desc: e.target.value })
                          }
                        />
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() =>
                            isEditing
                              ? handleDelete(isEditing)
                              : setShowModal(false)
                          }
                          className="flex-1 py-4 bg-slate-400 text-white font-black rounded-xl text-[10px] md:text-xs uppercase "
                        >
                          {isEditing ? "Hapus" : "Batal"}
                        </button>
                        <button
                          onClick={handleSaveAgenda}
                          className="flex-1 py-4 bg-blue-600 text-white font-black rounded-xl text-[10px] md:text-xs uppercase shadow-lg"
                        >
                          {isEditing ? "Update" : "Simpan"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className=" bg-white rounded-[2.5rem]">
            <div className="grid grid-cols-1 md:grid-cols-3  lg:gap-40 p-5  md:gap-30 gap-2">
              <StatCard
                label="Total Rapat Bulan Ini"
                value={
                  events.filter(
                    (e) =>
                      new Date(e.start).getMonth() === currentTime.getMonth()
                  ).length
                }
              />
              <div className="bg-white rounded-[2.5rem] p-2 text-center shadow-xl border border-slate-100 flex flex-col justify-center">
                <p className="text-5xl md:text-6xl font-black  tracking-tighter leading-none">
                  {formatTime(currentTime)}
                </p>
              </div>
              <StatCard
                label="Total Rapat Hari Ini"
                value={
                  getEventsByDate(currentTime.toISOString().split("T")[0])
                    .length
                }
              />
            </div>

            <div className="bg-white rounded-[3rem]  group shadow-2xl border border-white relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{ nextEl: ".next-btn", prevEl: ".prev-btn" }}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="h-full"
              >
                {[0, 1, 2].map((offset) => {
                  const targetDate = new Date();
                  targetDate.setDate(targetDate.getDate() + offset);
                  const dateStr = targetDate.toISOString().split("T")[0];
                  const label =
                    offset === 0 ? "Hari Ini" : offset === 1 ? "Besok" : "Lusa";
                  const dailyEvents = getEventsByDate(dateStr);

                  return (
                    <SwiperSlide key={offset}>
                      <div className="p-6  md:p-8  min-h-[300px]">
                        <div className="flex justify-between items-center  border-b  border-slate-50">
                          <h2 className="md:text-2xl text-xl font-black tracking-tight uppercase">
                            Jadwal{" "}
                            <span className="text-[#308BFD]">{label}</span>
                          </h2>
                          <p className="md:text-2xl text-xl font-black ">
                            {targetDate.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-center border-separate border-spacing-y-4">
                            <thead>
                              <tr className="bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] text-white shadow-xl shadow-blue-100">
                                <th className="py-1 md:py-3 px-1 md:px-3 rounded-l-2xl font-black  uppercase tracking-widest text-[12px] md:text-[15px]">
                                  Waktu
                                </th>
                                <th className="py-1 md:py-3 px-1 md:px-3 font-black  uppercase tracking-widest text-[12px] md:text-[15px] text-left">
                                  Kegiatan
                                </th>
                                <th className="py-1 md:py-3 px-1 md:px-3 font-black  uppercase tracking-widest text-[12px] md:text-[15px]">
                                  Ruangan
                                </th>
                                <th className="py-1 md:py-3 px-1 md:px-3 rounded-r-2xl font-black  uppercase tracking-widest text-[12px] md:text-[15px]">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {dailyEvents.length > 0 ? (
                                dailyEvents.map((ev, i) => (
                                  <tr
                                    key={i}
                                    className="group hover:scale-[1.01] transition-all"
                                  >
                                    <td className="py-1 md:py-3 bg-slate-50/50 rounded-l-2xl text-sm md:text-base font-black  ">
                                      {ev.time}
                                    </td>
                                    <td className="py-1 md:py-3 bg-slate-50/50 text-sm md:text-base font-black   text-left">
                                      {ev.title}
                                    </td>
                                    <td className="py-1 md:py-3 bg-slate-50/50 text-sm md:text-base font-black  ">
                                      {ev.location}
                                    </td>
                                    <td className="py-1 md:py-3 bg-slate-50/50 rounded-r-2xl flex items-center justify-center gap-3">
                                      <span
                                        className={`${ev.color} px-1 py-2 rounded-xl font-black  text-sm md:text-base uppercase shadow-sm border border-white`}
                                      >
                                        {ev.status}
                                      </span>
                                      {!isGuest && (
                                        <button
                                          onClick={() => handleDelete(ev.id)}
                                          className="text-red-300 hover:text-red-500 transition-colors"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="py-24 text-slate-200 font-black text-3xl tracking-widest uppercase opacity-50"
                                  >
                                    Tidak ada jadwal rapat
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <button className="prev-btn absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
                <ChevronLeft size={24} />
              </button>
              <button className="next-btn absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="bg-white rounded-2xl  overflow-hidden p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-center border-separate border-spacing-y-2">
                  <thead>
                    <tr className=" bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] text-white shadow-sm">
                      <th className="py-3 rounded-l-xl font-bold  text-sm md:text-base">
                        Tanggal
                      </th>
                      <th className="py-3 font-bold  text-sm md:text-base">
                        Imsak
                      </th>
                      <th className="py-3 font-bold  text-sm md:text-base">
                        Subuh
                      </th>
                      <th className="py-3 font-bold  text-sm md:text-base">
                        Dzuhur
                      </th>
                      <th className="py-3 font-bold  text-sm md:text-base">
                        Ashar
                      </th>
                      <th className="py-3 font-bold  text-sm md:text-base">
                        Maghrib
                      </th>
                      <th className="py-3 rounded-r-xl font-bold  text-sm md:text-base">
                        Isya
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loadingSholat ? (
                      sholatData.map((day, idx) => (
                        <tr key={idx}>
                          <td className="py-4 text-sm font-black text-[#308BFD] bg-blue-50/50 rounded-l-xl">
                            {new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date(day.date.timestamp * 1000))}, {day.date.readable.split(" ")[0]}/{currentTime.getMonth() + 1}/{currentTime.getFullYear()}
                          </td>
                          {[
                            { name: "Imsak", time: day.timings.Imsak, next: day.timings.Fajr },
                            { name: "Subuh", time: day.timings.Fajr, next: day.timings.Dhuhr },
                            { name: "Dzuhur", time: day.timings.Dhuhr, next: day.timings.Asr },
                            { name: "Ashar", time: day.timings.Asr, next: day.timings.Maghrib },
                            { name: "Maghrib", time: day.timings.Maghrib, next: day.timings.Isha },
                            { name: "Isya", time: day.timings.Isha, next: null }
                          ].map((pray, i) => {
                            const isNow = idx === 0 && isCurrentPrayTime(pray.time, pray.next);
                            return (
                              <td
                                key={i}
                                className={`py-4 text-xl font-bold transition-all  ${
                                  isNow 
                                    ? "bg-gradient-to-b from-[#59C7FF] to-[#2F8AFD] text-white shadow-inner text-xl  rounded-lg" 
                                    : "bg-blue-50/50"
                                } ${i === 5 ? "rounded-r-xl" : ""}`}
                              >
                               <div className="text-center">
                                <span className={`block font-black leading-none ${
                                  isNow 
                                    ? "text-lg md:text-xl tracking-normal" 
                                    : "text-xs md:text-sm opacity-70"
                                }`}>
                                  {pray.time.split(" ")[0]}
                                </span>       
                              </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-10 text-gray-400 font-medium"
                        >
                          Memuat Jadwal Sholat...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function StatCard({ label, value }) {
  return (
    <div className=" bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] rounded-[2.5rem] p-3  text-center text-white shadow-2xl relative overflow-hidden group">
      <div className="relative z-10">
        <p className="font-black text-lg md:text-xl mb-1 opacity-80 tracking-tighter uppercase">
          {label}
        </p>
        <p className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-md p-3">
          {value}
        </p>
      </div>
      <img
        src="/rapat.webp"
        className="absolute right-[0rem] bottom-[0rem]  w-20 md:w-[140px] z-0 transition-transform duration-1000"
      />
    </div>
  );
}
