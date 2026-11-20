import React from "react";
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
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-14 lg:px-16">
        {/* Main footer */}
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10">
          {/* Brand */}
          <div>
            <a
              href="#beranda"
              className="group inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 text-xl font-black text-white shadow-lg shadow-blue-950/40 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                E
              </div>

              <div>
                <p className="text-lg font-extrabold tracking-wide text-white">
                  E-SPP
                </p>
                <p className="text-xs text-slate-400">
                  Portal Layanan Terintegrasi
                </p>
              </div>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Mendukung proses administrasi dan pengelolaan dokumen melalui
              layanan digital yang terstruktur, praktis, dan efisien.
            </p>

            <a
              href={LOGIN_URL}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              Masuk ke Portal
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Navigasi
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-300 focus:text-cyan-300 focus:outline-none"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Layanan
            </h3>

            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-300 focus:text-cyan-300 focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="text-blue-400 transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Pusat Informasi
            </h3>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Butuh informasi atau mengalami kendala saat menggunakan portal?
              Hubungi administrator atau petugas layanan yang berwenang.
            </p>

            <a
              href="#bantuan"
              className="mt-4 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-cyan-300 transition duration-200 hover:gap-3 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Kunjungi Pusat Bantuan
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500 sm:text-sm">
            © {currentYear} E-SPP. Hak cipta dilindungi.
          </p>

          <a
            href="#beranda"
            className="group inline-flex w-fit items-center gap-2 rounded-lg text-xs font-semibold text-slate-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:text-sm"
          >
            Kembali ke atas
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-400/40 group-hover:bg-blue-500/10"
            >
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
