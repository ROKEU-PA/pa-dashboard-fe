import React from "react";

const LOGIN_URL = "/login";

// Sesuaikan dengan route E-SPP aktif dari konfigurasi listMenu.
// Jangan gunakan /e-spp jika route tersebut belum tersedia.
const ESPP_URL = "/e-spp";

const services = [
  {
    number: "01",
    icon: "📄",
    title: "E-SPP",
    description: "Pengelolaan administrasi dan dokumen",
    href: ESPP_URL,
    featured: true,
  },
  {
    number: "02",
    icon: "🗂️",
    title: "E-Arsip",
    description: "Pengelolaan arsip secara digital",
    href: "/e-arsip",
  },
  {
    number: "03",
    icon: "📊",
    title: "Data & Informasi",
    description: "Akses informasi layanan terintegrasi",
    href: LOGIN_URL,
  },
];

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative isolate min-h-[760px] overflow-hidden bg-slate-950 px-5 pb-20 pt-32 text-white sm:px-8 sm:pt-36 lg:min-h-[820px] lg:px-16 lg:pb-24"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="h-full w-full object-cover object-center opacity-30"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950/95 to-indigo-950/90" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

      {/* Glow decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-[450px] w-[450px] rounded-full bg-blue-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-32 -z-10 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Grid decoration */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Left content */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-300/20 bg-white/[0.07] px-4 py-2.5 shadow-lg shadow-blue-950/20 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 sm:text-xs">
                Digital Administration Platform
              </span>
            </div>

            {/* Main heading */}
            <h1 className="mt-8 max-w-3xl text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[4.3rem]">
              Transformasi
              <span className="block">Administrasi</span>
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                dalam Satu Portal.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-blue-100/80 sm:text-base lg:text-lg">
              Kelola dokumen, akses informasi, dan pantau proses administrasi
              dengan lebih mudah melalui portal E-SPP yang terintegrasi,
              praktis, dan terstruktur.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={ESPP_URL}
                className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:from-blue-400 hover:to-indigo-400 hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-300/30"
              >
                Jelajahi E-SPP
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#layanan"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
              >
                Lihat Layanan
                <span>↗</span>
              </a>
            </div>

            {/* Trust information */}
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/10 pt-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <span>✓</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Terintegrasi
                  </p>
                  <p className="mt-0.5 text-[10px] text-blue-200/70">
                    Satu portal layanan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <span>🔒</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Hak Akses
                  </p>
                  <p className="mt-0.5 text-[10px] text-blue-200/70">
                    Sesuai pengguna
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Floating glow */}
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-[80px]" />
            <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-violet-500/20 blur-[80px]" />

            {/* Main glass card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[40px] border-white/[0.05]" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full border-[40px] border-cyan-300/[0.06]" />

              <div className="relative">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-bold tracking-widest text-blue-100">
                    E-SPP PORTAL
                  </span>
                </div>

                {/* Card title */}
                <div className="mt-7 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-2xl shadow-lg shadow-blue-500/20">
                    🏛️
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                      Welcome to
                    </p>
                    <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                      Portal E-SPP
                    </h2>
                    <p className="mt-1 text-xs text-blue-200/70">
                      Sistem administrasi digital
                    </p>
                  </div>
                </div>

                {/* Main visual panel */}
                <div className="mt-7 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-violet-500/10 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-blue-100">
                        Satu lingkungan digital
                      </p>
                      <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                        Kelola lebih
                        <span className="block text-cyan-300">
                          efisien.
                        </span>
                      </h3>
                    </div>

                    <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-3xl sm:flex">
                      ✨
                    </div>
                  </div>

                  {/* Decorative progress */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-cyan-200">
                      TERARAH
                    </span>
                  </div>
                </div>

                {/* Services preview */}
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-bold text-white">
                      Layanan Portal
                    </p>
                    <span className="text-[10px] text-blue-200/60">
                      EXPLORE SERVICES
                    </span>
                  </div>

                  <div className="space-y-3">
                    {services.map((service) => (
                      <a
                        key={service.number}
                        href={service.href}
                        className={`group flex items-center gap-3 rounded-xl border p-3 transition duration-300 hover:-translate-y-0.5 ${
                          service.featured
                            ? "border-blue-300/30 bg-blue-400/15 hover:bg-blue-400/20"
                            : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.09]"
                        }`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                          {service.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">
                              {service.title}
                            </p>
                            {service.featured && (
                              <span className="rounded-full bg-cyan-300/15 px-2 py-0.5 text-[8px] font-bold text-cyan-200">
                                MAIN
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[10px] text-blue-100/60 sm:text-xs">
                            {service.description}
                          </p>
                        </div>

                        <span className="text-blue-200 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <p className="text-[9px] font-semibold tracking-[0.15em] text-blue-200/60">
                    DIGITAL • PRACTICAL • INTEGRATED
                  </p>
                  <span className="text-lg">✦</span>
                </div>
              </div>
            </div>

            {/* Floating info card */}
            <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl sm:flex lg:-left-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Layanan Digital
                </p>
                <p className="mt-1 text-[10px] text-blue-200/70">
                  Dalam satu portal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="mt-20 flex justify-center lg:mt-24">
          <a
            href="#layanan"
            className="group flex flex-col items-center gap-2 text-blue-200/60 transition hover:text-white"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.25em]">
              Explore More
            </span>
            <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
              <span className="h-2 w-1 rounded-full bg-cyan-300 transition-transform duration-300 group-hover:translate-y-2" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
