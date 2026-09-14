import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Coins,
  CalendarDays,
  Flag,
  Users,
  CheckCircle2,
  Info,
} from "lucide-react";
import { apiRequest } from "@/services/APIHelper";
import { getYears, months, palette, timCodes } from "@/constants/general";
import { capitalizeWords, formatCurrency } from "@/services/GeneralHelper";
import Select from "@/components/Select";
import { AppContext } from "@/contexts/AppContext";

export default function RPDMonitorPage() {
  const currentDate = new Date();
  const { userData } = useContext(AppContext);
  const [rawData, setRawData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
  );
  const [selectedTeam, setSelectedTeam] = useState("");
  const [inputTeam, setInputTeam] = useState(0);

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

  const fetchMonitorData = async () => {
    try {
      const apiMonth = selectedMonth + 1;
      const response = await apiRequest({
        url: `/pa/rpd/plans?month=${apiMonth}&year=${selectedYear}`,
        method: "GET",
      });

      if (response.success) {
        setRawData(response.data || []);
      }
    } catch (error) {
      console.error("Gagal menarik data monitoring:", error);
    }
  };

  useEffect(() => {
    fetchMonitorData();
  }, [selectedMonth, selectedYear]);

  const ALL_TEAMS = [
    "Akuntansi & Pelaporan",
    "Tata Usaha",
    "PTUK",
    "Pelaksanaan Anggaran",
    "Barang Milik Negara",
  ];

  const teamData = useMemo(() => {
    const grouped = {};
    let grandTotal = 0;
    let input = 0;

    ALL_TEAMS.forEach((team, index) => {
      grouped[team] = {
        total: 0,
        rows: [],
        color: palette[index % palette.length],
        percent: 0,
      };
    });

    let nextColorIndex = ALL_TEAMS.length;
    rawData.forEach((item) => {
      const team = item.team_name;
      if (!grouped[team]) {
        grouped[team] = {
          total: 0,
          rows: [],
          color: palette[nextColorIndex % palette.length],
          percent: 0,
        };
        nextColorIndex++;
      }
      grouped[team].rows.push(item);
      grouped[team].total += Number(item.amount);
      grandTotal += Number(item.amount);
    });

    Object.keys(grouped).forEach((team) => {
      if (grouped[team].total == 0) {
        setInputTeam(input++);
      }
      grouped[team].percent =
        grandTotal > 0 ? (grouped[team].total / grandTotal) * 100 : 0;
    });
    return grouped;
  }, [rawData]);

  const order = Object.keys(teamData);
  const maxTotal =
    order.length > 0 ? Math.max(...order.map((k) => teamData[k].total)) : 0;

  useEffect(() => {
    fetchRoles();
    if (order.length > 0 && (!selectedTeam || !order.includes(selectedTeam))) {
      setSelectedTeam(order[0]);
    }
  }, [order, selectedTeam]);

  const currentTeamData = teamData[selectedTeam] || {
    total: 0,
    rows: [],
    percent: 0,
    color: "#ccc",
  };
  const summaryTotal = formatCurrency(currentTeamData.total);
  const summaryAvg =
    currentTeamData.rows.length > 0
      ? formatCurrency(currentTeamData.total / currentTeamData.rows.length)
      : "Rp 0";
  const grandTotalSemua = rawData.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;
  const currentWeekNum = isCurrentMonth
    ? Math.min(5, Math.ceil(today.getDate() / 7))
    : 1;

  const currentWeekTotal = rawData
    .filter((p) => {
      if (!p.start_date) return false;
      const d = new Date(p.start_date);
      const week = Math.min(5, Math.ceil(d.getDate() / 7));
      return week === currentWeekNum;
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="w-full bg-transparent font-sans">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_360px] gap-4 mb-4">
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 transition-colors">
          <h3 className="m-0 mb-4 text-base font-bold text-[#21457e] dark:text-white">
            Periode Monitoring
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#446089] dark:text-slate-400 mb-1.5">
                Bulan
              </label>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full h-[46px] border border-[#cfdef2] dark:border-white/10 bg-white dark:bg-[#111C30] text-[#27466f] dark:text-white rounded-xl px-3 outline-none focus:border-[#1c78ff] focus:ring-[3px] focus:ring-[#1c78ff]/10 dark:focus:ring-blue-500/20 transition-colors"
                options={months?.map((m, i) => ({
                  label: m,
                  value: i,
                }))}
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#446089] dark:text-slate-400 mb-1.5">
                Tahun
              </label>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full h-[46px] border border-[#cfdef2] dark:border-white/10 bg-white dark:bg-[#111C30] text-[#27466f] dark:text-white rounded-xl px-3 outline-none focus:border-[#1c78ff] focus:ring-[3px] focus:ring-[#1c78ff]/10 dark:focus:ring-blue-500/20 transition-colors"
                options={getYears()?.map((q) => ({
                  label: String(q),
                  value: String(q),
                }))}
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 transition-colors">
          <h3 className="m-0 mb-4 text-base font-bold text-[#21457e] dark:text-white">
            Update Data
          </h3>
          <p className="m-0 mb-2.5 text-sm leading-relaxed text-[#426082] dark:text-slate-400">
            Data bersumber dari input PIC tim dan diperbarui secara otomatis.
          </p>
          <small className="text-xs text-[#8698b2] dark:text-slate-500">
            Terakhir ditarik: {new Date().toLocaleTimeString("id-ID")} WIB
          </small>
        </section>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 flex gap-4 items-start transition-colors">
          <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[#edf5ff] dark:bg-blue-500/10 text-[#1c78ff] dark:text-blue-400 flex items-center justify-center transition-colors">
            <Coins size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#496689] dark:text-slate-400 leading-tight">
              Total Rencana Bulan Ini
            </div>
            <div className="text-[20px] font-black text-[#173a77] dark:text-white mt-1.5">
              {formatCurrency(grandTotalSemua)}
            </div>
            <div className="text-[12px] font-bold text-[#28b46f] dark:text-emerald-400 mt-1.5">
              {rawData.length} total rencana
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 flex gap-4 items-start transition-colors">
          <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[#edf5ff] dark:bg-blue-500/10 text-[#1c78ff] dark:text-blue-400 flex items-center justify-center transition-colors">
            <CalendarDays size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#496689] dark:text-slate-400 leading-tight">
              Total Minggu Berjalan
              <br />
              (Minggu ke-{currentWeekNum})
            </div>
            <div className="text-[20px] font-black text-[#173a77] dark:text-white mt-1.5">
              {formatCurrency(currentWeekTotal)}
            </div>
            <div className="text-[12px] font-bold text-[#7c90ad] dark:text-slate-500 mt-1.5">
              Berdasarkan tanggal kegiatan
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 flex gap-4 items-start transition-colors">
          <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[#fff1f1] dark:bg-rose-500/10 text-[#ff5b5b] dark:text-rose-400 flex items-center justify-center transition-colors">
            <Flag size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#496689] dark:text-slate-400 leading-tight">
              Kegiatan Terdaftar
            </div>
            <div className="text-[20px] font-black text-[#173a77] dark:text-white mt-1.5">
              {rawData.length} kegiatan
            </div>
            <div className="text-[12px] font-bold text-[#ff6038] dark:text-rose-400 mt-1.5">
              Untuk seluruh tim
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 flex gap-4 items-start transition-colors">
          <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[#edf5ff] dark:bg-blue-500/10 text-[#1c78ff] dark:text-blue-400 flex items-center justify-center transition-colors">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#496689] dark:text-slate-400 leading-tight">
              Tim Sudah Input
            </div>
            <div className="text-[20px] font-black text-[#173a77] dark:text-white mt-1.5">
              {inputTeam} tim
            </div>
            <div className="text-[12px] font-bold text-[#28b46f] dark:text-emerald-400 mt-1.5">
              Bulan ini
            </div>
          </div>
        </section>
      </div>

      {/* MIDDLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_minmax(330px,1fr)] gap-4 mb-4">
        {/* BAR CHART */}
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 pb-2 transition-colors">
          <h3 className="m-0 mb-4 text-base font-bold text-[#21457e] dark:text-white">
            Total Rencana per Tim
          </h3>
          {order.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-[#7084a1] dark:text-slate-500 font-medium border border-dashed border-[#dce7f5] dark:border-white/10 rounded-xl">
              Belum ada data rencana bulan ini.
            </div>
          ) : (
            <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 items-end min-h-[220px] pt-5 px-2 border-t border-[#edf3fb] dark:border-white/10 relative overflow-x-auto">
              <div className="absolute left-0 right-0 top-[72px] border-t border-[#eef3fa] dark:border-white/5 pointer-events-none"></div>
              <div className="absolute left-0 right-0 top-[138px] border-t border-[#eef3fa] dark:border-white/5 pointer-events-none"></div>

              {order.map((team) => {
                const item = teamData[team];
                const height = (item.total / maxTotal) * 120 + 20;
                const isActive = team === selectedTeam;

                return (
                  <div
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className="text-center cursor-pointer select-none group z-10 w-full min-w-[80px]"
                  >
                    <div className="text-[10px] sm:text-[12px] font-extrabold text-[#2957a0] dark:text-slate-300 mb-2 min-h-[20px] break-words">
                      {formatCurrency(item.total)}
                    </div>
                    <div
                      className={`w-[60%] sm:w-[74%] mx-auto rounded-t-xl transition-all duration-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] group-hover:-translate-y-0.5 ${isActive ? "" : "bg-[#9ecbff] dark:bg-slate-700/50"}`}
                      style={{
                        height: `${height}px`,
                        background: isActive ? item.color : undefined,
                      }}
                    ></div>
                    <div
                      className="mt-2.5 text-[10px] sm:text-[12px] font-black text-[#173f81] dark:text-slate-200 truncate px-1"
                      title={team}
                    >
                      {team}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* DONUT CHART */}
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 flex flex-col transition-colors">
          <h3 className="m-0 mb-3 text-base font-bold text-[#21457e] dark:text-white">
            Kontribusi Rencana per Tim
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 items-center h-full pb-2">
            {/* Kiri: Donut Chart */}
            <div className="relative mx-auto">
              <div
                className="w-[170px] h-[170px] rounded-full my-2 relative"
                style={{
                  background: `conic-gradient(${order
                    .map((t, i, arr) => {
                      let start = 0;
                      for (let j = 0; j < i; j++)
                        start += teamData[arr[j]].percent;
                      let end = start + teamData[t].percent;
                      return `${teamData[t].color} ${start}% ${end}%`;
                    })
                    .join(", ")})`,
                }}
              >
                <div className="absolute inset-[28px] bg-white dark:bg-[#0A111E] rounded-full shadow-[inset_0_0_0_1px_#edf3fb] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-colors"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center font-black text-[#29487a] dark:text-white">
                <b className="text-[16px]">{formatCurrency(grandTotalSemua)}</b>
                <span className="text-[12px] font-bold mt-1 text-[#29487a] dark:text-slate-400">
                  Total
                </span>
              </div>
            </div>

            {/* Kanan: List Dot, Nominal & Persentase */}
            <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {order.map((team) => {
                const item = teamData[team];
                return (
                  <div
                    key={`val-${team}`}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div
                      className="w-4 h-4 shrink-0 rounded-full"
                      style={{ background: item.color }}
                    ></div>

                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      <b className="text-[#21437f] dark:text-slate-200 text-right">
                        {formatCurrency(item.total)}
                      </b>
                      <span className="text-[#7084a1] dark:text-slate-500 font-medium w-9 text-right">
                        {String(item.percent.toFixed(1)).replace(".", ",")}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 pt-4 border-t border-[#edf3fb] dark:border-white/10">
            {order.map((team) => {
              const item = teamData[team];
              return (
                <div
                  key={`label-${team}`}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <div
                    className="w-3 h-3 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  ></div>
                  <span className="text-[#21437f] dark:text-slate-300">
                    {team}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_320px] gap-4">
        {/* TABLE */}
        <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 min-w-0 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-4">
            <div>
              <h3 className="m-0 text-base font-bold text-[#21457e] dark:text-white">
                Rincian Rencana — {selectedTeam || "Tim"}
              </h3>
              <div className="text-[14px] text-[#6f85a5] dark:text-slate-400 mt-1.5">
                Menampilkan rincian rencana untuk tim yang dipilih pada diagram
                batang.
              </div>
            </div>
            {selectedTeam && (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef5ff] dark:bg-blue-500/10 text-[#1d73ed] dark:text-blue-400 px-3 py-2 text-[13px] font-extrabold whitespace-nowrap">
                Tim Terpilih: <span>{selectedTeam}</span>
              </div>
            )}
          </div>

          <div className="border border-[#dfe9f7] dark:border-white/10 rounded-2xl overflow-auto max-h-[420px] bg-white dark:bg-transparent custom-scrollbar transition-colors">
            <table className="w-full min-w-[800px] border-collapse">
              <thead className="bg-[#f5f9ff] dark:bg-white/5 text-[#4b6b96] dark:text-slate-400 text-xs text-left sticky top-0 z-10 shadow-[0_1px_0_#dce7f5] dark:shadow-[0_1px_0_rgba(255,255,255,0.05)] transition-colors">
                <tr>
                  <th className="px-3 py-3.5 font-bold w-[50px]">No</th>
                  <th className="px-3 py-3.5 font-bold w-[100px]">Kegiatan</th>
                  <th className="px-3 py-3.5 font-bold w-[70px]">Tanggal</th>
                  <th className="px-3 py-3.5 font-bold w-[100px]">Uraian</th>
                  <th className="px-3 py-3.5 font-bold w-[120px] text-right">
                    Jumlah Rencana
                  </th>
                  <th className="px-3 py-3.5 font-bold w-[150px] text-center">Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf3fb] dark:divide-white/5">
                {currentTeamData.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-[#7084a1] dark:text-slate-500 font-medium"
                    >
                      Pilih tim pada grafik batang untuk melihat data.
                    </td>
                  </tr>
                ) : (
                  currentTeamData.rows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-[#f9fbff] dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 text-[13px] text-[#35557f] dark:text-slate-400 align-top">
                        {idx + 1}
                      </td>
                      <td className="p-3 text-[13px] text-[#35557f] dark:text-slate-300 align-top font-semibold">
                        {capitalizeWords(row.activity_name)}
                      </td>
                      <td className="p-3 text-[13px] text-[#35557f] dark:text-slate-300 align-top">
                        {row.start_date}{" "}
                        {row.start_date !== row.end_date && (
                          <>
                            <br />
                            <span className="text-[#8698b2] dark:text-slate-500 text-[11px]">
                              s.d. {row.end_date}
                            </span>
                          </>
                        )}
                      </td>
                      <td className="p-3 text-[13px] text-[#35557f] dark:text-slate-300 align-top">
                        {row.description}
                      </td>
                      <td className="p-3 text-[13px] text-[#1a488d] dark:text-blue-400 font-extrabold align-top text-right whitespace-nowrap">
                        Rp {Number(row.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-[13px] text-[#35557f] dark:text-slate-400 align-top text-center">
                        {row.activity_code}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SIDEBAR INFO */}
        <aside className="flex flex-col gap-4">
          <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 transition-colors">
            <h3 className="m-0 mb-4 text-base font-bold text-[#21457e] dark:text-white">
              Ringkasan Tim Terpilih
            </h3>
            <div className="text-[16px] font-black text-[#204280] dark:text-blue-400 mb-3">
              {selectedTeam || "-"}
            </div>
            <div className="flex justify-between items-center gap-3 mt-2.5 text-[14px] text-[#486687] dark:text-slate-300">
              <span className="font-medium text-[#486687] dark:text-slate-400">
                Total Rencana Tim
              </span>
              <b className="font-bold">{summaryTotal}</b>
            </div>
            <div className="flex justify-between items-center gap-3 mt-2.5 text-[14px] text-[#486687] dark:text-slate-300">
              <span className="font-medium text-[#486687] dark:text-slate-400">
                Jumlah Kegiatan
              </span>
              <b className="font-bold">
                {currentTeamData.rows.length} kegiatan
              </b>
            </div>
            <div className="flex justify-between items-center gap-3 mt-2.5 text-[14px] text-[#486687] dark:text-slate-300">
              <span className="font-medium text-[#486687] dark:text-slate-400">
                Rata-rata per Kegiatan
              </span>
              <b className="font-bold">{summaryAvg}</b>
            </div>
          </section>

          <section className="bg-white dark:bg-[#0A111E] border border-[#dce7f5] dark:border-white/10 rounded-[18px] shadow-[0_10px_28px_rgba(24,68,120,.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-5 transition-colors">
            <h3 className="m-0 mb-4 text-base font-bold text-[#21457e] dark:text-white flex items-center gap-2">
              <Info size={18} className="text-[#1c78ff] dark:text-blue-400" />{" "}
              Informasi Penting
            </h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-[28px_1fr] gap-2.5 items-start">
                <div className="w-[28px] h-[28px] rounded-full bg-[#eaf3ff] dark:bg-blue-500/10 text-[#1d73ed] dark:text-blue-400 flex items-center justify-center font-black text-[12px] mt-0.5">
                  1
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-[#5d7698] dark:text-slate-400">
                  Klik pada diagram batang untuk melihat rincian rencana tim
                  lainnya.
                </p>
              </div>
              <div className="grid grid-cols-[28px_1fr] gap-2.5 items-start">
                <div className="w-[28px] h-[28px] rounded-full bg-[#eaf3ff] dark:bg-blue-500/10 text-[#1d73ed] dark:text-blue-400 flex items-center justify-center font-black text-[12px] mt-0.5">
                  2
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-[#5d7698] dark:text-slate-400">
                  Tabel di bawah menampilkan detail rencana bulan ini untuk tim
                  yang dipilih.
                </p>
              </div>
              <div className="grid grid-cols-[28px_1fr] gap-2.5 items-start">
                <div className="w-[28px] h-[28px] rounded-full bg-[#eaf3ff] dark:bg-blue-500/10 text-[#1d73ed] dark:text-blue-400 flex items-center justify-center font-black text-[12px] mt-0.5">
                  3
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-[#5d7698] dark:text-slate-400">
                  Kolom rincian ditampilkan dalam format detail kegiatan,
                  tanggal, uraian, jumlah rencana, akun, dan status input.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
