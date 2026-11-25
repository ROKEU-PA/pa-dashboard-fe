import React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  Landmark,
} from "lucide-react";

const LOGIN_URL = "/login";
const ESPP_URL = "/e-spp";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Beranda", href: "#beranda" },
    { label: "Layanan", href: "#layanan" },
    { label: "Tentang Kami", href: "#tentang" },
    { label: "Berita", href: "#berita" },
    { label: "Bantuan", href: "#bantuan" },
  ];

  const services = [
    { label: "E-SPP", href: ESPP_URL },
    { label: "E-Arsip", href: "/e-arsip" },
    { label: "Data & Informasi", href: LOGIN_URL },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-32 top-0 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

      <div className="pointer-events-none absolute -right-32 top-10 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl sm:h-72 sm:w-72 lg:h-80 lg:w-80" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl sm:h-48 sm:w-96" />

      <div className="relative mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 sm:pb-5 sm:pt-10 md:px-8 md:pt-12 lg:px-10 xl:px-16">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-8 xl:gap-10">
          {/* Brand */}
          <div className="min-w-0">
            <a
              href="#beranda"
              className="group inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 text-white shadow-lg shadow-blue-950/40 transition duration-300 group-hover:scale-105 group-hover:rotate-3 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Landmark size={22} strokeWidth={2} className="sm:hidden" />
                <Landmark
                  size={24}
                  strokeWidth={2}
                  className="hidden sm:block"
                />
              </div>

              <div>
                <p className="text-base font-extrabold tracking-wide !text-white sm:text-lg">
                  E-SPP
                </p>
                <p className="text-[11px] !text-slate-400 sm:text-xs">
                  Portal Layanan Terintegrasi
                </p>
              </div>
            </a>

            <p className="mt-3 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">
              Mendukung proses administrasi dan pengelolaan dokumen melalui
              layanan digital yang terstruktur, praktis, dan efisien.
            </p>

            <a
              href={LOGIN_URL}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold !text-white shadow-lg shadow-blue-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/30 sm:text-sm"
            >
              Masuk ke Portal
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          {/* Quick links */}
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Navigasi
            </h3>

            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-xs !text-slate-400 transition-colors duration-200 hover:!text-cyan-300 focus:!text-cyan-300 focus:outline-none sm:text-sm"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Layanan
            </h3>

            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    className="group inline-flex items-center gap-2 text-xs !text-slate-400 transition-colors duration-200 hover:!text-cyan-300 focus:!text-cyan-300 focus:outline-none sm:text-sm"
                  >
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-blue-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Pusat Informasi
            </h3>

            <p className="mt-3 text-xs leading-6 text-slate-400 sm:mt-4 sm:text-sm sm:leading-7">
              Butuh informasi atau mengalami kendala saat menggunakan portal?
              Hubungi administrator atau petugas layanan yang berwenang.
            </p>

            <a
              href="#bantuan"
              className="mt-3 inline-flex items-center gap-2 rounded-lg text-xs font-bold !text-cyan-300 transition duration-200 hover:gap-3 hover:!text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:text-sm"
            >
              Kunjungi Pusat Bantuan
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <p className="text-[11px] leading-5 text-slate-500 sm:text-xs md:text-sm">
            © {currentYear} E-SPP. Hak cipta dilindungi.
          </p>

          <a
            href="#beranda"
            className="group inline-flex w-fit items-center gap-2 rounded-lg text-xs font-semibold !text-slate-400 transition hover:!text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:text-sm"
          >
            Kembali ke atas
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-400/40 group-hover:bg-blue-500/10">
              <ArrowUp size={15} aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;