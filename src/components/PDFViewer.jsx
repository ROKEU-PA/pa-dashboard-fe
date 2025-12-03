// Usage examples:
// 1. Public file: <PDFViewer pdfSource="/sample.pdf" />
// 2. External URL: <PDFViewer pdfSource="https://example.com/doc.pdf" />
// 3. Blob: <PDFViewer pdfSource={pdfBlob} />

import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { fetchPDFAsBlob } from "@/pages/ListSatuankerja/satkerHooks";
import { toast } from "react-toastify";

// const CustomPDFViewer = ({ pdfSource }) => {
//   const [processedUrl, setProcessedUrl] = useState("");
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   useEffect(() => {
//     const processUrl = (url) => {
//       // Handle Google Drive URLs
//       if (url.includes("drive.google.com")) {
//         const fileId = url.match(/filed([^]+)/)?.[1];
//         if (fileId) {
//           return `https://drive.google.com/uc?export=download&id=${fileId}`;
//         }
//       }
//       return url;
//     };

//     if (typeof pdfSource === "string") {
//       setProcessedUrl(processUrl(pdfSource));
//     } else if (pdfSource instanceof Blob) {
//       const url = URL.createObjectURL(pdfSource);
//       setProcessedUrl(url);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [pdfSource]);

//   useEffect(() => {
//     const loadPDF = async () => {
//       try {
//         const blob = await fetchPDFAsBlob(pdfSource);
//         const url = URL.createObjectURL(blob);
//       } catch (err) {
//         toast.error("Gagal memuat dokumen PDF");
//       }
//     };

//     if (typeof pdfSource === "string" && pdfSource.includes("rokeubmn-pa.id")) {
//       loadPDF();
//     }
//   }, [pdfSource]);

//   if (!processedUrl) return <div>Loading PDF...</div>;

//   return (
//     <div style={{ width: "90%",
//         maxWidth: "1200px",
//         height: "80vh",
//         margin: "0 auto", }}>
//       <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//         <Viewer
//           fileUrl={processedUrl}
//           plugins={[defaultLayoutPluginInstance]}
//         />
//       </Worker>
//     </div>
//   );
// };

// export default CustomPDFViewer;

const CustomPDFViewer = ({ pdfSource }) => {
  const [url, setUrl] = useState(null);
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
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default CustomPDFViewer;