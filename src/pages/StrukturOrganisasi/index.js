import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/contexts/AppContext";
import User from "@/components/User";
import Card from "@/components/Card";
import Title from "@/components/Title";
import { Menu, Download, Share2, Loader2, ArrowRightLeft } from "lucide-react";
import { apiRequest } from "@/services/APIHelper";

export default function StrukturOrganisasi() {
  const { setMobileMenuOpen } = useContext(AppContext);

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStruktur = async () => {
      try {
        setLoading(true);
        const response = await apiRequest({ url: `/dashboard/SOP` });

        if (response && response.data) {
          setImageUrl(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Gagal mengambil struktur organisasi:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStruktur();
  }, []);

  return (
    <div>
      <div className="bg-gray-50 min-h-screen font-sans p-4 md:p-8">
        <Card className="p-0 md:p-4 rounded-3xl shadow-sm border border-gray-100 bg-white min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="flex justify-end items-center px-4 pt-4 md:px-2 md:pt-2 mb-2 z-10">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <Download size={16} />
              <span className="hidden sm:inline">Unduh</span>
            </button>
          </div>
          <div className="flex-1 w-full bg-white rounded-b-2xl md:rounded-2xl p-2 md:p-4 relative min-h-[400px] flex items-start justify-center">
            {/* KONDISI LOADING */}
            {loading && (
              <div className="flex flex-col items-center gap-3 text-blue-500 my-20">
                <Loader2 size={40} className="animate-spin" />
                <span className="text-sm font-medium text-gray-500">
                  Memuat Struktur...
                </span>
              </div>
            )}

            {/* KONDISI  ERROR */}
            {!loading && (error || !imageUrl) && (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl w-full h-full bg-gray-50/50 m-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full mb-4"></div>
                <p className="text-gray-600 font-medium text-sm md:text-base">
                  Gambar Tidak Ditemukan
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-xs md:text-sm font-semibold"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* KONDISI  SUKSES */}
            {!loading && imageUrl && (
              <img
                src={imageUrl}
                alt="Bagan Struktur Organisasi"
                className="w-full h-auto object-contain mx-auto"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
