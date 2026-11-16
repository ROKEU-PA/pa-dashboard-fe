import React from "react";

const LOGIN_URL = "/login";

// Ganti dengan route E-SPP aktif dari menu aplikasi.
const ESPP_URL = "/e-spp";

const services = [
  {
    title: "E-SPP",
    description: "Pengajuan dan pengelolaan Surat Perintah Pembayaran",
    icon: "▤",
    color: "bg-blue-100 text-blue-700",
    href: LOGIN_URL,
  },
  {
    title: "E-Arsip",
    description: "Pengelolaan arsip digital yang terintegrasi",
    icon: "▣",
    color: "bg-emerald-100 text-emerald-700",
    href: LOGIN_URL,
  },
  {
    title: "Data dan Informasi",
    description: "Akses data dan informasi layanan keuangan",
    icon: "▥",
    color: "bg-violet-100 text-violet-700",
    href: LOGIN_URL,
  },
  {
    title: "Layanan Lainnya",
    description: "Berbagai layanan digital dalam satu portal",
    icon: "▦",
    color: "bg-amber-100 text-amber-700",
    href: LOGIN_URL,
  },
];

const highlights = [
  {
    icon: "✦",
    title: "Mudah",
    subtitle: "Praktis digunakan",
  },
  {
    icon: "▦",
    title: "Terintegrasi",
    subtitle: "Satu portal",
  },
  {
    icon: "✓",
    title: "Terarah",
    subtitle: "Akses terpusat",
  },
];

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      {/* Background gedung */}
      <div className="absolute inset-0 -z-30">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-slate-950/95 via-blue-950/90 to-indigo-950/65" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-slate-950/75 via-transparent to-blue-950/20" />

      {/* Dekorasi */}
      <div className="pointer-events-none absolute -right-28 top-28 -z-10 h-80 w-80 rounded-full border border-white/10 sm:h-[440px] sm:w-[440px]" />
      <div className="pointer-events-none absolute -right-12 top-48 -z-10 h-64 w-64 rounded-full border border-cyan-200/10 sm:h-[320px] sm:w-[320px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pb-20 lg:pt-32">
        {/* Konten kiri */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100 shadow-sm backdrop-blur-md sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.7)]" />
            Portal Layanan Digital
          </div>

          <h1 className="mt-5 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-[56px]">
            Layanan Keuangan
            <br />
            dan BMN dalam Satu
            <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Portal Terintegrasi.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/90 sm:text-base">
            Akses aplikasi, informasi, dan layanan Biro Keuangan dan BMN
            secara lebih mudah dan terstruktur untuk mendukung tata kelola
            keuangan yang transparan dan akuntabel.
          </p>

          {/* Tombol utama */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={ESPP_URL}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/20 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-200/40"
            >
              Akses E-SPP
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href="#layanan"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Lihat Semua Layanan
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Keunggulan */}
          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:gap-4">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm text-cyan-200">
                  {item.icon}
                </span>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold sm:text-xs">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-blue-100/70 sm:text-xs">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kartu layanan kanan */}
        <div className="relative mx-auto w-full max-w-lg lg:ml-auto lg:mr-0">
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-blue-400/20 blur-3xl" />

          <div className="relative rounded-[1.75rem] border border-white/20 bg-white/[0.10] p-4 shadow-2xl backdrop-blur-xl sm:rounded-[2rem] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-200">
                  YOUR DIGITAL HUB
                </p>
                <h2 className="mt-1.5 text-xl font-extrabold sm:text-2xl">
                  Pilih layanan kamu
                </h2>
                <p className="mt-1 text-xs text-blue-100/70">
                  Semua kebutuhan dalam satu portal.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg text-cyan-200">
                ✦
              </div>
            </div>

            <div className="space-y-2.5">
              {services.map((service) => (
                <a
                  key={service.title}
                  href={service.href}
                  className="group flex items-center gap-3 rounded-2xl border border-white/60 bg-white p-3.5 text-slate-800 shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-xl sm:gap-4 sm:p-4"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${service.color}`}
                  >
                    {service.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {service.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-lg text-slate-400 transition duration-200 group-hover:translate-x-1 group-hover:text-blue-700">
                    →
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.08] px-3.5 py-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
              <p className="text-[11px] leading-5 text-blue-50/90">
                Satu portal untuk berbagai kebutuhan layanan digital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
