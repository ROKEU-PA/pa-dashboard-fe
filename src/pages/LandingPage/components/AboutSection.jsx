import React from "react";
import {
  Link2,
  Eye,
  Zap,
  FileText,
  ChartNoAxesCombined,
  ShieldCheck,
  Landmark,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";

const highlights = [
  {
    number: "01",
    title: "Terintegrasi",
    description:
      "Menghubungkan proses administrasi dan pengelolaan dokumen dalam satu portal.",
    icon: Link2,
    accent: "from-blue-500 to-cyan-400",
    iconStyle:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    number: "02",
    title: "Transparan",
    description:
      "Memudahkan pengguna memantau proses dan status dokumen secara terstruktur.",
    icon: Eye,
    accent: "from-violet-500 to-purple-400",
    iconStyle:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  {
    number: "03",
    title: "Efisien",
    description:
      "Mendukung alur kerja administrasi yang lebih praktis, terarah, dan mudah digunakan.",
    icon: Zap,
    accent: "from-amber-500 to-orange-400",
    iconStyle:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
];

const features = [
  {
    icon: FileText,
    label: "Dokumen",
    color: "bg-blue-500/15",
  },
  {
    icon: ChartNoAxesCombined,
    label: "Informasi",
    color: "bg-violet-500/15",
  },
  {
    icon: ShieldCheck,
    label: "Terpercaya",
    color: "bg-emerald-500/15",
  },
];

const benefits = [
  "Satu portal untuk pengelolaan administrasi",
  "Informasi dan status dokumen lebih terstruktur",
  "Akses layanan sesuai hak pengguna",
];

const AboutSection = () => {
  return (
    <section
      id="tentang"
      className="relative isolate overflow-hidden bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-12 lg:py-16 xl:px-16"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-200/40 blur-[100px] sm:h-96 sm:w-96 dark:bg-blue-600/10" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-violet-200/40 blur-[100px] sm:h-96 sm:w-96 dark:bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-8 text-center lg:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-3 py-2 shadow-sm sm:mb-4 sm:px-4 dark:border-blue-400/20 dark:bg-slate-900/80">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-xs dark:text-blue-300">
              Tentang E-SPP
            </span>
          </div>

          <h2 className="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Satu Portal,
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Administrasi Lebih Mudah.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base dark:text-slate-400">
            Portal E-SPP membantu mengelola proses administrasi dan dokumen
            melalui layanan digital yang lebih terstruktur, praktis, dan mudah
            diakses sesuai hak pengguna.
          </p>
        </div>

        {/* Main content */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          {/* Left content */}
          <div className="order-2 min-w-0 lg:order-1">
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <div className="h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-600 to-violet-600 sm:h-10" />

              <p className="text-xs font-bold uppercase tracking-[0.13em] text-blue-700 sm:text-sm sm:tracking-[0.16em] dark:text-blue-400">
                Digital Administration Platform
              </p>
            </div>

            <h3 className="max-w-xl text-2xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-3xl lg:text-3xl xl:text-4xl dark:text-white">
              Menghadirkan pengalaman administrasi yang{" "}
              <span className="text-blue-600 dark:text-blue-400">
                lebih praktis dan terarah.
              </span>
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-400">
              Dengan E-SPP, proses pengelolaan dokumen dan pemantauan
              administrasi dapat dilakukan dalam satu lingkungan digital.
              Setiap pengguna dapat mengakses layanan sesuai dengan hak dan
              kebutuhan masing-masing.
            </p>

            {/* Benefits */}
            <div className="mt-5 space-y-3 sm:mt-6">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row sm:mt-7">
              <a
                href="/login"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-700/25 focus:outline-none focus:ring-4 focus:ring-blue-300 min-[420px]:w-auto sm:px-6 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Jelajahi Portal

                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href="#layanan"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700 min-[420px]:w-auto sm:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                Lihat Layanan

                <ArrowUpRight
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative order-1 mx-auto w-full min-w-0 max-w-lg lg:order-2 lg:max-w-none">
            {/* Decorative elements */}
            <div className="absolute -left-4 top-12 h-20 w-20 rounded-3xl bg-blue-400/20 blur-2xl sm:-left-7 sm:h-24 sm:w-24" />

            <div className="absolute -right-4 bottom-10 h-24 w-24 rounded-full bg-violet-400/20 blur-2xl sm:-right-7 sm:h-32 sm:w-32" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-4 shadow-2xl shadow-blue-950/20 sm:rounded-[2rem] sm:p-6 lg:p-5 xl:p-7">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-white/[0.05]" />

              <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[35px] border-cyan-300/[0.06]" />

              <div className="relative">
                {/* Dashboard header */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-blue-200 shadow-inner backdrop-blur sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Landmark
                        size={23}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold tracking-[0.14em] text-blue-300 sm:text-[10px] sm:tracking-[0.2em]">
                        DIGITAL ADMINISTRATION
                      </p>

                      <h3 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                        Portal E-SPP
                      </h3>
                    </div>
                  </div>

                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />

                    <span className="text-[9px] font-bold tracking-wider text-emerald-300 sm:text-[10px]">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Main dashboard card */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl sm:mt-6 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-200">
                        Sistem administrasi digital
                      </p>

                      <h4 className="mt-3 text-xl font-black leading-tight text-white sm:text-3xl">
                        Semua lebih
                        <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                          terorganisir.
                        </span>
                      </h4>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-cyan-300 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Sparkles
                        size={22}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Progress decoration */}
                  <div className="mt-5 sm:mt-6">
                    <div className="mb-2 flex items-center justify-between gap-2">
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
                  <div className="mt-4 space-y-3 sm:mt-5">
                    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 transition hover:bg-white/10">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/15 text-blue-300 sm:h-10 sm:w-10">
                        <FileText
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">
                          Pengelolaan dokumen
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-blue-200 sm:text-xs">
                          Lebih terstruktur dan mudah ditelusuri
                        </p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-cyan-300"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 transition hover:bg-white/10">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300 sm:h-10 sm:w-10">
                        <ChartNoAxesCombined
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">
                          Pemantauan proses
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-blue-200 sm:text-xs">
                          Informasi status dalam satu portal
                        </p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-violet-300"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom feature tags */}
                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  {features.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-xl border border-white/10 bg-white/[0.06] px-1.5 py-3 text-center transition duration-300 hover:-translate-y-1 hover:bg-white/10 sm:px-2"
                      >
                        <div
                          className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-blue-200 sm:h-10 sm:w-10 ${item.color}`}
                        >
                          <Icon
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </div>

                        <p className="mt-2 text-[10px] font-bold text-white sm:text-xs">
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 text-center text-[9px] font-semibold tracking-[0.12em] text-blue-200/70 sm:text-[10px] sm:tracking-[0.2em]">
                  PRAKTIS • TERINTEGRASI • TERARAH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-10 grid gap-4 border-t border-slate-200/80 pt-6 sm:mt-10 sm:grid-cols-2 sm:gap-5 sm:pt-8 lg:mt-12 lg:grid-cols-3 dark:border-slate-800">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.number}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.06] sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:shadow-blue-950/20"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent} opacity-70 transition-opacity group-hover:opacity-100`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${item.iconStyle}`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-sm font-black tracking-widest text-slate-200 transition-colors group-hover:text-blue-500 dark:text-slate-700 dark:group-hover:text-blue-400">
                    {item.number}
                  </span>
                </div>

                <h4 className="mt-4 text-lg font-extrabold text-slate-900 sm:mt-5 dark:text-white">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;