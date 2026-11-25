import React, { useState } from "react";
import {
  Lightbulb,
  MessageCircle,
  FileText,
  ChartNoAxesCombined,
  LockKeyhole,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const faqList = [
  {
    question: "Apa itu portal E-SPP?",
    answer:
      "E-SPP adalah portal digital yang membantu proses administrasi dan pengelolaan dokumen jadi lebih terstruktur. Semua layanan yang tersedia mengikuti fitur dan hak akses pada aplikasi.",
    tag: "Tentang portal",
  },
  {
    question: "Gimana cara masuk ke E-SPP?",
    answer:
      "Klik tombol Masuk ke Portal, lalu login menggunakan akun yang sudah terdaftar. Setelah berhasil login, kamu bisa mengakses layanan sesuai hak akses akunmu.",
    tag: "Panduan login",
  },
  {
    question: "Siapa yang bisa menggunakan portal ini?",
    answer:
      "Portal dapat digunakan oleh pengguna yang memiliki akun dan hak akses sesuai ketentuan aplikasi. Jika belum memiliki akses, silakan hubungi administrator atau petugas yang berwenang.",
    tag: "Akses pengguna",
  },
  {
    question: "Cara cek status pengajuan gimana?",
    answer:
      "Setelah login, buka menu layanan yang relevan dan periksa status pengajuan pada halaman yang tersedia. Informasi yang ditampilkan menyesuaikan hak akses akunmu.",
    tag: "Status pengajuan",
  },
  {
    question: "Kalau ada kendala, harus ke mana?",
    answer:
      "Pastikan informasi yang kamu masukkan sudah benar dan koneksi internet stabil. Jika kendala masih terjadi, hubungi administrator atau petugas layanan yang berwenang.",
    tag: "Bantuan",
  },
];

const serviceFeatures = [
  {
    icon: FileText,
    label: "Dokumen",
  },
  {
    icon: ChartNoAxesCombined,
    label: "Informasi",
  },
  {
    icon: LockKeyhole,
    label: "Akses",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-white px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-10 lg:py-16 xl:px-16"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-blue-100/70 blur-[100px] dark:bg-blue-600/10 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-64 w-64 rounded-full bg-violet-100/70 blur-[100px] dark:bg-violet-600/10 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-8 lg:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1.5 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/10 sm:mb-4 sm:px-4 sm:py-2">
            <Lightbulb
              size={17}
              strokeWidth={1.8}
              className="text-blue-600 dark:text-blue-300"
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300 sm:text-xs sm:tracking-[0.18em]">
              Pusat Informasi
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Ada yang ingin
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              kamu tanyakan?
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-base sm:leading-7">
            Temukan jawaban dari pertanyaan yang sering diajukan seputar
            penggunaan portal E-SPP. Informasi singkat untuk membantu
            pengalaman penggunaan yang lebih mudah.
          </p>
        </div>

        {/* FAQ layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8 xl:gap-10">
          {/* Left help panel */}
          <aside className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-5 shadow-2xl shadow-blue-950/15 sm:rounded-3xl sm:p-6 md:p-7 lg:sticky lg:top-24 lg:rounded-[2rem] lg:p-7 xl:p-8">
            {/* Decorations */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border-[25px] border-white/[0.08] sm:h-48 sm:w-48 sm:border-[30px] lg:h-56 lg:w-56 lg:border-[35px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-white/[0.06] blur-sm sm:h-60 sm:w-60 lg:h-64 lg:w-64" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-inner backdrop-blur sm:h-14 sm:w-14 sm:rounded-2xl">
                <MessageCircle
                  size={25}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200 sm:mt-6 sm:text-xs sm:tracking-[0.2em]">
                We're here to help
              </p>

              <h3 className="mt-2 text-xl font-black leading-snug text-white sm:text-2xl md:text-3xl">
                Butuh bantuan lebih lanjut?
              </h3>

              <p className="mt-3 text-sm leading-6 text-blue-100 sm:leading-7">
                Jika belum menemukan jawaban yang sesuai, kamu bisa masuk ke
                portal dan menghubungi administrator atau petugas yang
                berwenang.
              </p>

              <a
                href="/login"
                className="group mt-5 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 sm:mt-6 sm:min-h-12 sm:w-auto"
              >
                Masuk ke Portal
                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              {/* Bottom information */}
              <div className="mt-6 border-t border-white/20 pt-4 sm:mt-7 sm:pt-5">
                <p className="text-xs font-semibold text-blue-100">
                  Layanan digital E-SPP
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {serviceFeatures.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-lg border border-white/10 bg-white/[0.08] px-1.5 py-3 text-center backdrop-blur-sm sm:rounded-xl sm:px-2"
                      >
                        <div className="flex justify-center text-blue-100">
                          <Icon
                            size={20}
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
              </div>
            </div>
          </aside>

          {/* Right accordion */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-blue-600 dark:text-blue-400 sm:text-xs sm:tracking-[0.16em]">
                  Frequently Asked Questions
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
                  Pertanyaan populer
                </h3>
              </div>

              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:px-3 sm:text-xs">
                {faqList.length} Topik
              </span>
            </div>

            <div className="space-y-3">
              {faqList.map((faq, index) => {
                const isOpen = activeIndex === index;
                const answerId = `faq-answer-${index}`;

                return (
                  <article
                    key={faq.question}
                    className={`group min-w-0 overflow-hidden rounded-xl border transition-all duration-300 sm:rounded-2xl ${
                      isOpen
                        ? "border-blue-200 bg-blue-50/50 shadow-lg shadow-blue-900/[0.05] dark:border-blue-500/40 dark:bg-slate-900 dark:shadow-blue-950/20"
                        : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-blue-500/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex min-h-16 w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left sm:min-h-[4.5rem] sm:gap-4 sm:px-5 sm:py-4"
                    >
                      <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-black transition-all duration-300 sm:h-10 sm:w-10 sm:rounded-xl sm:text-xs ${
                            isOpen
                              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-300"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0">
                          <span
                            className={`block text-[13px] font-bold leading-5 transition-colors sm:text-base sm:leading-6 ${
                              isOpen
                                ? "text-blue-800 dark:text-blue-300"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {faq.question}
                          </span>

                          <span className="mt-1 block text-[10px] font-medium text-slate-400 dark:text-slate-500 sm:text-[11px]">
                            {faq.tag}
                          </span>
                        </span>
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-9 sm:w-9 ${
                          isOpen
                            ? "rotate-180 bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-300"
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown
                          size={17}
                          strokeWidth={2}
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        className="px-3.5 pb-4 sm:px-5 sm:pb-5"
                      >
                        <div className="ml-12 border-l-2 border-blue-200 pl-3 dark:border-blue-500/30 sm:ml-14 sm:pl-4">
                          <p className="text-xs leading-6 text-slate-600 dark:text-slate-400 sm:text-sm sm:leading-7">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-7 flex flex-col items-center justify-center gap-2 text-center sm:mt-8 sm:flex-row">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <Sparkles
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <p className="max-w-2xl text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
            Belum menemukan jawaban? Hubungi administrator yang berwenang
            untuk mendapatkan bantuan lebih lanjut.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;