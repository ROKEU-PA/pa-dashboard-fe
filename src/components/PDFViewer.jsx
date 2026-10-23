import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, Printer } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./PDFViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const PDF_OPTIONS = {
  isEvalSupported: false,
  cMapUrl: "/pdfjs/cmaps/",
  standardFontDataUrl: "/pdfjs/standard_fonts/",
  wasmUrl: "/pdfjs/wasm/",
  iccUrl: "/pdfjs/iccs/",
};

function PdfPage({ number, root, width, onVisible, onRendered }) {
  const elementRef = useRef(null);
  const [active, setActive] = useState(number === 1);
  const [ratio, setRatio] = useState(1.414);

  useEffect(() => {
    if (!root || !elementRef.current) return;

    const renderObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { root, rootMargin: "800px 0px" },
    );

    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(number);
      },
      { root, threshold: 0.15 },
    );

    renderObserver.observe(elementRef.current);
    visibleObserver.observe(elementRef.current);

    return () => {
      renderObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [root, number, onVisible]);

  return (
    <div
      ref={elementRef}
      data-pdf-page={number}
      className="pa-pdf-page"
      style={{ width, minHeight: width * ratio }}
    >
      {active && (
        <Page
          suspense={false}
          pageNumber={number}
          width={width}
          onLoadSuccess={(page) => {
            const viewport = page.getViewport({ scale: 1 });
            setRatio(viewport.height / viewport.width);
          }}
          onRenderSuccess={() => onRendered(number)}
          loading={<p>Memuat halaman {number}…</p>}
          error={<p>Halaman {number} gagal ditampilkan.</p>}
        />
      )}
    </div>
  );
}

export default function CustomPDFViewer({
  pdfSource,
  frameless = false,
  onReachBottom,
}) {
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState("");
  const [doc, setDoc] = useState(null);
  const [root, setRoot] = useState(null);
  const [width, setWidth] = useState(700);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPages, setSearchPages] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const renderedPages = useRef(new Set());
  const notified = useRef(false);
  const callbackRef = useRef(onReachBottom);
  callbackRef.current = onReachBottom;

  useEffect(() => {
    const controller = new AbortController();
    let valid = true;

    setLoaded(null);
    setDoc(null);
    setError("");
    setPage(1);
    setZoom(1);
    setSearchQuery("");
    renderedPages.current.clear();
    notified.current = false;

    if (!pdfSource) return () => controller.abort();

    async function loadPdf() {
      try {
        let data;

        if (typeof pdfSource === "string") {
          const response = await fetch(pdfSource, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Gagal mengambil PDF: HTTP ${response.status}`);
          }

          data = new Uint8Array(await response.arrayBuffer());
        } else if (pdfSource instanceof Blob) {
          data = new Uint8Array(await pdfSource.arrayBuffer());
        } else if (pdfSource instanceof ArrayBuffer) {
          data = new Uint8Array(pdfSource.slice(0));
        } else if (ArrayBuffer.isView(pdfSource)) {
          data = new Uint8Array(
            pdfSource.buffer.slice(
              pdfSource.byteOffset,
              pdfSource.byteOffset + pdfSource.byteLength,
            ),
          );
        } else {
          throw new Error("Sumber PDF tidak didukung.");
        }

        if (valid) setLoaded({ source: pdfSource, data });
      } catch (err) {
        if (valid && err.name !== "AbortError") {
          setError(err.message || "Gagal memuat PDF.");
        }
      }
    }

    loadPdf();

    return () => {
      valid = false;
      controller.abort();
    };
  }, [pdfSource]);

  // PDF.js dapat memindahkan buffer ke worker, jadi berikan salinan.
  const file = useMemo(
    () => (loaded?.source === pdfSource ? { data: loaded.data.slice() } : null),
    [loaded, pdfSource],
  );

  useEffect(() => {
    if (!root) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(100, entry.contentRect.width - 32));
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, [root]);

  const checkBottom = useCallback(() => {
    if (
      !root ||
      !doc ||
      notified.current ||
      !renderedPages.current.has(doc.numPages)
    ) {
      return;
    }

    if (root.scrollTop + root.clientHeight >= root.scrollHeight - 32) {
      notified.current = true;
      callbackRef.current?.();
    }
  }, [root, doc]);

  const onRendered = useCallback(
    (number) => {
      renderedPages.current.add(number);
      checkBottom();
    },
    [checkBottom],
  );

  const onVisible = useCallback((number) => setPage(number), []);

  const goToPage = useCallback(
    (number) => {
      if (!root || !doc) return;

      const target = Math.max(1, Math.min(doc.numPages, Number(number) || 1));

      const element = root.querySelector(`[data-pdf-page="${target}"]`);

      if (element) {
        root.scrollTop +=
          element.getBoundingClientRect().top -
          root.getBoundingClientRect().top -
          16;
      }

      setPage(target);
    },
    [root, doc],
  );

  useEffect(() => {
    let active = true;
    const keyword = searchQuery.trim().toLocaleLowerCase();

    setSearchPages([]);
    setSearchIndex(0);
    setSearchError("");
    setIsSearching(false);

    if (!doc || !keyword) {
      return () => {
        active = false;
      };
    }

    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = [];

        for (let number = 1; number <= doc.numPages; number++) {
          if (!active) return;

          const pdfPage = await doc.getPage(number);
          const content = await pdfPage.getTextContent();

          const text = content.items
            .map((item) => item.str || "")
            .join(" ")
            .toLocaleLowerCase();

          if (text.includes(keyword)) {
            results.push(number);
          }
        }

        if (!active) return;

        setSearchPages(results);

        if (results.length > 0) {
          goToPage(results[0]);
        }
      } catch {
        if (active) {
          setSearchError("Pencarian teks gagal.");
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, doc, goToPage]);

  const moveSearchResult = (direction) => {
    if (!searchPages.length) return;

    const next =
      (searchIndex + direction + searchPages.length) % searchPages.length;

    setSearchIndex(next);
    goToPage(searchPages[next]);
  };

  const openPdf = (download = false) => {
    if (!loaded || loaded.source !== pdfSource) return;

    const blob = new Blob([loaded.data], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    if (download) {
      link.download = "dokumen.pdf";
    } else {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 300000);
  };

  return (
    <section
      className={`pa-pdf-viewer ${frameless ? "pa-pdf-frameless" : ""}`}
      aria-label="Penampil PDF"
    >
      {!frameless && (
        <div className="pa-pdf-toolbar">
          <button
            type="button"
            disabled={!doc || page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Sebelumnya
          </button>

          <label>
            Halaman{" "}
            <input
              aria-label="Nomor halaman"
              type="number"
              min="1"
              max={doc?.numPages || 1}
              value={page}
              disabled={!doc}
              onChange={(e) => goToPage(e.target.value)}
            />
          </label>

          <span>/ {doc?.numPages || "—"}</span>

          <button
            type="button"
            disabled={!doc || page >= doc.numPages}
            onClick={() => goToPage(page + 1)}
          >
            Berikutnya
          </button>

          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))}
          >
            −
          </button>

          <button type="button" onClick={() => setZoom(1)}>
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
          >
            +
          </button>

          <input
            type="search"
            aria-label="Cari teks PDF"
            placeholder="Cari teks PDF…"
            value={searchQuery}
            disabled={!doc}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery.trim() && (
            <>
              <span role="status">
                {isSearching
                  ? "Mencari…"
                  : searchError ||
                    (searchPages.length
                      ? `${searchIndex + 1}/${searchPages.length} halaman`
                      : "Tidak ditemukan")}
              </span>

              <button
                type="button"
                disabled={isSearching || !searchPages.length}
                onClick={() => moveSearchResult(-1)}
                aria-label="Hasil pencarian sebelumnya"
              >
                ↑
              </button>

              <button
                type="button"
                disabled={isSearching || !searchPages.length}
                onClick={() => moveSearchResult(1)}
                aria-label="Hasil pencarian berikutnya"
              >
                ↓
              </button>
            </>
          )}

          <button type="button" disabled={!file} onClick={() => openPdf(true)}>
            <Download size={18} />
          </button>

          <button
            type="button"
            disabled={!file}
            onClick={() => openPdf()}
            title="Buka PDF di tab baru, lalu gunakan tombol cetak browser"
          >
            <Printer size={18} />
          </button>
        </div>
      )}

      <div ref={setRoot} className="pa-pdf-scroll" onScroll={checkBottom}>
        {error ? (
          <p role="alert">{error}</p>
        ) : !pdfSource ? (
          <p>Tidak ada dokumen PDF.</p>
        ) : !file ? (
          <p>Menyiapkan Dokumen…</p>
        ) : (
          <Document
            suspense={false}
            file={file}
            options={PDF_OPTIONS}
            onLoadSuccess={setDoc}
            onLoadError={() => setError("Dokumen PDF gagal dibaca.")}
            externalLinkTarget="_blank"
            externalLinkRel="noopener noreferrer"
            onItemClick={({ pageNumber }) => goToPage(pageNumber)}
            loading={<p>Membaca PDF…</p>}
          >
            {doc &&
              Array.from({ length: doc.numPages }, (_, index) => (
                <PdfPage
                  key={index + 1}
                  number={index + 1}
                  root={root}
                  width={Math.floor(Math.min(width, 1100) * zoom)}
                  onVisible={onVisible}
                  onRendered={onRendered}
                />
              ))}
          </Document>
        )}
      </div>
    </section>
  );
}
