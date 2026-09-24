import React from 'react';

// --- DATA MOCK ---
const DATA = {
  dateLabel: "9 SEPTEMBER 2026",
  eselon: [
    { no: 1, code: "02601", name: "Sekretariat Jenderal", pagu: 390307041000.0, real: 180613699189.0, pct: 0.46270000000000006, sisa: 209693341811.0, pct_pegawai: 0.6934999999999999, pct_barang: 0.3686, pct_modal: 0.5611999999999999, short: "Sekretariat Jenderal" },
    { no: 2, code: "02602", name: "Inspektorat Jenderal", pagu: 40250363000.0, real: 28141799722.0, pct: 0.6992, sisa: 12108563278.0, pct_pegawai: 0.7109000000000001, pct_barang: 0.6636, pct_modal: 0.9959, short: "Inspektorat Jenderal" },
    { no: 3, code: "02604", name: "DITJEN PEMBINAAN PENEMPATAN TENAGA KERJA DAN PERLUASAN KESEMPATAN KERJA", pagu: 261923629000.0, real: 169911685545.0, pct: 0.6487, sisa: 92011943455.0, pct_pegawai: 0.7669, pct_barang: 0.6007, pct_modal: 0.5550999999999999, short: "Ditjen Binapenta" },
    { no: 4, code: "02605", name: "Ditjen Pembinaan Hubungan Industrial dan Jaminan Sosial Tenaga Kerja", pagu: 1296939805000.0, real: 1117533627385.0, pct: 0.8617, sisa: 179406177615.0, pct_pegawai: 0.7195, pct_barang: 0.8665999999999999, pct_modal: 0.9808, short: "Ditjen PHI & Jamsos" },
    { no: 5, code: "02608", name: "DITJEN PEMBINAAN PENGAWASAN KETENAGAKERJAAN DAN KESELAMATAN DAN KESEHATAN KERJA", pagu: 185848814000.0, real: 116909268927.0, pct: 0.6291, sisa: 68939545073.0, pct_pegawai: 0.7724, pct_barang: 0.47119999999999995, pct_modal: 0.14300000000000002, short: "Ditjen Binwasnaker" },
    { no: 6, code: "02611", name: "BADAN PERENCANAAN DAN PENGEMBANGAN KETENAGAKERJAAN", pagu: 184878784000.0, real: 73177927586.0, pct: 0.3958, sisa: 111700856414.0, pct_pegawai: 0.7927, pct_barang: 0.4677, pct_modal: 0.0074, short: "Barenbang" },
    { no: 7, code: "02613", name: "DIREKTORAT JENDERAL PEMBINAAN PELATIHAN VOKASI DAN PRODUKTIVITAS", pagu: 7043169265000.0, real: 2689810931262.0, pct: 0.38189999999999996, sisa: 4353358333738.0, pct_pegawai: 0.7484000000000001, pct_barang: 0.3892, pct_modal: 0.0003, short: "Ditjen Binalavotas" }
  ],
  grand: { pagu: 9403317701000.0, real: 4376098939616.0, pct: 0.4654, sisa: 5027218761384.0 },
  topPagu: [
    { no: 41, code: "626132", name: "DIREKTORAT BINA PENYELENGGARAAN PELATIHAN VOKASI DAN PEMAGANGAN", pagu: 3963476132000.0, real: 2159098404130.0, pct: 0.5447, sisa: 1804377727870.0, pct_pegawai: 0.0, pct_barang: 0.0, pct_modal: 0.0 },
    { no: 29, code: "451270", name: "DITJEN. PEMBINAAN HUBUNGAN INDUSTRIAL DAN JAMINAN SOSIAL TENAGA KERJA", pagu: 1296939805000.0, real: 1117533627385.0, pct: 0.8617, sisa: 179406177615.0, pct_pegawai: 0.7195, pct_barang: 0.8665999999999999, pct_modal: 0.9808 },
    { no: 40, code: "626131", name: "DIREKTORAT BINA KELEMBAGAAN PELATIHAN VOKASI", pagu: 605352466000.0, real: 9248846753.0, pct: 0.015300000000000001, sisa: 596103619247.0, pct_pegawai: 0.0, pct_barang: 0.0, pct_modal: 0.0002 },
    { no: 23, code: "450938", name: "SEKRETARIAT JENDERAL KEMNAKER", pagu: 292634588000.0, real: 130144174093.0, pct: 0.4447, sisa: 162490413907.0, pct_pegawai: 0.6986, pct_barang: 0.35409999999999997, pct_modal: 0.4263 },
    { no: 32, code: "452558", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS BEKASI", pagu: 259630949000.0, real: 37583791941.0, pct: 0.1448, sisa: 222047157059.0, pct_pegawai: 0.7609999999999999, pct_barang: 0.0562, pct_modal: 0.0 },
    { no: 22, code: "426531", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS SERANG", pagu: 244666075000.0, real: 38347392451.0, pct: 0.1567, sisa: 206318682549.0, pct_pegawai: 0.7693000000000001, pct_barang: 0.0892, pct_modal: 0.0 },
    { no: 35, code: "452609", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS SEMARANG", pagu: 190535103000.0, real: 37781721442.0, pct: 0.19829999999999998, sisa: 152753381558.0, pct_pegawai: 0.8140000000000001, pct_barang: 0.1094, pct_modal: 0.0 },
    { no: 37, code: "452677", name: "BADAN PERENCANAAN DAN PENGEMBANGAN KETENAGAKERJAAN", pagu: 184878784000.0, real: 73177927586.0, pct: 0.3958, sisa: 111700856414.0, pct_pegawai: 0.7927, pct_barang: 0.4677, pct_modal: 0.0074 },
    { no: 26, code: "451094", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS MEDAN", pagu: 184769127000.0, real: 24239912447.0, pct: 0.13119999999999998, sisa: 160529214553.0, pct_pegawai: 0.6188, pct_barang: 0.0658, pct_modal: 0.0 },
    { no: 36, code: "452652", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS MAKASSAR", pagu: 175168577000.0, real: 31975940979.0, pct: 0.1825, sisa: 143192636021.0, pct_pegawai: 0.8534, pct_barang: 0.0759, pct_modal: 0.0 }
  ],
  topReal: [
    { no: 41, code: "626132", name: "DIREKTORAT BINA PENYELENGGARAAN PELATIHAN VOKASI DAN PEMAGANGAN", pagu: 3963476132000.0, real: 2159098404130.0, pct: 0.5447, sisa: 1804377727870.0, pct_pegawai: 0.0, pct_barang: 0.0, pct_modal: 0.0 },
    { no: 29, code: "451270", name: "DITJEN. PEMBINAAN HUBUNGAN INDUSTRIAL DAN JAMINAN SOSIAL TENAGA KERJA", pagu: 1296939805000.0, real: 1117533627385.0, pct: 0.8617, sisa: 179406177615.0, pct_pegawai: 0.7195, pct_barang: 0.8665999999999999, pct_modal: 0.9808 },
    { no: 23, code: "450938", name: "SEKRETARIAT JENDERAL KEMNAKER", pagu: 292634588000.0, real: 130144174093.0, pct: 0.4447, sisa: 162490413907.0, pct_pegawai: 0.6986, pct_barang: 0.35409999999999997, pct_modal: 0.4263 },
    { no: 42, code: "651870", name: "DITJEN. PEMBINAAN PENGAWASAN KETENAGAKERJAAN DAN K3", pagu: 125754336000.0, real: 75921137055.0, pct: 0.6037, sisa: 49833198945.0, pct_pegawai: 0.8044, pct_barang: 0.4359, pct_modal: 0.1427 },
    { no: 37, code: "452677", name: "BADAN PERENCANAAN DAN PENGEMBANGAN KETENAGAKERJAAN", pagu: 184878784000.0, real: 73177927586.0, pct: 0.3958, sisa: 111700856414.0, pct_pegawai: 0.7927, pct_barang: 0.4677, pct_modal: 0.0074 },
    { no: 39, code: "626041", name: "DIREKTORAT BINA PERLUASAN KESEMPATAN KERJA", pagu: 83390237000.0, real: 67485086537.0, pct: 0.8093, sisa: 15905150463.0, pct_pegawai: 0.0, pct_barang: 0.0, pct_modal: 0.0 },
    { no: 28, code: "451139", name: "DITJEN. PEMBINAAN PENEMPATAN TENAGA KERJA DAN PERLUASAN KESEMPATAN KERJA", pagu: 111430013000.0, real: 62142051656.0, pct: 0.5577000000000001, sisa: 49287961344.0, pct_pegawai: 0.7904000000000001, pct_barang: 0.3297, pct_modal: 0.9521 },
    { no: 25, code: "451026", name: "DITJEN. PEMBINAAN PELATIHAN DAN PRODUKTIVITAS", pagu: 105265191000.0, real: 56352994658.0, pct: 0.5353, sisa: 48912196342.0, pct_pegawai: 0.7055, pct_barang: 0.3791, pct_modal: 0.0 },
    { no: 22, code: "426531", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS SERANG", pagu: 244666075000.0, real: 38347392451.0, pct: 0.1567, sisa: 206318682549.0, pct_pegawai: 0.7693000000000001, pct_barang: 0.0892, pct_modal: 0.0 },
    { no: 35, code: "452609", name: "BALAI BESAR PELATIHAN VOKASI DAN PRODUKTIVITAS SEMARANG", pagu: 190535103000.0, real: 37781721442.0, pct: 0.19829999999999998, sisa: 152753381558.0, pct_pegawai: 0.8140000000000001, pct_barang: 0.1094, pct_modal: 0.0 }
  ],
  satkerCount: 44
};

// --- HELPERS ---
const fmtMoney = (n) => {
  if (n >= 1e12) return "Rp " + (n / 1e12).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " T";
  if (n >= 1e9) return "Rp " + (n / 1e9).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + " M";
  if (n >= 1e6) return "Rp " + (n / 1e6).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + " Jt";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
};

const pct = (x) => (x * 100).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
const clamp = (x) => Math.max(0, Math.min(100, x * 100));

export default function RealizationPage() {
  const renderRankRow = (item, idx, mode) => {
    const isReal = mode === "real";
    return (
      <div key={item.code} className="grid grid-cols-[34px_70px_minmax(220px,1fr)_92px_92px_120px] gap-1.5 items-center mx-2 mb-1.5 p-1.5 px-2 border border-[#cfe0f4] rounded-lg text-[10px] min-h-[39px] min-w-[760px]" title={item.name}>
        <div className={`w-6 h-6 rounded flex items-center justify-center font-black text-white ${isReal ? 'bg-[#138535]' : 'bg-[#174ca9]'}`}>{idx + 1}</div>
        <div className="font-black text-[#173b78] text-[11px]">{item.code}</div>
        <div className="font-[750] text-[#274b83] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>
        <div className="text-right font-[850] text-[#274a7c]">{fmtMoney(isReal ? item.real : item.pagu)}</div>
        
        {/* Kolom 5 */}
        <div className={isReal ? "grid gap-[3px]" : "text-right font-[850] text-[#274a7c]"}>
          {isReal ? (
            <>
              <div className="text-right font-[850] text-[#138535]">{pct(item.pct)}</div>
              <div className="h-[7px] rounded-full bg-[#e4e8ea] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#159239] to-[#38b85a]" style={{ width: `${clamp(item.pct)}%` }}></div>
              </div>
            </>
          ) : (
            fmtMoney(item.real)
          )}
        </div>

        {/* Kolom 6 */}
        <div className={isReal ? "text-right font-[850] text-[#274a7c]" : "grid gap-[3px]"}>
          {isReal ? (
            fmtMoney(item.pagu)
          ) : (
            <>
              <div className="text-right font-[850] text-[#138535]">{pct(item.pct)}</div>
              <div className="h-[7px] rounded-full bg-[#e4e8ea] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#159239] to-[#38b85a]" style={{ width: `${clamp(item.pct)}%` }}></div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans text-[#0f2f68] bg-[radial-gradient(circle_at_12%_2%,rgba(64,144,255,0.08),transparent_28%),linear-gradient(180deg,#fbfdff_0%,#f2f7fd_100%)]">
      <main className="max-w-[1600px] mx-auto p-4 md:p-[22px]">
        
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-[#f7fbff] to-[#edf6ff] border border-[#d8e9fb] rounded-[22px] p-5 md:px-7 md:pb-6 md:pt-5 shadow-[0_12px_32px_rgba(27,70,126,0.08)]">
          <h1 className="m-0 text-center text-2xl md:text-[34px] leading-[1.08] tracking-[-0.8px] font-[950] text-[#12377b] uppercase">
            Laporan Realisasi Belanja Eselon I Kementerian Ketenagakerjaan
          </h1>
          <div className="mt-2 mx-auto flex items-center justify-center gap-4 text-sm md:text-[18px] font-black text-[#194991] before:content-[''] before:h-px before:w-[50px] md:before:w-[150px] before:bg-[#5d91dc] after:content-[''] after:h-px after:w-[50px] md:after:w-[150px] after:bg-[#5d91dc]">
            <span>POSISI <span>{DATA.dateLabel}</span></span>
          </div>
          <div className="mt-3 mb-[18px] mx-auto flex items-center justify-center gap-[9px] font-[850] text-[#16356e] text-[12px] leading-[1.12]">
            <span className="grid grid-cols-3 gap-[2px] rotate-45">
              {[...Array(9)].map((_, i) => <i key={i} className="w-2 h-2 rounded-[2px] bg-[#174ea4]"></i>)}
            </span>
            <span>KEMENTERIAN KETENAGAKERJAAN<br/>REPUBLIK INDONESIA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_110px_1fr] xl:grid-cols-[1fr_170px_1fr_1px_1fr] items-center gap-3 xl:gap-6 bg-white border-2 border-[#1c55bb] rounded-[14px] p-4 xl:px-6 xl:py-[14px]">
            <div className="text-center">
              <small className="font-[850] text-[#1b458d] uppercase">Total Pagu</small>
              <b className="block mt-1 text-[24px] xl:text-[32px] tracking-[-0.6px]">{fmtMoney(DATA.grand.pagu)}</b>
            </div>
            
            <div className="relative w-[108px] h-[108px] rounded-full flex items-center justify-center mx-auto" style={{ background: `conic-gradient(#12913d ${clamp(DATA.grand.pct)}%, #e4e8e7 0)` }}>
              <div className="absolute inset-[13px] bg-white rounded-full"></div>
              <strong className="relative z-10 text-[18px] text-[#14843a] font-bold">{pct(DATA.grand.pct)}</strong>
            </div>
            
            <div className="text-center">
              <small className="font-[850] text-[#168a38] uppercase">Total Realisasi</small>
              <b className="block mt-1 text-[24px] xl:text-[32px] tracking-[-0.6px] text-[#168a38]">{fmtMoney(DATA.grand.real)}</b>
            </div>
            
            <div className="hidden xl:block w-[1px] h-[62px] bg-[#7ca4df]"></div>
            
            <div className="text-center md:col-span-full xl:col-span-1">
              <small className="font-[850] text-[#1b458d] uppercase">Sisa Anggaran</small>
              <b className="block mt-1 text-[24px] xl:text-[32px] tracking-[-0.6px]">{fmtMoney(DATA.grand.sisa)}</b>
            </div>
          </div>

          {/* UNIT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 mt-4">
            {DATA.eselon.map((u) => {
              const kinds = [
                { name: "Pegawai", val: u.pct_pegawai },
                { name: "Barang", val: u.pct_barang },
                { name: "Modal", val: u.pct_modal }
              ];
              
              return (
                <article key={u.code} className="bg-white/95 border-[1.5px] border-[#4f89de] rounded-xl p-3 px-2.5 min-w-0 transition-transform hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(23,78,145,.12)]">
                  <div className="text-[24px] font-[950] text-center tracking-[0.5px]">{u.code.slice(0, 3)}.{u.code.slice(3)}</div>
                  <div className="h-[34px] text-center text-[11px] font-[750] leading-[1.2] overflow-hidden flex items-center justify-center">{u.short}</div>
                  <div className="h-px bg-[#3c77ce] mx-1 mt-2 mb-2.5"></div>
                  
                  <div className="text-center text-[#305896] text-[9px] font-[850] uppercase">Total Pagu</div>
                  <div className="text-center text-[17px] font-black mt-[3px] mb-2">{fmtMoney(u.pagu)}</div>
                  <div className="text-center text-[10px] font-[850] text-[#16893b]">REALISASI</div>
                  <div className="text-center text-[19px] font-[950] text-[#16893b] mt-0.5">{pct(u.pct)}</div>
                  
                  <div className="relative w-[72px] h-[72px] rounded-full mx-auto mt-1.5 mb-2.5 flex items-center justify-center" style={{ background: `conic-gradient(#12913d ${clamp(u.pct)}%, #e5e8e7 0)` }}>
                    <div className="absolute inset-[9px] bg-white rounded-full"></div>
                    <span className="relative z-10 text-[11px] font-black text-[#16893b]">{pct(u.pct)}</span>
                  </div>
                  
                  <div className="text-center text-[#2f5997] text-[8px] font-[850] mb-[7px]">REALISASI PER JENIS BELANJA</div>
                  <div className="h-[72px] grid grid-cols-3 gap-2 items-end">
                    {kinds.map((k) => (
                      <div key={k.name} className="h-full flex flex-col justify-end items-center gap-1">
                        <div className="text-[8px] font-[800] text-[#173b76]">{pct(k.val)}</div>
                        <div className="w-[18px] rounded-t-[3px] min-h-[1px] bg-gradient-to-b from-[#34b554] to-[#138a32]" style={{ height: `${Math.max(1, clamp(k.val) * 0.55)}px` }}></div>
                        <label className="text-[8px] text-[#244a86] font-[800]">{k.name}</label>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-3 mx-2 text-[#27518e] text-[11px] font-bold">Data posisi: <span>{DATA.dateLabel}</span> &nbsp; | &nbsp; Jenis belanja lain (Bunga, Subsidi, Hibah, Bansos, Lainnya, dan Transfer) bernilai Rp0 pada data sumber.</div>
        </section>

        {/* SATKER COMPARISON SECTION */}
        <section className="mt-5">
          <div className="text-center mb-3.5">
            <h2 className="m-0 text-[24px] md:text-[32px] tracking-[-0.7px] uppercase text-[#12377b] font-bold">
              Komparasi Realisasi Belanja Satker Kementerian Ketenagakerjaan
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm md:text-[17px] font-black text-[#194991] mt-1.5 before:content-[''] before:h-px before:w-[30px] md:before:w-[100px] before:bg-[#5d91dc] after:content-[''] after:h-px after:w-[30px] md:after:w-[100px] after:bg-[#5d91dc]">
              <span>POSISI <span>{DATA.dateLabel}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_110px_1fr] xl:grid-cols-[1fr_150px_1fr_1px_1fr] items-center gap-3 xl:gap-5 bg-white border-2 border-[#1d55bb] rounded-[14px] p-3 xl:px-6 xl:py-[13px] shadow-[0_12px_32px_rgba(27,70,126,0.08)]">
            <div className="text-center">
              <small className="font-[850] text-[#1b458d] uppercase">Total Pagu</small>
              <b className="block mt-1 text-[24px] xl:text-[32px] tracking-[-0.6px]">{fmtMoney(DATA.grand.pagu)}</b>
            </div>
            
            <div className="relative w-[108px] h-[108px] rounded-full flex items-center justify-center mx-auto" style={{ background: `conic-gradient(#12913d ${clamp(DATA.grand.pct)}%, #e4e8e7 0)` }}>
              <div className="absolute inset-[13px] bg-white rounded-full"></div>
              <strong className="relative z-10 text-[18px] text-[#14843a] font-bold">{pct(DATA.grand.pct)}</strong>
            </div>
            
            <div className="text-center">
              <small className="font-[850] text-[#168a38] uppercase">Total Realisasi</small>
              <b className="block mt-1 text-[24px] xl:text-[32px] tracking-[-0.6px] text-[#168a38]">{fmtMoney(DATA.grand.real)}</b>
            </div>
            
            <div className="hidden xl:block w-[1px] h-[62px] bg-[#7ca4df]"></div>
            
            <div className="text-center md:col-span-full xl:col-span-1">
              <small className="font-[850] text-[#1b458d] uppercase">Sisa Anggaran</small>
              <b className="block mt-1 text-[24px] xl:text-[32px] tracking-[-0.6px]">{fmtMoney(DATA.grand.sisa)}</b>
            </div>
          </div>

          {/* RANKING TABLES */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
            
            {/* TOP PAGU */}
            <div className="bg-white border border-[#d8e6f7] rounded-[14px] pb-2.5 shadow-[0_12px_32px_rgba(27,70,126,0.08)] overflow-x-auto custom-scrollbar">
              <div className="px-3.5 py-[9px] bg-[#113c98] text-white text-center font-black text-[17px] sticky left-0 min-w-[760px]">TOP 10 PAGU TERBESAR</div>
              <div className="grid grid-cols-[34px_70px_minmax(220px,1fr)_92px_92px_120px] gap-1.5 items-center px-2.5 pt-2 pb-1 text-[9px] font-black text-[#244a82] uppercase min-w-[760px]">
                <div>No</div><div>Kode Satker</div><div>Nama Satker</div><div className="text-right">Pagu</div><div className="text-right">Realisasi</div><div className="text-right">% Realisasi</div>
              </div>
              <div>
                {DATA.topPagu.map((item, idx) => renderRankRow(item, idx, "pagu"))}
              </div>
            </div>

            {/* TOP REALISASI */}
            <div className="bg-white border border-[#d8e6f7] rounded-[14px] pb-2.5 shadow-[0_12px_32px_rgba(27,70,126,0.08)] overflow-x-auto custom-scrollbar">
              <div className="px-3.5 py-[9px] bg-[#138535] text-white text-center font-black text-[17px] sticky left-0 min-w-[760px]">TOP 10 REALISASI TERBESAR</div>
              <div className="grid grid-cols-[34px_70px_minmax(220px,1fr)_92px_92px_120px] gap-1.5 items-center px-2.5 pt-2 pb-1 text-[9px] font-black text-[#244a82] uppercase min-w-[760px]">
                <div>No</div><div>Kode Satker</div><div>Nama Satker</div><div className="text-right">Realisasi</div><div className="text-right">% Realisasi</div><div className="text-right">Pagu</div>
              </div>
              <div>
                {DATA.topReal.map((item, idx) => renderRankRow(item, idx, "real"))}
              </div>
            </div>

          </div>
          <div className="mt-[11px] mx-1 text-[#33598f] text-[11px] font-bold">Data posisi: <span>{DATA.dateLabel}</span> &nbsp; | &nbsp; Komparasi dari total <span>{DATA.satkerCount}</span> Satker Pusat & UPT.</div>
        </section>
      </main>
    </div>
  );
}