import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const CustomPDFViewer = ({ pdfSource, frameless = false, onReachBottom }) => {
  // 1. Ubah state dari url menjadi pdfData
  const [pdfData, setPdfData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!pdfSource) return;

    let isMounted = true;

    const loadPdfAsArrayBuffer = async () => {
      try {
        if (typeof pdfSource === "string") {
          setIsFetching(true);
          const response = await fetch(pdfSource);
          if (!response.ok) throw new Error("Gagal mengambil PDF");
          
          // 🔥 KUNCI UTAMA: Jadikan ArrayBuffer, bukan Blob!
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          if (isMounted) setPdfData(uint8Array);
          
        } else if (pdfSource instanceof Blob) {
          // Jika pdfSource sudah berupa file blob dari upload lokal
          const arrayBuffer = await pdfSource.arrayBuffer();
          if (isMounted) setPdfData(new Uint8Array(arrayBuffer));
        }
      } catch (error) {
        console.error("Error loading PDF Data:", error);
        // Fallback jika fetch gagal (misal kena CORS ketat)
        if (isMounted) setPdfData(pdfSource);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    loadPdfAsArrayBuffer();

    // Cleanup memori React native
    return () => {
      isMounted = false;
    };
  }, [pdfSource]);

  if (isFetching || !pdfData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3">
        <span className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></span>
        <span className="text-sm font-bold text-slate-500 animate-pulse">Menyiapkan Dokumen...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: frameless ? "100%" : "100vh", 
        overflow: "auto",
      }}
    >
      <Worker workerUrl="/pdf.worker.min.js">
        <Viewer 
          fileUrl={pdfData} 
          plugins={frameless ? [] : [defaultLayoutPluginInstance]} 
          onPageChange={(e) => {
            if (e.currentPage === e.doc.numPages - 1 && onReachBottom) {
              onReachBottom();
            }
          }}
        />
      </Worker>
    </div>
  );
};

export default CustomPDFViewer;