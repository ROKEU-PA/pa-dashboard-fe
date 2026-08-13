import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useFetchIKPAV2 } from "./hooks/useFetchIKPAV2";
import moment from "moment";

export default function IkpaV2Page() {
  const [level, setLevel] = useState("kl"); // kl, e1, sat
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [filter, setFilter] = useState({
    year: moment().year(),
    month: "",
  });

  const {
    data: dataTable,
    refetch,
    loading,
    meta
  } = useFetchIKPAV2({
    level: level,
    month: filter?.month,
    year: filter?.year,
  });

  useEffect(() => {
    refetch();
  }, [level]);

  const fmt = (n) =>
    (n || 0).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getGrade = (n) => {
    if (n > 95) return "Sangat Baik";
    if (n >= 89) return "Baik";
    if (n >= 70) return "Cukup";
    return "Kurang";
  };

  const getBadgeStyle = (n) => {
    if (n > 95)
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200";
    if (n >= 89)
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200";
    if (n >= 70)
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200";
    return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200";
  };

  // Logic Perhitungan Data
  const { avgNilai, countAttention, highest, indikatorAvgs, filteredData } =
    useMemo(() => {
      const all = dataTable || [];

      // Perhitungan Rata-rata dari SELURUH data di level ini (mengabaikan filter pencarian)
      const totalNilai = all.reduce((sum, item) => sum + item.nilai, 0);
      const avgNilai = all.length > 0 ? totalNilai / all.length : 0;

      const countAttention = all.filter((x) => x.nilai < 89).length;
      const highest = [...all].sort((a, b) => b.nilai - a.nilai)[0] || {};

      // Rata-rata 7 Indikator
      const keys = [
        "revisi",
        "deviasi",
        "penyerapan",
        "kontraktual",
        "tagihan",
        "uptup",
        "output",
      ];
      const indikatorAvgs = keys.map((k) => {
        const validVals = all
          .map((x) => x[k])
          .filter((v) => v !== null && v !== undefined);
        const avg =
          validVals.length > 0
            ? validVals.reduce((s, x) => s + x, 0) / validVals.length
            : 0;
        return { key: k, avg };
      });

      // Data yang difilter untuk Tabel
      let filtered = [...all].sort((a, b) => b.nilai - a.nilai);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((x) =>
          (x.kode + " " + x.nama).toLowerCase().includes(q),
        );
      }
      if (gradeFilter) {
        filtered = filtered.filter((x) => getGrade(x.nilai) === gradeFilter);
      }

      return {
        avgNilai,
        countAttention,
        highest,
        indikatorAvgs,
        filteredData: filtered,
      };
    }, [dataTable, search, gradeFilter]);

  const levelName =
    level === "kl"
      ? "Kementerian/Lembaga"
      : level === "e1"
        ? "Unit Eselon I"
        : "Satuan Kerja";

  return (
    <div className="w-full flex flex-col gap-5 pb-10 bg-[#f4f7fa] dark:bg-transparent min-h-screen font-sans transition-colors">
      {/* 1. KONTROL TABS & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 transition-colors">
        {/* Segemented Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-xl gap-1 w-full md:w-auto">
          {[
            { id: "kl", label: "Kementerian" },
            { id: "e1", label: "Unit Eselon I" },
            { id: "sat", label: "Satuan Kerja" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setLevel(tab.id);
                setSearch("");
                setGradeFilter("");
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

        {/* Search & Select */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-3 text-slate-400"
              size={16}
            />
            <input
              type="text"
              className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Cari kode atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={level === "kl"}
            />
          </div>
          <select
            className="w-full sm:w-48 px-4 py-2.5 bg-slate-50 dark:bg-[#0A111E] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            disabled={level === "kl"}
          >
            <option value="">Semua Predikat</option>
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Baik">Baik</option>
            <option value="Cukup">Cukup</option>
            <option value="Kurang">Kurang</option>
          </select>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Target IKPA 2026",
            value: fmt(meta.target),
            sub: "Target tahunan",
          },
          {
            label: "Nilai IKPA",
            value: fmt(avgNilai),
            sub: getGrade(avgNilai),
            isGrade: true,
          },
          { label: "Jumlah Entitas", value: dataTable.length, sub: levelName },
          {
            label: "Nilai Tertinggi",
            value: fmt(highest.nilai),
            sub: highest.nama || "-",
          },
          {
            label: "Kategori Cukup/Kurang",
            value: countAttention,
            sub: "Nilai di bawah 89",
            alert: countAttention > 0,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111C30]/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 flex flex-col justify-between backdrop-blur-md transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {card.label}
            </span>
            <strong
              className={`text-2xl lg:text-3xl font-black mt-3 mb-1 ${card.alert ? "text-red-500" : "text-slate-800 dark:text-white"}`}
            >
              {card.value}
            </strong>
            <span
              className={`text-[11px] font-medium line-clamp-1 ${card.isGrade ? "text-blue-500 dark:text-blue-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}
            >
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* 3. CHARTS & INDIKATOR PANEL (Hanya muncul jika level === 'kl') */}
      {level === "kl" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* DONUT CHART (4 Kolom) */}
          <div className="xl:col-span-4 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 flex flex-col max-h-[60vh] 2xl:max-h-[calc(100vh-380px)] items-center text-center transition-colors">
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-8 self-start">
              Nilai IKPA Rata-rata
            </h2>
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center relative shadow-inner mb-4"
              style={{
                background: `conic-gradient(#308BFD 0 ${avgNilai}%, #e2e8f0 ${avgNilai}% 100%)`,
              }}
            >
              <div className="absolute w-[135px] h-[135px] bg-white dark:bg-[#111C30] rounded-full flex flex-col items-center justify-center shadow-md">
                <span className="text-3xl font-black text-slate-800 dark:text-white">
                  {fmt(avgNilai)}
                </span>
              </div>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getBadgeStyle(avgNilai)} mt-2`}
            >
              {getGrade(avgNilai)}
            </span>
          </div>

          {/* 7 INDIKATOR PROGRESS (8 Kolom) */}
          <div className="xl:col-span-8 bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 flex flex-col h-full transition-colors">
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-5">
              Nilai per Indikator IKPA
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {indikatorAvgs.map((ind, idx) => {
                const names = {
                  revisi: "Revisi DIPA",
                  deviasi: "Deviasi Halaman III",
                  penyerapan: "Penyerapan Anggaran",
                  kontraktual: "Belanja Kontraktual",
                  tagihan: "Penyelesaian Tagihan",
                  uptup: "Pengelolaan UP/TUP",
                  output: "Capaian Output",
                };
                const isTargetMet = ind.avg >= meta.target;

                return (
                  <div
                    key={idx}
                    className="p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#0A111E] flex flex-col gap-2 transition-colors"
                  >
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 line-clamp-2 h-8">
                      {names[ind.key]}
                    </span>
                    <strong className="text-xl font-black text-slate-800 dark:text-white">
                      {fmt(ind.avg)}
                    </strong>

                    {/* Mini Progress Bar */}
                    <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden w-full">
                      <div
                        className={`h-full rounded-full ${isTargetMet ? "bg-blue-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(ind.avg, 100)}%` }}
                      />
                    </div>

                    <span
                      className={`text-[10px] font-bold mt-1 ${isTargetMet ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {isTargetMet ? "Target tercapai" : "Di bawah target"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 text-center mt-auto bg-slate-50 dark:bg-white/5 py-2 rounded-lg">
              Pembanding target IKPA Tahun 2026:{" "}
              <b className="text-slate-700 dark:text-white">
                {fmt(meta.target)}
              </b>
            </div>
          </div>
        </div>
      )}

      {/* 4. TABEL DATA */}
      {level !== "kl" && (
        <div className="bg-white dark:bg-[#111C30]/80 backdrop-blur-md rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {level === "kl"
                  ? "Tingkat Kementerian"
                  : level === "e1"
                    ? "Unit Eselon I"
                    : "Satuan Kerja"}
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                Kategori: &gt;95 Sangat Baik; 89–95 Baik; 70–&lt;89 Cukup;
                &lt;70 Kurang
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full shrink-0">
              {filteredData.length} Entitas
            </span>
          </div>

          <div className="overflow-auto w-full relative max-h-[35vh] 2xl:max-h-[calc(85vh-380px)] custom-scrollbar">
            {loading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-[#111C30]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="text-blue-500 font-bold">Memuat Data...</span>
              </div>
            )}
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#0D1627] shadow-sm">
                <tr className="bg-slate-50/50 dark:bg-[#0D1627]/50 border-b border-slate-100 dark:border-white/10">
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-16">
                    Peringkat
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Nama Entitas
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Revisi
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Deviasi
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Penyerapan
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Kontraktual
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Tagihan
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    UP/TUP
                  </th>
                  <th className="px-3 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Output
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider text-right">
                    Nilai IKPA
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                    Predikat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-5 py-3 text-center">
                        <div className="w-7 h-7 mx-auto rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                        {row.kode}
                      </td>
                      <td className="px-5 py-3 text-xs font-bold text-slate-700 dark:text-gray-200 leading-relaxed min-w-[100px]">
                        {row.nama}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.revisi)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.deviasi)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.penyerapan)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.kontraktual)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.tagihan)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.uptup)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                        {fmt(row.output)}
                      </td>
                      <td className="px-5 py-3 text-sm font-black text-slate-800 dark:text-white text-right">
                        {fmt(row.nilai)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold rounded-full border ${getBadgeStyle(row.nilai)}`}
                        >
                          {getGrade(row.nilai)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-5 py-16 text-sm font-medium text-slate-400 dark:text-slate-500 text-center"
                    >
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER KETERANGAN SUMBER DATA */}
          <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/30 dark:bg-[#0D1627]/30 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Sumber data: file IKPA yang diunduh {meta.lastDownload}. Periode
            sampai dengan {meta.periode}.
          </div>
        </div>
      )}
    </div>
  );
}
