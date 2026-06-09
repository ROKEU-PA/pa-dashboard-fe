import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "moment/locale/id";
import CustomPDFViewer from "@/components/PDFViewer"; // Asumsi lu punya komponen ini dari page Arsip kemaren
import { apiRequest } from "@/services/APIHelper"; // Pakai helper API lu

function ShowForAll() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  const [contentData, setContentData] = useState({
    type: "",
    files: [],
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const pathSegments = location.pathname.split('/');
      const pageId = pathSegments[pathSegments.length - 1]; 
      
      const response = await apiRequest({ 
        url: `/dashboard/${pageId}` 
      });

      if (response?.success && response?.data) {
        const fileUrl = response.data;
        const fileType = fileUrl.toLowerCase().includes('.pdf') ? 'pdf' : 'image';

        setContentData({
          type: fileType,
          files: [fileUrl] 
        });
      } else {
        setContentData({ type: "", files: [] });
      }

    } catch (error) {
      console.error("Gagal narik data konten:", error);
      setContentData({ type: "", files: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [location.pathname]);
  console.log(contentData)

  return (
    <div className="w-full min-h-[60vh]">
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-[#F1FAFF] rounded-xl border border-blue-100">
          <span className="text-blue-500 font-semibold animate-pulse">Memuat Dokumen...</span>
        </div>
      ) : (
        <div className="bg-[#F1FAFF] p-4 rounded-xl shadow-sm border border-slate-100 min-h-full">
          
          {/* RENDER PDF */}
          {contentData.type === "pdf" && contentData.files.length > 0 && (
            <div className="w-full flex flex-col gap-6">
              {contentData.files.map((pdfUrl, index) => {
                return (
                  <div key={index} className="w-full h-[85vh] overflow-hidden rounded-xl">
                    <CustomPDFViewer pdfSource={pdfUrl} frameless={true} />
                  </div>
                );
              })}
            </div>
          )}

          {contentData.type === "image" && contentData.files.length > 0 && (
            <div className="w-full flex flex-col gap-6">
              {contentData.files.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`content-${index}`}
                  loading="lazy" // Ganti eager jadi lazy biar enteng kalau gambarnya banyak
                  className="w-full h-auto object-contain rounded-xl shadow-md border border-slate-200"
                />
              ))}
            </div>
          )}

          {contentData.files.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-slate-400 font-medium">Belum ada dokumen untuk menu ini.</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default ShowForAll;