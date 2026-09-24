import React, { useState, useRef, useEffect } from "react";
import {
  PieChart,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Coffee,
  BriefcaseBusiness,
  CircleDollarSign,
} from "lucide-react";
import { apiRequest } from "@/services/APIHelper";

export default function PersonnelExpenditure({ gradeFilter = "pejabat" }) {
  const [gajiData, setGajiData] = useState([]);
  const [tunkinData, setTunkinData] = useState([]);
  const [uangMakanData, setUangMakanData] = useState([]);
  const [uangLemburData, setUangLemburData] = useState([]);
  const [ppnpnData, setPpnpnData] = useState([]);
  const [lsData, setLsData] = useState([]);

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MEI",
    "JUN",
    "JUL",
    "AGS",
    "SEP",
    "OKT",
    "NOV",
    "DES",
  ];

  const currentMonth = months[new Date().getMonth()];

  const filterByGrade = (dataArray) => {
    if (!dataArray) return [];

    const pejabatIds = [
      "menteri",
      "wakil_menteri",
      "ajudan",
      "staf_khusus",
      "staf_ahli",
      "sekjen",
      "dom",
      "dowm",
    ];
    const pegawaiIds = [
      "rokeu",
      "romas",
      "rokum",
      "rosdm",
      "rocan",
      "roum",
      "roks",
      "ppsdm",
      "poltek",
    ];

    return dataArray.filter((row) => {
      if (gradeFilter === "pejabat") {
        return pejabatIds.includes(row.category_id);
      }
      if (gradeFilter === "pegawai-pns") {
        return (
          pegawaiIds.includes(row.category_id) &&
          (!row.employee_status || row.employee_status === "pns")
        );
      }
      if (gradeFilter === "pegawai-pppk") {
        return (
          pegawaiIds.includes(row.category_id) &&
          (!row.employee_status || row.employee_status === "pppk")
        );
      }
      return true;
    });
  };

  useEffect(() => {
    fetchMonitor();
  }, []);

  const fetchMonitor = async () => {
    try {
      const data = await apiRequest({
        url: `/archive/monitor/belanja-pegawai`,
      });

      if (data.success) {
        setTunkinData(data.data?.tukin || []);
        setGajiData(data.data?.gaji || []);
        setUangMakanData(data.data?.uang_makan || []);
        setUangLemburData(data.data?.uang_lembur || []);
        setPpnpnData(data.data?.ppnpn_induk || []);
        setLsData(data.data?.ls_bendahara || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderStatus = (no, status) => {
    if (!status || status === "Belum") {
      return (
        <div
          className="flex items-center justify-center gap-2"
          title="Belum Diajukan"
        >
          <span className="text-xs font-bold text-slate-300 w-10 text-right">
            -
          </span>
          <XCircle size={18} className="text-rose-500" strokeWidth={2.5} />
        </div>
      );
    }
    const isSP2D = status === "SP2D";
    const StatusIcon = isSP2D ? CheckCircle2 : Clock;
    const iconColor = isSP2D ? "text-emerald-500" : "text-amber-500";

    return (
      <div className="flex items-center justify-center gap-2" title={status}>
        <span className="text-xs font-bold text-slate-700 dark:text-white w-10 text-right">
          {no !== "-" ? no : ""}
        </span>
        <StatusIcon size={18} className={iconColor} strokeWidth={2.5} />
      </div>
    );
  };

  const filteredGaji = filterByGrade(gajiData);
  const filteredTukin = filterByGrade(tunkinData);
  const filteredPpnpn =
    gradeFilter === "pegawai-pns" ? [] : filterByGrade(ppnpnData);
  const filteredMakan = filterByGrade(uangMakanData);
  const filteredLembur = filterByGrade(uangLemburData);
  const filteredLs = filterByGrade(lsData);

  const TableSection = ({ title, data }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          const currentMonthElement = scrollRef.current.querySelector(
            `.month-${currentMonth}`,
          );
          if (currentMonthElement) {
            scrollRef.current.scrollLeft = currentMonthElement.offsetLeft - 180;
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [currentMonth, data]);

    return (
      <div className="bg-white dark:bg-transparent rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-100 dark:border-white/10">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
            {title}
          </h3>
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-auto custom-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-[#111C30]/80">
              <tr className="border-b border-slate-100 dark:border-white/10">
                <th className="sticky left-0 bg-white dark:bg-[#0A111E] z-10 px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider min-w-[180px] border-r border-slate-50 dark:border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  Kategori
                </th>
                {months.map((m) => (
                  <th
                    key={m}
                    className={`month-${m} px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-center ${
                      m === currentMonth
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-500/10"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  {/* 🔥 STICKY CELL - Samakan dark background-nya dengan container */}
                  <td className="sticky left-0 bg-white dark:bg-[#0A111E] z-10 px-5 py-4 text-xs font-bold text-slate-700 dark:text-slate-200 border-r border-slate-50 dark:border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    {row.name}
                  </td>
                  {months.map((m) => (
                    <td
                      key={m}
                      className={`px-5 py-3 text-center ${
                        m === currentMonth
                          ? "bg-blue-50/10 dark:bg-blue-500/5"
                          : ""
                      }`}
                    >
                      {renderStatus(row.data[m]?.no, row.data[m]?.status)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Total dokumen {title}: {data.length}
        </div>
      </div>
    );
  };

  const getStats = (dataArray) => {
    let diproses = 0;
    let sp2d = 0;
    dataArray.forEach((row) => {
      const cell = row.data[currentMonth];
      if (cell && cell.status === "Diproses") diproses++;
      if (cell && cell.status === "SP2D") sp2d++;
    });
    return {
      target: dataArray.length,
      diproses,
      sp2d,
      totalSelesai: diproses + sp2d,
    };
  };

  const statsGaji = getStats(filteredGaji);
  const statsTukin = getStats(filteredTukin);
  const statsPpnpn = getStats(filteredPpnpn);
  const statsMakan = getStats(filteredMakan);
  const statsLembur = getStats(filteredLembur);
  const statsLs = getStats(filteredLs);

  const totalTarget =
    statsGaji.target +
    statsTukin.target +
    statsPpnpn.target +
    statsMakan.target +
    statsLembur.target +
    statsLs.target;
  const totalDiproses =
    statsGaji.diproses +
    statsTukin.diproses +
    statsPpnpn.diproses +
    statsMakan.diproses +
    statsLs.diproses;
  const totalSP2D =
    statsGaji.sp2d +
    statsTukin.sp2d +
    statsPpnpn.sp2d +
    statsMakan.sp2d +
    statsLembur.sp2d +
    statsLs.sp2d;
  const totalSelesai = totalDiproses + totalSP2D;

  const percentSelesai =
    totalTarget > 0 ? Math.round((totalSelesai / totalTarget) * 100) : 0;

  // Kalkulasi titik berhenti (stops) untuk gradasi diagram Donut
  const sp2dStop = totalTarget > 0 ? (totalSP2D / totalTarget) * 100 : 0;
  const diprosesStop =
    totalTarget > 0 ? sp2dStop + (totalDiproses / totalTarget) * 100 : 0;

  // Format persentase untuk legend UI
  const pctDiproses =
    totalTarget > 0 ? ((totalDiproses / totalTarget) * 100).toFixed(1) : 0;
  const pctSP2D =
    totalTarget > 0 ? ((totalSP2D / totalTarget) * 100).toFixed(1) : 0;

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 items-start">
      {/* KIRI - SCROLLABLE TABLES */}
      <div
        className="w-full xl:w-2/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {filteredGaji.length > 0 && (
          <TableSection title="GAJI INDUK" data={filteredGaji} />
        )}
        {filteredTukin.length > 0 && (
          <TableSection title="TUNJANGAN KINERJA" data={filteredTukin} />
        )}
        {filteredPpnpn.length > 0 && (
          <TableSection title="PPNPN" data={filteredPpnpn} />
        )}
        {filteredMakan.length > 0 && (
          <TableSection title="UANG MAKAN" data={filteredMakan} />
        )}
        {filteredLembur.length > 0 && (
          <TableSection title="UANG LEMBUR" data={filteredLembur} />
        )}
        {filteredLs.length > 0 && (
          <TableSection title="LS BENDAHARA" data={filteredLs} />
        )}
      </div>

      {/* KANAN - FIXED / STICKY PANEL */}
      <div className="w-full xl:w-1/3 sticky top-0 flex flex-col gap-6">
        <div className="bg-white dark:bg-[#0A111E] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Ringkasan Status
            </h3>
            <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
              {currentMonth} 2026
            </span>
          </div>

          <div className="flex justify-center mb-8">
            <div
              className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner"
              // Catatan: Jika warna abu-abu (#f1f5f9) pada diagram terasa terlalu terang di dark mode, 
              // lu bisa ganti dengan variable CSS atau kondisi ternary state dark mode (misal: #1e293b)
              style={{
                background: `conic-gradient(#10b981 0% ${sp2dStop}%, #3b82f6 ${sp2dStop}% ${diprosesStop}%, #f1f5f9 ${diprosesStop}% 100%)`,
              }}
            >
              {/* Lingkaran dalam Donut Chart */}
              <div className="absolute w-[120px] h-[120px] bg-white dark:bg-[#0A111E] rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  {percentSelesai}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                  Selesai
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {totalSelesai} dari {totalTarget} target
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-white/10 pb-6 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>{" "}
                Diproses
              </span>
              <div className="flex gap-4 font-bold">
                <span className="text-slate-800 dark:text-white">{totalDiproses}</span>
                <span className="text-slate-400 dark:text-slate-500 w-10 text-right">
                  {pctDiproses}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
                SP2D
              </span>
              <div className="flex gap-4 font-bold">
                <span className="text-slate-800 dark:text-white">{totalSP2D}</span>
                <span className="text-slate-400 dark:text-slate-500 w-10 text-right">
                  {pctSP2D}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-4">
              Rincian Dokumen Bulan Ini
            </p>
            <div className="flex flex-col gap-3">
              {statsGaji.target > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <BriefcaseBusiness size={16} className="text-blue-500" />{" "}
                    Gaji Induk
                  </span>
                  <span className="text-xs">
                    {statsGaji.totalSelesai} / {statsGaji.target}
                  </span>
                </div>
              )}
              {statsTukin.target > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <PieChart size={16} className="text-emerald-500" />{" "}
                    Tunjangan Kinerja
                  </span>
                  <span className="text-xs">
                    {statsTukin.totalSelesai} / {statsTukin.target}
                  </span>
                </div>
              )}
              {statsPpnpn.target > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-amber-500" /> PPNPN
                  </span>
                  <span className="text-xs">
                    {statsPpnpn.totalSelesai} / {statsPpnpn.target}
                  </span>
                </div>
              )}
              {statsMakan.target > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Coffee size={16} className="text-rose-400" /> Uang Makan
                  </span>
                  <span className="text-xs">
                    {statsMakan.totalSelesai} / {statsMakan.target}
                  </span>
                </div>
              )}
              {statsLembur.target > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-purple-500" /> Uang Lembur
                  </span>
                  <span className="text-xs">
                    {statsLembur.totalSelesai} / {statsLembur.target}
                  </span>
                </div>
              )}
              {statsLs.target > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <CircleDollarSign size={16} className="text-purple-500" />{" "}
                    LS Bendahara
                  </span>
                  <span className="text-xs">
                    {statsLs.totalSelesai} / {statsLs.target}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
