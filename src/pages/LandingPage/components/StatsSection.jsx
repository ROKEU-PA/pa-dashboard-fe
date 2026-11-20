import React from "react";

const stats = [
  {
    value: "1.200+",
    label: "Dokumen Diproses",
    description: "Dokumen administrasi yang dikelola",
    icon: "📄",
    accent: "from-blue-600 to-indigo-600",
    iconBg: "bg-blue-50 dark:bg-blue-500/15",
    iconColor: "text-blue-700 dark:text-blue-300",
  },
  {
    value: "50+",
    label: "Satuan Kerja",
    description: "Satuan kerja yang terhubung",
    icon: "🏢",
    accent: "from-violet-600 to-purple-600",
    iconBg: "bg-violet-50 dark:bg-violet-500/15",
    iconColor: "text-violet-700 dark:text-violet-300",
  },
  {
    value: "98%",
    label: "Tingkat Keberhasilan",
    description: "Proses layanan berjalan lancar",
    icon: "✓",
    accent: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
    iconColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "24/7",
    label: "Akses Layanan",
    description: "Informasi mudah diakses kapan saja",
    icon: "◷",
    accent: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-50 dark:bg-orange-500/15",
    iconColor: "text-orange-700 dark:text-orange-300",
  },
];

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 transition-colors duration-300 dark:bg-slate-950 sm:px-8 sm:py-20 lg:px-16">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl dark:bg-blue-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-500/10"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400" />
            E-SPP dalam Angka
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Mendukung Layanan yang{" "}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
              Lebih Efisien
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Satu platform terintegrasi untuk membantu pengelolaan administrasi,
            dokumen, dan informasi secara lebih praktis.
          </p>
        </div>

        {/* Statistics cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-400/40 dark:hover:shadow-black/20 sm:p-7"
            >
              {/* Top accent */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`}
              />

              {/* Decorative circle */}
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-150 dark:bg-slate-800/60"
              />

              <div className="relative">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold transition-transform duration-300 group-hover:scale-110 ${stat.iconBg} ${stat.iconColor}`}
                >
                  <span aria-hidden="true">{stat.icon}</span>
                </div>

                <p className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {stat.value}
                </p>

                <h3 className="mt-2 text-base font-bold text-slate-800 dark:text-slate-200">
                  {stat.label}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>

                <div
                  className={`mt-5 h-1 w-10 rounded-full bg-gradient-to-r transition-all duration-300 group-hover:w-16 ${stat.accent}`}
                />
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

          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl text-white">
              ✨
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white sm:text-xl">
                Transformasi layanan administrasi digital
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Mendukung proses kerja yang lebih tertata, transparan, dan
                terintegrasi.
              </p>
            </div>
          </div>

          <a
            href="/login"
            className="relative mt-5 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-200/40 sm:w-fit lg:mt-0"
          >
            Akses Portal
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Dummy data notice */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
          * Angka yang ditampilkan merupakan data ilustrasi dan perlu
          disesuaikan dengan data aktual.
        </p>
      </div>
    </section>
  );
};

export default StatsSection;
