import React from "react";
import {
  FileText,
  FolderArchive,
  ChartNoAxesCombined,
  Grid2X2,
  Rocket,
  ArrowRight,
} from "lucide-react";

const LOGIN_URL = "/login";

const services = [
  {
    number: "01",
    icon: FileText,
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
    icon: FolderArchive,
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
    icon: ChartNoAxesCombined,
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
    icon: Grid2X2,
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
      className="relative overflow-hidden bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-10 lg:py-16 xl:px-12"
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

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-sm dark:border-blue-400/20 dark:bg-slate-900 sm:px-4">
            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-cyan-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300 sm:text-xs sm:tracking-[0.16em]">
              Layanan Digital
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Semua Kebutuhan dalam
            <span className="mt-1 block bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
              Satu Portal Terintegrasi
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-sm sm:leading-7 md:text-base">
            Akses layanan administrasi dan informasi dengan lebih mudah.
            Dirancang untuk mendukung proses kerja yang praktis, tertata,
            dan efisien.
          </p>
        </div>

        {/* Service cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:mt-10 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-400/40 dark:hover:shadow-black/20 sm:p-6"
              >
                {/* Top accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.accent}`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 ${service.iconBg} ${service.iconColor}`}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-xs font-bold tracking-widest text-slate-300 dark:text-slate-600 sm:text-sm">
                    {service.number}
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:mt-5 sm:text-xs">
                  {service.subtitle}
                </p>

                <h3 className="mt-2 text-lg font-extrabold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-xl">
                  {service.title}
                </h3>

                <p className="mt-2 flex-1 text-[13px] leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
                  {service.description}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800 sm:mt-5 sm:pt-4">
                  <a
                    href={service.href}
                    className="inline-flex min-h-9 items-center gap-2 text-xs font-bold !text-blue-700 transition-colors hover:!text-blue-900 dark:!text-blue-400 dark:hover:!text-cyan-300 sm:text-sm"
                  >
                    <span>Jelajahi layanan</span>

                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom banner */}
        <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 px-5 py-5 shadow-xl shadow-blue-900/10 sm:mt-7 sm:px-7 sm:py-6 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10"
          />

          <div className="relative flex min-w-0 items-start gap-3 sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white sm:h-12 sm:w-12">
              <Rocket
                size={22}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-white sm:text-lg lg:text-xl">
                Mulai dari satu portal
              </h3>

              <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm sm:leading-6">
                Temukan kemudahan layanan digital untuk mendukung pekerjaanmu.
              </p>
            </div>
          </div>

          <a
            href={LOGIN_URL}
            className="relative mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 text-sm font-extrabold !text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 sm:w-fit lg:mt-0 lg:shrink-0"
          >
            Masuk ke Portal

            <ArrowRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;