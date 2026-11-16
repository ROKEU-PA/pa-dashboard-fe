import React from "react";

const newsList = [
  {
    id: 1,
    category: "Informasi",
    date: "12 Oktober 2026",
    title: "Peningkatan Layanan Administrasi Digital",
    description:
      "Informasi mengenai pengembangan layanan digital untuk mendukung proses administrasi yang lebih efektif dan terintegrasi.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    color:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  {
    id: 2,
    category: "Pengumuman",
    date: "8 Oktober 2026",
    title: "Panduan Penggunaan Portal E-SPP",
    description:
      "Pelajari panduan penggunaan portal agar proses pengajuan dan pemantauan dokumen dapat dilakukan dengan lebih mudah.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    color:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    id: 3,
    category: "Berita",
    date: "2 Oktober 2026",
    title: "Mewujudkan Proses Kerja yang Lebih Efisien",
    description:
      "Pemanfaatan teknologi menjadi bagian dari upaya meningkatkan efisiensi dan keteraturan dalam proses kerja.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
    color:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
];

const NewsSection = () => {
  return (
    <section
      id="berita"
      className="relative overflow-hidden bg-slate-50 px-5 py-16 transition-colors duration-300 dark:bg-slate-950 sm:px-8 sm:py-20 lg:px-16"
    >
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl dark:bg-cyan-500/10"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold tracking-wide text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-slate-900 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400" />
              BERITA & INFORMASI
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Informasi{" "}
              <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
                Terkini
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Temukan informasi, pengumuman, dan perkembangan layanan dalam
              satu tempat. Tetap terhubung dengan informasi terbaru dari portal
              layanan.
            </p>
          </div>

          <a
            href="/login"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 dark:hover:border-blue-400/40 dark:hover:bg-slate-800"
          >
            Lihat informasi lainnya
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </a>
        </div>

        {/* News cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {newsList.map((news) => (
            <article
              key={news.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-400/40 dark:hover:shadow-black/20"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={news.image}
                  alt={news.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-sm ${news.color}`}
                >
                  {news.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>
                  <span>{news.date}</span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-xl">
                  {news.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {news.description}
                </p>

                <a
                  href="/login"
                  className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-cyan-300"
                >
                  Baca selengkapnya
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Information banner */}
        <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 p-6 shadow-lg shadow-blue-900/10 sm:mt-12 sm:p-8 lg:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-20 h-56 w-56 rounded-full border-[30px] border-white/5"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl"
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Tetap terhubung
              </span>

              <h3 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                Jangan lewatkan informasi terbaru
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                Pantau informasi layanan dan pengumuman melalui portal E-SPP.
              </p>
            </div>

            <a
              href="/login"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Masuk ke Portal
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
          * Berita dan tanggal di atas merupakan data ilustrasi.
        </p>
      </div>
    </section>
  );
};

export default NewsSection;
