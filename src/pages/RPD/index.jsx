/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect, useContext } from "react";
import { Plus, Edit2, Trash2, X, Info } from "lucide-react";
import RPDMonitorPage from "./RPDMonitor";
import { apiRequest } from "@/services/APIHelper";
import { capitalizeWords, formatCurrency } from "@/services/GeneralHelper";
import Select from "@/components/Select";
import { getYears, months, timCodes } from "@/constants/general";
import { AppContext } from "@/contexts/AppContext";
import Button from "@/components/Button";
import moment from "moment";
import { toast } from "react-toastify";

// --- HELPERS ---
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getWeekOfMonth = (d) => Math.min(5, Math.ceil(d / 7));
const formatDateId = (ds) =>
  new Date(ds + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const getDow = (ds) =>
  ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][
    new Date(ds + "T00:00:00").getDay()
  ];
const today = moment().format("YYYY-MM-DD");

export default function RPDPage() {
  // --- STATE ---
  const { userData } = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(String(moment().year()));
  const [selectedTeam, setSelectedTeam] = useState("");

  const [plans, setPlans] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [level, setLevel] = useState("tim");

  // State untuk API Options (Akun & Summary)
  const [akunOptions, setAkunOptions] = useState([]);
  const [paguTim, setPaguTim] = useState(0);
  const [selectAkunOpen, setSelectAkunOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    code: "",
    desc: "",
    volume: "",
    amount: "",
    note: "",
    activity_name: "",
  });

  const fetchRoles = async () => {
    if (userData.role !== "kabiro") {
      const matchedTeamName = Object.keys(timCodes).find(
        (key) => timCodes[key] === userData.biro_code,
      );

      if (matchedTeamName) {
        setSelectedTeam(matchedTeamName);
      }
    }
  };
  // --- FETCHING DATA ---
  const fetchPlans = async () => {
    try {
      const apiMonth = selectedMonth + 1;
      const response = await apiRequest({
        url: `/pa/rpd/plans?team=${encodeURIComponent(selectedTeam)}&month=${apiMonth}&year=${Number(selectedYear)}`,
      });

      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      console.error("Gagal menarik data:", error);
    }
  };

  const fetchAkunOptions = async () => {
    try {
      const kodeTim = timCodes[selectedTeam];
      const periode = `${Number(selectedYear)}-${String(selectedMonth + 1).padStart(2, "0")}`;

      const response = await apiRequest({
        url: `/user/pagu/options?tim=${kodeTim}&periode=${periode}`,
      });

      if (response.success) {
        setAkunOptions(response.data || []);

        const total = response.data.reduce(
          (acc, curr) => acc + (Number(curr.pagu) || 0),
          0,
        );
        setPaguTim(total);
      }
    } catch (error) {
      console.error("Gagal mengambil data akun", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPlans();
    fetchAkunOptions();
    setSelectedWeek(1);
    setSelectedDate(null);
  }, [selectedMonth, Number(selectedYear), selectedTeam]);

  // --- ACTIONS ---
  const handleSavePlan = async (e) => {
    e.preventDefault();

    // Pastikan user sudah memilih dropdown akun
    if (!formData.code || !formData.activity_name) {
      alert("Pilih Kode Akun terlebih dahulu.");
      return;
    }

    const payload = {
      team_name: selectedTeam,
      activity_code: formData.code,
      activity_name: formData.activity_name, // Diambil dari pilihan dropdown
      start_date: formData.startDate,
      end_date: formData.endDate,
      description: formData.desc.trim(),
      volume: Number(formData.volume),
      amount: Number(formData.amount),
      note: formData.note.trim(),
    };

    try {
      const response = await apiRequest({
        url: editId ? `/pa/rpd/plans/${editId}` : `/pa/rpd/plans`,
        method: editId ? "PUT" : "POST",
        options: {
          body: payload,
        },
      });

      if (response.success) {
        await fetchPlans();
        setSelectedWeek(getWeekOfMonth(Number(formData.startDate.slice(-2))));
        setSelectedDate(formData.startDate);
        setIsModalOpen(false);
        toast.success("Data berhasil disimpan!");
      }
    } catch (error) {
      console.error("Gagal menyimpan rencana:", error);
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm("Hapus rencana ini?")) {
      try {
        const response = await apiRequest({
          url: `/pa/rpd/plans/${id}`,
          method: "DELETE",
        });

        if (response.success) {
          await fetchPlans();
          setSelectedDate(null);
          toast.success("Data berhasil dihapus!");
        }
      } catch (error) {
        console.error("Gagal menghapus rencana:", error);
      }
    }
  };

  // --- MEMOIZED VALUES ---
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      if (!p.start_date) return false;
      const d = new Date(p.start_date + "T00:00:00");
      return (
        p.team_name === selectedTeam &&
        d.getFullYear() === Number(selectedYear) &&
        d.getMonth() === selectedMonth
      );
    });
  }, [plans, selectedTeam, selectedMonth, Number(selectedYear)]);

  const summary = useMemo(() => {
    const pagu = paguTim; // 🔥 Menggunakan Pagu Dinamis dari DB
    const total = filteredPlans.reduce((sum, p) => sum + p.amount, 0);
    const rem = Math.max(0, pagu - total);
    const pct = pagu > 0 ? Math.min(100, (total / pagu) * 100) : 0;
    return { pagu, total, rem, pct };
  }, [selectedTeam, filteredPlans, paguTim]);

  const handleOpenModal = (id = null) => {
    if (id) {
      const p = plans.find((x) => x.id === id);
      setFormData({
        startDate: p.start_date,
        endDate: p.end_date,
        code: p.activity_code,
        activity_name: p.activity_name,
        volume: p.volume,
        desc: p.description,
        amount: p.amount,
        note: p.note || "",
      });
      setEditId(id);
    } else {
      const y = Number(selectedYear);
      const m = String(selectedMonth + 1).padStart(2, "0");
      setFormData({
        startDate: today,
        endDate: today,
        code: "",
        activity_name: "",
        volume: "",
        desc: "",
        amount: "",
        note: "",
      });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  // Generate Week Ranges
  const getWeekRange = (w) => {
    const last = getDaysInMonth(Number(selectedYear), selectedMonth);
    const a = (w - 1) * 7 + 1;
    const b = Math.min(w * 7, last);
    return [a, b];
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-10 font-sans transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 transition-colors">
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-xl gap-1 w-full md:w-auto">
          {[
            { id: "tim", label: "SUBSTANSI" },
            { id: "sum", label: "REKAP" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setLevel(tab.id);
              }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                level === tab.id
                  ? "bg-white dark:bg-blue-500 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      {level === "tim" && (
        <section className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.5fr_auto] gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              Bulan
            </label>
            <Select
              className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              options={months?.map((m, i) => ({
                label: m,
                value: i,
              }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              Tahun
            </label>
            <Select
              className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(String(e.target.value))}
              options={getYears()?.map((q) => ({
                label: String(q),
                value: String(q),
              }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              Tim
            </label>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              options={Object.keys(timCodes).map((q) => ({
                label: q,
                value: q,
              }))}
              disabled={userData.role === "tim" ? true : false}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => handleOpenModal()}
              className="w-full h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex justify-center items-center gap-2"
              icon={<Plus size={18} strokeWidth={3} />}
              disabled={userData.role === "kabiro" ? true : false}
            >
              Tambah Rencana
            </Button>
          </div>
        </section>
      )}

      {/* CONTENT GRID */}
      {level === "tim" && (
        <div className="flex flex-col xl:grid xl:grid-cols-[1fr_300px] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* SUMMARY ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Pagu Tim (POK)
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white mt-2">
                  {formatCurrency(summary.pagu)}
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-2">
                  Sesuai kepemilikan POK tim
                </div>
              </div>
              <div className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Rencana Bulan Ini
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white mt-2">
                  {formatCurrency(summary.total)}
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-2">
                  {filteredPlans.length} rencana
                </div>
              </div>
              <div className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Sisa Pagu
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                  {formatCurrency(summary.rem)}
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-2">
                  {summary.pct.toFixed(2).replace(".", ",")}% sudah direncanakan
                </div>
              </div>
            </div>

            {/* MINGGUAN */}
            <section className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
              <div className="mb-5">
                <h2 className="text-base font-black text-slate-800 dark:text-white">
                  Rencana per Minggu
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Klik minggu untuk melihat tanggal dan detail rencana.
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((w) => {
                  const [a, b] = getWeekRange(w);
                  if (a > getDaysInMonth(Number(selectedYear), selectedMonth))
                    return null;

                  const wp = filteredPlans.filter(
                    (p) =>
                      p.start_date &&
                      getWeekOfMonth(Number(p.start_date.slice(-2))) === w,
                  );
                  const amt = wp.reduce((s, p) => s + p.amount, 0);
                  const isActive = selectedWeek === w;

                  return (
                    <div
                      key={w}
                      onClick={() => {
                        setSelectedWeek(w);
                        setSelectedDate(null);
                      }}
                      className={`border rounded-2xl p-4 cursor-pointer transition-all ${isActive ? "border-blue-500 border-2 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm" : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-300 dark:hover:border-blue-500/50"}`}
                    >
                      <b className="text-sm text-slate-800 dark:text-white">
                        Minggu {w}
                      </b>
                      <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                        {a}–{b} {months[selectedMonth].slice(0, 3)}
                      </span>
                      <span className="block font-black text-slate-800 dark:text-white mt-3">
                        {formatCurrency(amt)}
                      </span>
                      <div className="text-[11px] font-medium text-slate-400 mt-1.5">
                        {wp.length} rencana
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* HARIAN */}
            <section className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
              <div className="mb-5">
                <h2 className="text-base font-black text-slate-800 dark:text-white">
                  Tanggal pada Minggu {selectedWeek}
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Klik tanggal untuk menampilkan detail.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {(() => {
                  const [a, b] = getWeekRange(selectedWeek);
                  const days = [];
                  for (let d = a; d <= b; d++) {
                    const ds = `${Number(selectedYear)}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const dp = filteredPlans.filter(
                      (p) => ds >= p.start_date && ds <= p.end_date,
                    );
                    const isActive = selectedDate === ds;

                    days.push(
                      <div
                        key={d}
                        onClick={() => setSelectedDate(ds)}
                        className={`border rounded-2xl p-3 min-h-[100px] cursor-pointer transition-all ${isActive ? "border-blue-500 border-2 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm" : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10"}`}
                      >
                        <div className="font-black text-sm text-slate-800 dark:text-white">
                          {String(d).padStart(2, "0")}{" "}
                          <span className="text-xs font-bold text-slate-400">
                            {months[selectedMonth].slice(0, 3)}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                          {getDow(ds)}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {dp.slice(0, 2).map((p, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-md px-2 py-1 text-[9px] font-bold"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              {p.activity_name.length > 15
                                ? p.activity_name.slice(0, 15) + "…"
                                : p.activity_name}
                            </span>
                          ))}
                          {dp.length > 2 && (
                            <span className="inline-flex items-center bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-md px-2 py-1 text-[9px] font-bold">
                              +{dp.length - 2}
                            </span>
                          )}
                        </div>
                      </div>,
                    );
                  }
                  return days;
                })()}
              </div>

              {/* DETAIL CARDS */}
              <div className="mt-5 flex flex-col gap-3">
                {(() => {
                  const details = filteredPlans.filter((p) =>
                    selectedDate
                      ? selectedDate >= p.start_date &&
                        selectedDate <= p.end_date
                      : p.start_date &&
                        getWeekOfMonth(Number(p.start_date.slice(-2))) ===
                          selectedWeek,
                  );

                  if (details.length === 0) {
                    return (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm font-medium">
                        Belum ada rencana pada{" "}
                        {selectedDate ? "tanggal" : "minggu"} ini.
                      </div>
                    );
                  }

                  return details.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1.5fr_1fr] gap-4 items-center border border-slate-200 dark:border-white/10 rounded-2xl p-4 bg-white dark:bg-white/5"
                    >
                      <div>
                        <b className="text-sm text-slate-800 dark:text-white">
                          {p.activity_name}
                        </b>
                        <div className="text-xs font-medium text-slate-500 mt-1.5">
                          {formatDateId(p.start_date)}{" "}
                          {p.start_date !== p.end_date &&
                            `- ${formatDateId(p.end_date)}`}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Kode Akun
                        </span>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1.5">
                          {p.activity_code}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Uraian
                        </span>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1.5 line-clamp-2">
                          {p.description}
                        </div>
                      </div>
                      <div className="md:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Jumlah
                        </span>
                        <div className="text-sm font-black text-slate-800 dark:text-white mt-1.5">
                          {formatCurrency(p.amount)}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </section>

            {/* TABEL */}
            <section className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 overflow-hidden">
              <div className="mb-5">
                <h2 className="text-base font-black text-slate-800 dark:text-white">
                  Daftar Rencana Tim
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {filteredPlans.length} rencana pada {months[selectedMonth]}{" "}
                  {Number(selectedYear)}
                </span>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/10">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Kode Akun
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Uraian Kegiatan
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Uraian Kebutuhan
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                        Jumlah Rencana
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                        Minggu
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {filteredPlans.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-8 text-center text-slate-500 text-sm font-medium"
                        >
                          Belum ada rencana pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      [...filteredPlans]
                        .sort((a, b) =>
                          a.start_date.localeCompare(b.start_date),
                        )
                        .map((p) => (
                          <tr
                            key={p.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-4 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {formatDateId(p.start_date)}
                              {p.start_date !== p.end_date && (
                                <>
                                  <br />
                                  <span className="text-[10px] text-slate-400">
                                    s.d. {formatDateId(p.end_date)}
                                  </span>
                                </>
                              )}
                            </td>
                            <td className="px-4 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                              {p.activity_code}
                            </td>
                            <td className="px-4 py-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                              {capitalizeWords(p.activity_name)}
                            </td>
                            <td className="px-4 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                              {p.description}
                            </td>
                            <td className="px-4 py-4 text-xs font-black text-slate-800 dark:text-white text-right">
                              {formatCurrency(p.amount)}
                            </td>
                            <td className="px-4 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-center">
                              {getWeekOfMonth(Number(p.start_date.slice(-2)))}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleOpenModal(p.id)}
                                  className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeletePlan(p.id)}
                                  className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="flex flex-col gap-6 xl:order-last order-first xl:sticky xl:top-6 self-start">
            {/* PROGRESS CARD */}
            <section className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-5">
                Ringkasan Pagu Tim
              </h3>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Total Pagu Tim (POK)
              </div>
              <div className="text-[22px] font-black text-slate-800 dark:text-white mt-1.5">
                {formatCurrency(summary.pagu)}
              </div>

              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden mt-5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.pct}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs mt-4">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Sudah direncanakan
                </span>
                <b className="text-slate-800 dark:text-white">
                  {formatCurrency(summary.total)}
                </b>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Sisa pagu
                </span>
                <b className="text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(summary.rem)}
                </b>
              </div>
            </section>

            {/* INFO CARD */}
            <section className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-5">
                <Info size={16} className="text-blue-500" /> Informasi Penting
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  "PIC hanya memilih kode akun/kegiatan yang menjadi kewenangan timnya.",
                  "PIC mengisi tanggal, kegiatan, uraian kebutuhan, dan jumlah rencana. Minggu ke- dihitung otomatis.",
                  "Total mingguan, bulanan, dan sisa pagu diperbarui otomatis setelah data disimpan.",
                ].map((txt, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0 leading-relaxed">
                      {txt}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* MODAL */}
      {level === "tim" && isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-[#0A111E]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-black text-slate-800 dark:text-white m-0">
                {editId ? "Ubah" : "Tambah"} Rencana Harian
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan}>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* RENTANG TANGGAL */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Rentang Tanggal *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      required
                      min={today}
                      className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      value={formData.startDate}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          startDate: newStartDate,
                          endDate:
                            prev.endDate < newStartDate
                              ? newStartDate
                              : prev.endDate,
                        }));
                      }}
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                      type="date"
                      required
                      min={formData.startDate || today}
                      className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 mt-1.5">
                    Pilih tanggal mulai & selesai kegiatan.
                  </div>
                </div>

                {/* TIM */}
                <div className="pl-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Tim
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-400 bg-slate-100 dark:bg-white/5 outline-none cursor-not-allowed"
                    value={selectedTeam}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Kode Akun / Kegiatan *
                  </label>
                  <Select
                    value={formData.code}
                    onChange={(e) => {
                      const val = e.target.value;
                      const selectedOption = akunOptions.find(
                        (opt) => opt.value === val,
                      );

                      setFormData({
                        ...formData,
                        code: val,
                        activity_name: selectedOption
                          ? selectedOption.label.split(" — ")[1]
                          : "",
                      });
                    }}
                    options={akunOptions}
                    isOpen={selectAkunOpen}
                    setIsOpen={setSelectAkunOpen}
                    required
                  />
                </div>

                {/* URAIAN KEBUTUHAN */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Uraian Kebutuhan Dana *
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="w-full border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    value={formData.desc}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                  ></textarea>
                </div>

                {/* VOLUME */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Volume *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Contoh: 1, 10, dll"
                    className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={formData.volume}
                    onChange={(e) =>
                      setFormData({ ...formData, volume: e.target.value })
                    }
                  />
                </div>

                {/* JUMLAH RENCANA */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Jumlah Nilai Rencana (Rupiah) *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={
                      formData.amount
                        ? formData.amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, amount: rawValue });
                    }}
                  />
                </div>

                {/* KETERANGAN */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    placeholder="Opsional"
                    className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* FOOTER MODAL */}
              <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-10 border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {level === "sum" && <RPDMonitorPage />}
    </div>
  );
}
