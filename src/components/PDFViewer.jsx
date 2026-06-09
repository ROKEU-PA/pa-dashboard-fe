import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const CustomPDFViewer = ({ pdfSource, frameless = false }) => {
  const [url, setUrl] = useState(null);
  
  // Inisialisasi plugin bawaan (yang ada toolbar-nya)
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!pdfSource) return;

    // Jika string (URL)
    if (typeof pdfSource === "string") {
      setUrl(pdfSource);
    }
    // Jika blob
    else if (pdfSource instanceof Blob) {
      const objectUrl = URL.createObjectURL(pdfSource);
      setUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [pdfSource]);

  if (!url) return <div>Loading…</div>;

  return (
    <div
      style={{
        width: "100%",
        // Kalau frameless, biarin height ngikutin parent biar ga kepotong scroll-nya
        height: frameless ? "100%" : "100vh", 
        overflow: "auto", // Ganti hidden jadi auto biar halamannya tetep bisa di-scroll ke bawah
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer 
          fileUrl={url} 
          // KUNCINYA DI SINI BOS:
          // Kalau frameless true -> plugin kosongin (toolbar hilang, sisa kertas PDF doang)
          // Kalau frameless false -> pake layout plugin (muncul toolbar lengkap)
          plugins={frameless ? [] : [defaultLayoutPluginInstance]} 
        />
      </Worker>
    </div>
  );
};

export default CustomPDFViewer;