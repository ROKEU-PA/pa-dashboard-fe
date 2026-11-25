import React from "react";
import {
  FileText,
  Building2,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const LOGIN_URL = "/login";

const highlights = [
  {
    icon: FileText,
    title: "Dokumen Terpusat",
    desc: "Dokumen administrasi tersimpan rapi dalam satu tempat.",
    bar: "from-blue-600 to-indigo-600",
    dot: "bg-blue-600",
    iconBox: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  },
  {
    icon: Building2,
    title: "Satuan Kerja Terhubung",
    desc: "Seluruh satuan kerja memakai alur yang sama.",
    bar: "from-violet-600 to-purple-600",
    dot: "bg-violet-600",
    iconBox:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  {
    icon: ShieldCheck,
    title: "Proses Terpantau",
    desc: "Status pengajuan bisa dipantau tahap demi tahap.",
    bar: "from-emerald-500 to-teal-500",
    dot: "bg-emerald-500",
    iconBox:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  {
    icon: Clock,
    title: "Akses Kapan Saja",
    desc: "Informasi mudah diakses kapan saja dibutuhkan.",
    bar: "from-orange-500 to-amber-500",
    dot: "bg-orange-500",
    iconBox:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  },
];

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-12 md:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
            Keunggulan E-SPP
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl">
            Mendukung Layanan yang
            <span className="block text-blue-600 dark:text-cyan-300">
              Lebih Efisien
            </span>
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Satu platform terintegrasi untuk membantu pengelolaan administrasi,
            dokumen, dan informasi secara lebih praktis.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 sm:p-6"
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.bar}`}
                />

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBox}`}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>

                <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.desc}
                </p>

                <span
                  className={`mt-4 block h-1 w-8 rounded-full ${item.dot}`}
                />
              </div>
            );
          })}
        </div>

        {/* Banner */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-600 p-5 shadow-lg sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white sm:text-lg">
                Transformasi layanan administrasi digital
              </h3>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                Mendukung proses kerja yang lebih tertata, transparan, dan
                terintegrasi.
              </p>
            </div>
          </div>

          <a
            href={LOGIN_URL}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-extrabold !text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 sm:text-sm"
          >
            Akses Portal
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;