import React from "react";
import {
  LockKeyhole,
  ClipboardList,
  FileEdit,
  ChartNoAxesCombined,
  Sparkles,
  Rocket,
  ArrowUpRight,
} from "lucide-react";

const LOGIN_URL = "/login";

const steps = [
  {
    number: "01",
    title: "Masuk ke Portal",
    description:
      "Login menggunakan akun terdaftar untuk mulai mengakses layanan sesuai hak aksesmu.",
    icon: LockKeyhole,
    color: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    number: "02",
    title: "Pilih Layanan",
    description:
      "Pilih layanan yang sesuai dengan kebutuhan administrasi atau pengelolaan dokumen.",
    icon: ClipboardList,
    color: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
  },
  {
    number: "03",
    title: "Proses Pengajuan",
    description:
      "Lengkapi informasi dan dokumen yang diperlukan mengikuti alur layanan.",
    icon: FileEdit,
    color: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-50 dark:bg-cyan-500/10",
  },
  {
    number: "04",
    title: "Pantau Status",
    description:
      "Periksa perkembangan dan status pengajuan melalui halaman yang tersedia.",
    icon: ChartNoAxesCombined,
    color: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-white px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-12 lg:py-16 xl:px-16"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-28 top-24 h-52 w-52 rounded-full bg-blue-100/60 blur-3xl sm:h-64 sm:w-64 dark:bg-blue-600/10" />

      <div className="pointer-events-none absolute -right-28 bottom-10 h-60 w-60 rounded-full bg-violet-100/50 blur-3xl sm:h-72 sm:w-72 dark:bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-2 text-[10px] font-bold tracking-wide text-blue-700 sm:px-4 sm:text-xs dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
            <Sparkles size={15} aria-hidden="true" />
            SIMPLE USER JOURNEY
          </span>

          <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            Gampang kok,
            <span className="mt-1 block bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              cuma 4 langkah.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
            Mulai dari login sampai memantau pengajuan, ikuti alur penggunaan
            portal E-SPP yang praktis dan terstruktur.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 dark:from-blue-500/30 dark:via-violet-500/30 dark:to-emerald-500/30 lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.05] sm:p-6 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500/40 dark:hover:shadow-blue-950/20"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-16 sm:w-16 ${step.color}`}
                  >
                    <Icon
                      size={25}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-2xl font-black tracking-tight text-slate-100 transition-colors group-hover:text-blue-100 sm:text-3xl dark:text-slate-800 dark:group-hover:text-slate-700">
                    {step.number}
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <h3 className="text-base font-extrabold text-slate-900 transition-colors group-hover:text-blue-700 sm:text-lg dark:text-white dark:group-hover:text-blue-400">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span
                    className={`h-1.5 w-7 rounded-full bg-gradient-to-r transition-all duration-300 group-hover:w-12 ${step.color}`}
                  />

                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    LANGKAH {step.number}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-6 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 p-4 sm:mt-7 sm:flex-row sm:items-center sm:p-5 dark:border-blue-400/15 dark:from-blue-950/50 dark:via-indigo-950/40 dark:to-violet-950/50">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm sm:h-11 sm:w-11 dark:bg-slate-800 dark:text-blue-400">
              <Rocket size={21} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 sm:text-base dark:text-white">
                Siap mulai menggunakan E-SPP?
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm dark:text-slate-400">
                Masuk ke portal untuk mengakses layanan yang tersedia.
              </p>
            </div>
          </div>

          <a
            href={LOGIN_URL}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold !text-white shadow-md shadow-blue-700/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-500/30 sm:w-auto"
          >
            Masuk ke Portal

            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;