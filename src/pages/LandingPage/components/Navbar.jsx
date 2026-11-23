import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
const LOGIN_URL = "/login";
const menuItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Layanan", href: "#layanan" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Informasi", href: "#berita" },
  { label: "Bantuan", href: "#bantuan" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState("beranda");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sectionIds = menuItems.map((item) =>
      item.href.replace("#", "")
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 160;
      let currentSection = "beranda";

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (section && section.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuClick = (href) => {
    setActiveSection(href.replace("#", ""));
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/60 bg-white/85 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:px-16">
        {/* Brand */}
        <a
          href="#beranda"
          onClick={() => handleMenuClick("#beranda")}
          className="group flex shrink-0 items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <img
            src="/kemnaker-logo-darker.webp"
            alt="Logo Kementerian Ketenagakerjaan RI"
            className="h-12 w-12 shrink-0 object-contain transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
          />

          <div>
            <p
              className={`text-[10px] font-extrabold uppercase tracking-wide transition-colors sm:text-sm ${
                scrolled
                  ? "text-slate-900 dark:text-white"
                  : "text-white"
              }`}
            >
              Kementerian Ketenagakerjaan RI
            </p>

            <p
              className={`mt-1 text-[10px] font-semibold transition-colors sm:text-xs ${
                scrolled
                  ? "text-slate-500 dark:text-slate-400"
                  : "text-blue-100/80"
              }`}
            >
              Biro Keuangan dan BMN
            </p>
          </div>
        </a>

        {/* Desktop menu */}
        <div
          className={`hidden items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl sm:flex ${
            scrolled
              ? "border-slate-200 bg-slate-100/80 dark:border-white/10 dark:bg-white/5"
              : "border-white/10 bg-slate-950/20"
          }`}
        >
          {menuItems.map((item) => {
            const id = item.href.replace("#", "");
            const active = activeSection === id;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleMenuClick(item.href)}
                className={`relative rounded-full px-4 py-2.5 text-xs font-bold transition duration-200 ${
                  active
                    ? scrolled
                      ? "bg-white text-blue-700 shadow-sm dark:bg-white/15 dark:text-cyan-300"
                      : "bg-white/20 text-white"
                    : scrolled
                      ? "text-slate-600 hover:bg-white hover:text-blue-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}

                {active && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                      scrolled && theme === "light"
                        ? "bg-blue-600"
                        : "bg-cyan-300"
                    }`}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Aktifkan light mode"
                : "Aktifkan dark mode"
            }
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg backdrop-blur-md transition duration-200 hover:scale-105 ${
              scrolled
                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Login */}
          <a
            href={LOGIN_URL}
            className="hidden items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-extrabold text-slate-950 shadow-md shadow-blue-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-200 sm:inline-flex"
          >
            Masuk
            <span aria-hidden="true">↗</span>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition sm:hidden ${
              scrolled
                ? "border-slate-200 bg-white text-slate-800 dark:border-white/15 dark:bg-white/10 dark:text-white"
                : "border-white/20 bg-white/10 text-white"
            }`}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:hidden">
          {menuItems.map((item) => {
            const id = item.href.replace("#", "");
            const active = activeSection === id;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleMenuClick(item.href)}
                className={`mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-cyan-300"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                {item.label}

                {active && (
                  <span className="text-cyan-500">●</span>
                )}
              </a>
            );
          })}

          <a
            href={LOGIN_URL}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-200"
          >
            Masuk ke Portal
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;