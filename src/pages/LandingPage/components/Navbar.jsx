import React, { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  ArrowUpRight,
  Menu,
  X,
  Check,
} from "lucide-react";
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

  // Tutup menu mobile ketika layar memasuki ukuran tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
          ? "border-b border-slate-200/60 bg-white/90 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90"
          : "bg-transparent py-3 sm:py-4"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-12">

        {/* Brand */}
        <a
          href="#beranda"
          onClick={() => handleMenuClick("#beranda")}
          className="group flex min-w-0 shrink items-center gap-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 sm:gap-2 lg:gap-2.5"
        >
          <img
            src="/kemnaker-logo-darker.webp"
            alt="Logo Kementerian Ketenagakerjaan RI"
            className={`h-8 w-8 shrink-0 object-contain transition-all duration-300 group-hover:scale-105 sm:h-10 sm:w-10 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
          />

          <div className="min-w-0">
            <p
              className={`whitespace-nowrap text-[9px] font-extrabold uppercase tracking-wide transition-colors sm:text-[10px] md:text-[11px] lg:text-xs xl:text-sm ${
                scrolled
                  ? "!text-slate-900 dark:!text-white"
                  : "!text-white"
              }`}
            >
              Kementerian Ketenagakerjaan RI
            </p>

            <p
              className={`mt-0.5 whitespace-nowrap text-[9px] font-semibold tracking-wide transition-colors sm:text-[10px] lg:mt-1 lg:text-xs ${
                scrolled
                  ? "!text-slate-500 dark:!text-slate-300"
                  : "!text-slate-200"
              }`}
            >
              Biro Keuangan dan BMN
            </p>
          </div>
        </a>

        {/* Desktop / Tablet Navigation */}
        <div
          className={`hidden w-fit shrink-0 items-center justify-center gap-1 rounded-full border p-1 backdrop-blur-xl md:flex lg:gap-1.5 lg:p-1.5 xl:gap-2 ${
            scrolled
              ? "border-slate-200 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-800/90"
              : "border-white/30 bg-white/15 shadow-sm"
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
                className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[10px] font-semibold tracking-wide transition-all duration-200 sm:px-3 sm:text-[11px] lg:px-3.5 lg:py-2.5 lg:text-xs xl:px-4 ${
                  active
                    ? scrolled
                      ? "bg-blue-50 !text-blue-700 shadow-sm dark:bg-white/15 dark:!text-cyan-300"
                      : "bg-white/95 !text-slate-800 shadow-md"
                    : scrolled
                      ? "!text-slate-600 hover:bg-white hover:!text-blue-700 dark:!text-slate-200 dark:hover:bg-white/10 dark:hover:!text-white"
                      : "!text-white hover:bg-white/15 hover:!text-white"
                }`}
              >
                {item.label}

                {active && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                      scrolled && theme === "light"
                        ? "bg-blue-600"
                        : "bg-cyan-400"
                    }`}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2">

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Light mode aktif, klik untuk dark mode"
                : "Dark mode aktif, klik untuk light mode"
            }
            title={theme === "light" ? "Light Mode" : "Dark Mode"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-90 sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${
              theme === "light"
                ? scrolled
                  ? "border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100"
                  : "border-amber-200/60 bg-amber-300/25 text-amber-300 hover:bg-amber-300/35"
                : scrolled
                  ? "border-indigo-400/30 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                  : "border-indigo-200/50 bg-indigo-400/25 text-indigo-200 hover:bg-indigo-400/35"
            }`}
          >
            {theme === "light" ? (
              <Sun
                key="sun"
                size={17}
                strokeWidth={2.2}
                className="animate-[spin_0.5s_ease-out_1]"
              />
            ) : (
              <Moon
                key="moon"
                size={17}
                strokeWidth={2.2}
                className="animate-[spin_0.5s_ease-out_1]"
              />
            )}
          </button>

          {/* Login Button */}
          <a
            href={LOGIN_URL}
            className="hidden shrink-0 items-center gap-1 rounded-lg bg-cyan-300 px-2 py-2 text-[10px] font-extrabold !text-slate-950 shadow-md shadow-blue-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-200 sm:inline-flex lg:gap-1.5 lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-xs xl:px-4 xl:text-sm"
          >
            Masuk
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition sm:h-9 sm:w-9 md:hidden ${
              scrolled
                ? "border-slate-200 bg-white text-slate-800 dark:border-white/15 dark:bg-white/10 dark:text-white"
                : "border-white/40 bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full mx-3 mt-2 max-h-[calc(100vh-90px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl sm:mx-5 dark:border-white/10 dark:bg-slate-900/95 md:hidden">
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
                    ? "bg-blue-50 !text-blue-700 dark:bg-blue-500/15 dark:!text-cyan-300"
                    : "!text-slate-600 hover:bg-slate-50 dark:!text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                {item.label}

                {active && (
                  <Check
                    size={16}
                    className="text-cyan-500"
                    aria-label="Menu aktif"
                  />
                )}
              </a>
            );
          })}

          <a
            href={LOGIN_URL}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-extrabold !text-slate-950 transition hover:bg-cyan-200"
          >
            Masuk ke Portal
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;