import React from "react";

const highlights = [
  {
    number: "01",
    title: "Terintegrasi",
    description:
      "Menghubungkan proses administrasi dan pengelolaan dokumen dalam satu portal.",
    icon: "🔗",
    accent: "from-blue-500 to-cyan-400",
    iconStyle:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    number: "02",
    title: "Transparan",
    description:
      "Memudahkan pengguna memantau proses dan status dokumen secara terstruktur.",
    icon: "👁️",
    accent: "from-violet-500 to-purple-400",
    iconStyle:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  {
    number: "03",
    title: "Efisien",
    description:
      "Mendukung alur kerja administrasi yang lebih praktis, terarah, dan mudah digunakan.",
    icon: "⚡",
    accent: "from-amber-500 to-orange-400",
    iconStyle:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
];

const features = [
  { icon: "📄", label: "Dokumen", color: "bg-blue-500/15" },
  { icon: "📊", label: "Informasi", color: "bg-violet-500/15" },
  { icon: "🔒", label: "Terpercaya", color: "bg-emerald-500/15" },
];

const AboutSection = () => {
  return (
    <section
      id="tentang"
      className="relative isolate overflow-hidden bg-slate-50 px-5 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-8 sm:py-24 lg:px-16"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-200/40 blur-[100px] dark:bg-blue-600/10" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-200/40 blur-[100px] dark:bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-4 py-2 shadow-sm dark:border-blue-400/20 dark:bg-slate-900/80">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
              Tentang E-SPP
            </span>
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Satu Portal,
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Administrasi Lebih Mudah.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Portal E-SPP membantu mengelola proses administrasi dan dokumen
            melalui layanan digital yang lebih terstruktur, praktis, dan mudah
            diakses sesuai hak pengguna.
          </p>
        </div>

        {/* Main content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-600 to-violet-600" />
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-400">
                Digital Administration Platform
              </p>
            </div>

            <h3 className="max-w-xl text-2xl font-extrabold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Menghadirkan pengalaman administrasi yang{" "}
              <span className="text-blue-600 dark:text-blue-400">
                lebih praktis dan terarah.
              </span>
            </h3>

            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-600 dark:text-slate-400 sm:text-base">
              Dengan E-SPP, proses pengelolaan dokumen dan pemantauan
              administrasi dapat dilakukan dalam satu lingkungan digital.
              Setiap pengguna dapat mengakses layanan sesuai dengan hak dan
              kebutuhan masing-masing.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              {[
                "Satu portal untuk pengelolaan administrasi",
                "Informasi dan status dokumen lebih terstruktur",
                "Akses layanan sesuai hak pengguna",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="/login"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-700/25 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Jelajahi Portal
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#layanan"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                Lihat Layanan
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none">
            {/* Decorative elements */}
            <div className="absolute -left-7 top-12 h-24 w-24 rounded-3xl bg-blue-400/20 blur-2xl" />
            <div className="absolute -right-7 bottom-10 h-32 w-32 rounded-full bg-violet-400/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-5 shadow-2xl shadow-blue-950/20 sm:p-7">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-white/[0.05]" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[35px] border-cyan-300/[0.06]" />

              <div className="relative">
                {/* Dashboard header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl shadow-inner backdrop-blur">
                      🏛️
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-300">
                        DIGITAL ADMINISTRATION
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-white">
                        Portal E-SPP
                      </h3>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <span className="text-[10px] font-bold tracking-wider text-emerald-300">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Main dashboard card */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur-xl sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-blue-200">
                        Sistem administrasi digital
                      </p>
                      <h4 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                        Semua lebih
                        <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                          terorganisir.
                        </span>
                      </h4>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl">
                      ✨
                    </div>
                  </div>

                  {/* Progress decoration */}
                  <div className="mt-7">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-100">
                        Alur administrasi
                      </span>
                      <span className="text-xs font-bold text-cyan-300">
                        Terstruktur
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                    </div>
                  </div>

                  {/* Feature rows */}
                  <div className="mt-6 space-y-3">
                    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 transition hover:bg-white/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/15 text-lg">
                        📄
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">
                          Pengelolaan dokumen
                        </p>
                        <p className="mt-1 text-xs text-blue-200">
                          Lebih terstruktur dan mudah ditelusuri
                        </p>
                      </div>
                      <span className="text-cyan-300">↗</span>
                    </div>

                    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 transition hover:bg-white/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/15 text-lg">
                        📊
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">
                          Pemantauan proses
                        </p>
                        <p className="mt-1 text-xs text-blue-200">
                          Informasi status dalam satu portal
                        </p>
                      </div>
                      <span className="text-violet-300">↗</span>
                    </div>
                  </div>
                </div>

                {/* Bottom feature tags */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {features.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-3 text-center transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-lg ${item.color}`}
                      >
                        {item.icon}
                      </div>
                      <p className="mt-2 text-[11px] font-bold text-white sm:text-xs">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-center text-[10px] font-semibold tracking-[0.2em] text-blue-200/70">
                  PRAKTIS • TERINTEGRASI • TERARAH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-20 grid gap-5 border-t border-slate-200/80 pt-10 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.number}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.06] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:shadow-blue-950/20"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent} opacity-70 transition-opacity group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${item.iconStyle}`}
                >
                  {item.icon}
                </div>
                <span className="text-sm font-black tracking-widest text-slate-200 transition-colors group-hover:text-blue-500 dark:text-slate-700 dark:group-hover:text-blue-400">
                  {item.number}
                </span>
              </div>

              <h4 className="mt-5 text-lg font-extrabold text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
