import React from "react";
import {
  MessageCircle,
  Mail,
  Phone,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const helpOptions = [
  {
    icon: MessageCircle,
    title: "Bantuan dan Konsultasi",
    description:
      "Hubungi tim kami untuk mendapatkan bantuan terkait penggunaan layanan E-SPP.",
    label: "Hubungi Kami",
    href: "mailto:layanan@espp.go.id",
    accent: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    icon: Mail,
    title: "Kirim Pertanyaan",
    description:
      "Sampaikan pertanyaan atau kendala yang kamu temui saat menggunakan layanan.",
    label: "Kirim Email",
    href: "mailto:layanan@espp.go.id",
    accent: "from-violet-500 to-purple-500",
    iconBg:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
  },
  {
    icon: Phone,
    title: "Dukungan Layanan",
    description:
      "Dapatkan informasi lebih lanjut mengenai layanan dan proses administrasi E-SPP.",
    label: "Lihat Bantuan",
    href: "/login",
    accent: "from-emerald-500 to-teal-500",
    iconBg:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
];

const HelpSection = () => {
  return (
    <section
      id="bantuan"
      className="relative overflow-hidden bg-slate-50 px-4 pb-10 pt-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:pb-12 sm:pt-8 md:pb-14 lg:px-8 lg:pb-16 lg:pt-10"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-600/10 sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-600/10 sm:h-96 sm:w-96" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-8 lg:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-slate-900 dark:text-blue-300 sm:mb-4 sm:text-sm">
            <Sparkles size={15} />
            Pusat Bantuan
          </div>

          <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Butuh Bantuan Menggunakan{" "}
            <span className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              E-SPP?
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-base md:text-lg">
            Kami siap membantu kamu mendapatkan informasi dan solusi terkait
            layanan E-SPP. Pilih saluran bantuan yang sesuai dengan kebutuhanmu.
          </p>
        </div>

        {/* Help cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {helpOptions.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 sm:p-6"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} sm:h-14 sm:w-14`}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                  {item.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  {item.description}
                </p>

                <a
                  href={item.href}
                  className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold !text-blue-700 transition-colors hover:!text-indigo-700 dark:!text-blue-300 dark:hover:!text-cyan-300 sm:text-base"
                >
                  {item.label}
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-5 py-6 text-white shadow-lg shadow-blue-900/10 sm:mt-8 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10 sm:h-64 sm:w-64" />

          <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100 sm:text-sm">
                Layanan E-SPP
              </span>

              <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl lg:text-3xl">
                Siap Mengakses Layanan E-SPP?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
                Mulai gunakan layanan digital yang terintegrasi untuk
                mempermudah proses administrasi keuangan dan BMN.
              </p>
            </div>

            <a
              href="/login"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold !text-blue-700 shadow-sm transition-all hover:bg-blue-50 sm:w-auto sm:px-6 sm:text-base"
            >
              Akses E-SPP
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;