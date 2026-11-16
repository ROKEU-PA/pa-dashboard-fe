import React, { useState } from "react";

const faqList = [
  {
    question: "Apa itu portal E-SPP? ✨",
    answer:
      "E-SPP adalah portal digital yang membantu proses administrasi dan pengelolaan dokumen jadi lebih terstruktur. Semua layanan yang tersedia mengikuti fitur dan hak akses pada aplikasi.",
    tag: "Tentang portal",
  },
  {
    question: "Gimana cara masuk ke E-SPP? 👋",
    answer:
      "Klik tombol Masuk ke Portal, lalu login menggunakan akun yang sudah terdaftar. Setelah berhasil login, kamu bisa mengakses layanan sesuai hak akses akunmu.",
    tag: "Panduan login",
  },
  {
    question: "Siapa yang bisa menggunakan portal ini? 🔐",
    answer:
      "Portal dapat digunakan oleh pengguna yang memiliki akun dan hak akses sesuai ketentuan aplikasi. Jika belum memiliki akses, silakan hubungi administrator atau petugas yang berwenang.",
    tag: "Akses pengguna",
  },
  {
    question: "Cara cek status pengajuan gimana? 📊",
    answer:
      "Setelah login, buka menu layanan yang relevan dan periksa status pengajuan pada halaman yang tersedia. Informasi yang ditampilkan menyesuaikan hak akses akunmu.",
    tag: "Status pengajuan",
  },
  {
    question: "Kalau ada kendala, harus ke mana? 💬",
    answer:
      "Pastikan informasi yang kamu masukkan sudah benar dan koneksi internet stabil. Jika kendala masih terjadi, hubungi administrator atau petugas layanan yang berwenang.",
    tag: "Bantuan",
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
      className="relative isolate overflow-hidden bg-white px-5 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-8 sm:py-24 lg:px-16"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-100/70 blur-[100px] dark:bg-blue-600/10" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-100/70 blur-[100px] dark:bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-4 py-2 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/10">
            <span className="text-base">💡</span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
              Pusat Informasi
            </span>
          </div>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Ada yang ingin
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              kamu tanyakan?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Temukan jawaban dari pertanyaan yang sering diajukan seputar
            penggunaan portal E-SPP. Informasi singkat untuk membantu
            pengalaman penggunaan yang lebih mudah.
          </p>
        </div>

        {/* FAQ layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          {/* Left help panel */}
          <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-7 shadow-2xl shadow-blue-950/15 sm:p-9">
            {/* Decorations */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[35px] border-white/[0.08]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/[0.06] blur-sm" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl shadow-inner backdrop-blur">
                💬
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                We're here to help
              </p>

              <h3 className="mt-3 text-2xl font-black leading-snug text-white sm:text-3xl">
                Butuh bantuan lebih lanjut?
              </h3>

              <p className="mt-4 text-sm leading-7 text-blue-100">
                Jika belum menemukan jawaban yang sesuai, kamu bisa masuk ke
                portal dan menghubungi administrator atau petugas yang
                berwenang.
              </p>

              <a
                href="/login"
                className="group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 sm:w-auto"
              >
                Masuk ke Portal
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              {/* Bottom information */}
              <div className="mt-9 border-t border-white/20 pt-6">
                <p className="text-xs font-semibold text-blue-100">
                  Layanan digital E-SPP
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: "📄", label: "Dokumen" },
                    { icon: "📊", label: "Informasi" },
                    { icon: "🔒", label: "Akses" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/[0.08] px-2 py-3 text-center backdrop-blur-sm"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <p className="mt-2 text-[10px] font-bold text-white sm:text-xs">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right accordion */}
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Frequently Asked Questions
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                  Pertanyaan populer
                </h3>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
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
                    className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
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
                      className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:px-5"
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-300 ${
                            isOpen
                              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-300"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0">
                          <span
                            className={`block text-sm font-bold leading-6 transition-colors sm:text-base ${
                              isOpen
                                ? "text-blue-800 dark:text-blue-300"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {faq.question}
                          </span>
                          <span className="mt-1 block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {faq.tag}
                          </span>
                        </span>
                      </span>

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-300"
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                        >
                          <path
                            d="m6 9 6 6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        className="px-4 pb-5 sm:px-5"
                      >
                        <div className="ml-14 border-l-2 border-blue-200 pl-4 dark:border-blue-500/30">
                          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
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
        <div className="mt-12 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm dark:bg-blue-500/10">
            ✨
          </span>
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
            Belum menemukan jawaban? Hubungi administrator yang berwenang
            untuk mendapatkan bantuan lebih lanjut.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
