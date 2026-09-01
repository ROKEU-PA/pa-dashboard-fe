import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const CustomPDFViewer = ({ pdfSource, frameless = false, onReachBottom }) => {
  const [url, setUrl] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!pdfSource) return;

    let objectUrl = null;
    let isMounted = true;

    const loadPdfAsBlob = async () => {
      try {
        if (typeof pdfSource === "string") {
          setIsFetching(true);
          // Tarik file 1x secara utuh
          const response = await fetch(pdfSource);
          if (!response.ok) throw new Error("Gagal mengambil PDF");
          
          const blob = await response.blob();
          
          if (isMounted) {
            objectUrl = URL.createObjectURL(blob);
            setUrl(objectUrl);
          }
        } else if (pdfSource instanceof Blob) {
          objectUrl = URL.createObjectURL(pdfSource);
          setUrl(objectUrl);
        }
      } catch (error) {
        console.error("Error loading PDF Blob:", error);
        if (isMounted) setUrl(pdfSource);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    loadPdfAsBlob();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pdfSource]);

  if (isFetching || !url) {
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
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer 
          fileUrl={url} 
          plugins={frameless ? [] : [defaultLayoutPluginInstance]}

          onPageChange={(e) => {
            if (e.currentPage === e.doc.numPages - 1) {
              if (onReachBottom) onReachBottom(); // Trigger fungsi kalau mentok bawah
            }
          }}
        />
      </Worker>
    </div>
  );
};

export default CustomPDFViewer;