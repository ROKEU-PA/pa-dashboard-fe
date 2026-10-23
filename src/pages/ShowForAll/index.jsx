import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import "moment/locale/id";
import CustomPDFViewer from "@/components/PDFViewer";
import Select from "@/components/Select"; // Jangan lupa import Select dari komponen lu
import { apiRequest } from "@/services/APIHelper"; 
import { AppContext } from "@/contexts/AppContext";

function ShowForAll() {
  const location = useLocation();
  const { userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  
  const [selectedSp2d, setSelectedSp2d] = useState("sp2d-setjen");

  const [contentData, setContentData] = useState({
    type: "",
    files: [],
  });

  // Deteksi role & halaman
  const userRole = userData?.role?.toLowerCase() || "";
  const isAdminOrPic = ["admin", "pic", "super_admin", "superadmin"].includes(userRole);
  
  const pathSegments = location.pathname.split('/');
  const pageId = pathSegments[pathSegments.length - 1]; 
  const isSp2dPage = pageId === "sp2d";

  const fetchContent = async () => {
    setLoading(true);
    try {
      let endpointUrl = `/dashboard/${pageId}`;

      if (isSp2dPage) {
        if (isAdminOrPic) {
          endpointUrl = `/dashboard/${selectedSp2d}`;
        } else {
          const biroName = userData?.name?.toLowerCase() || "";
          if (biroName.includes("ppsdm")) {
            endpointUrl = `/dashboard/sp2d-ppsdm`;
          } else if (biroName.includes("poltek") || biroName.includes("politeknik")) {
            endpointUrl = `/dashboard/sp2d-poltek`;
          } else {
            endpointUrl = `/dashboard/sp2d-setjen`; 
          }
        }
      }

      const response = await apiRequest({ url: endpointUrl });

      if (response?.success && response?.data) {
        const dataFiles = Array.isArray(response.data) ? response.data : [response.data];
        const fileType = response?.data.toLowerCase().includes('.pdf') ? 'pdf' : 'image';

        setContentData({
          type: fileType,
          files: dataFiles.map(file => typeof file === 'string' ? file : file.url) 
        });
      } else {
        setContentData({ type: "", files: [] });
      }

    } catch (error) {
      console.error("Failed fetch:", error);
      setContentData({ type: "", files: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchContent();
  }, [location.pathname, userData, selectedSp2d]); 

  return (
    <div className="w-full min-h-[60vh]">
      
      {isSp2dPage && isAdminOrPic && (
        <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-700 text-sm w-full sm:w-auto">
            Pilih Dokumen Satuan Kerja:
          </span>
          <div className="w-full sm:w-72">
            <Select
              label=""
              name="sp2d_satker"
              value={selectedSp2d}
              onChange={(e) => setSelectedSp2d(e.target.value)}
              options={[
                { label: "Satker Sekretariat Jenderal", value: "sp2d-setjen" },
                { label: "Satker PPSDM", value: "sp2d-ppsdm" },
                { label: "Satker Politeknik Ketenagakerjaan", value: "sp2d-poltek" },
              ]}
              isSearchable={false}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-[#F1FAFF] rounded-xl border border-blue-100 shadow-sm">
          <span className="text-blue-500 font-semibold animate-pulse">Memuat Dokumen...</span>
        </div>
      ) : (
        <div className="bg-[#F1FAFF] p-4 rounded-xl shadow-sm border border-slate-100 min-h-full">
          
          {/* RENDER PDF */}
          {contentData.type === "pdf" && contentData.files.length > 0 && (
            <div className="w-full flex flex-col gap-6">
              {contentData.files.map((pdfUrl, index) => (
                  <div key={index} className="w-full h-[85vh] overflow-hidden rounded-xl bg-white shadow-sm">
                    <CustomPDFViewer pdfSource={pdfUrl} frameless={true} />
                  </div>
                )
              )}
            </div>
          )}

          {/* RENDER IMAGE */}
          {contentData.type === "image" && contentData.files.length > 0 && (
            <div className="w-full flex flex-col gap-6">
              {contentData.files.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`content-${index}`}
                  loading="lazy" 
                  className="w-full h-auto object-contain rounded-xl shadow-md border border-slate-200 bg-white"
                />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
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