import React from "react";

const ESPP_URL = "/e-spp"; // Ganti jika route E-SPP aktif berbeda.
const LOGIN_URL = "/login";

const services = [
  {
    number: "01",
    icon: "📄",
    title: "E-SPP",
    subtitle: "Surat Perintah Pembayaran",
    description:
      "Kelola pengajuan dan pantau proses administrasi pembayaran melalui layanan digital yang terintegrasi.",
    accent: "from-blue-600 to-indigo-600",
    iconBg: "bg-blue-50 dark:bg-blue-500/15",
    iconColor: "text-blue-700 dark:text-blue-300",
    href: LOGIN_URL,
  },
  {
    number: "02",
    icon: "🗂️",
    title: "E-Arsip",
    subtitle: "Pengelolaan Dokumen",
    description:
      "Akses dan kelola dokumen secara digital agar lebih terorganisasi, praktis, dan mudah ditelusuri.",
    accent: "from-violet-600 to-purple-600",
    iconBg: "bg-violet-50 dark:bg-violet-500/15",
    iconColor: "text-violet-700 dark:text-violet-300",
    href: LOGIN_URL,
  },
  {
    number: "03",
    icon: "📊",
    title: "Data & Informasi",
    subtitle: "Informasi Terpadu",
    description:
      "Dapatkan akses informasi untuk mendukung kebutuhan administrasi dan proses kerja sehari-hari.",
    accent: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
    iconColor: "text-emerald-700 dark:text-emerald-300",
    href: LOGIN_URL,
  },
  {
    number: "04",
    icon: "✨",
    title: "Layanan Lainnya",
    subtitle: "Kemudahan dalam Satu Portal",
    description:
      "Temukan layanan pendukung lainnya sesuai dengan kebutuhan dan hak akses pengguna.",
    accent: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-50 dark:bg-orange-500/15",
    iconColor: "text-orange-700 dark:text-orange-300",
    href: LOGIN_URL,
  },
];

const ServicesSection = () => {
  return (
    <section
      id="layanan"
      className="relative overflow-hidden bg-slate-50 px-5 py-16 transition-colors duration-300 dark:bg-slate-950 sm:px-8 sm:py-20 lg:px-16 lg:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-500/10"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm dark:border-blue-400/20 dark:bg-slate-900">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">
              Layanan Digital
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Semua Kebutuhan dalam
            <span className="mt-1 block bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
              Satu Portal Terintegrasi
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Akses layanan administrasi dan informasi dengan lebih mudah.
            Dirancang untuk mendukung proses kerja yang praktis, tertata,
            dan efisien.
          </p>
        </div>

        {/* Service cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.number}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-400/40 dark:hover:shadow-black/20 sm:p-7"
            >
              {/* Top accent */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.accent}`}
              />

              <div className="flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 ${service.iconBg} ${service.iconColor}`}
                >
                  <span aria-hidden="true">{service.icon}</span>
                </div>

                <span className="text-sm font-bold tracking-widest text-slate-300 dark:text-slate-600">
                  {service.number}
                </span>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {service.subtitle}
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                {service.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {service.description}
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <a
                  href={service.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-cyan-300"
                >
                  <span>Jelajahi layanan</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="relative mt-9 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 px-6 py-7 shadow-xl shadow-blue-900/10 sm:px-9 sm:py-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10"
          />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl">
              🚀
            </div>

            <div>
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Mulai dari satu portal
              </h3>
              <p className="mt-1 text-sm leading-6 text-blue-100">
                Temukan kemudahan layanan digital untuk mendukung pekerjaanmu.
              </p>
            </div>
          </div>

          <a
            href={LOGIN_URL}
            className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 sm:w-fit lg:mt-0"
          >
            Masuk ke Portal
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
