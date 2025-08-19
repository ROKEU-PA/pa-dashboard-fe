import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import { apiRequest } from "@/services/APIHelper";

// --- Constants ---
const IMAGE_MAP = {
  ptuk: "PTUKP",
  "pelaksanaan-anggaran": "PAP",
  "barang-milik-negara": "BMNP",
  "akuntansi-pelaporan": "ALP",
  "tata-usaha": "TUP",
  "struktur-organisasi": "SOP",
  helpdesk: "HDP",
};

const TITLE_MAP = {
  ptuk: "PTUKP",
  "pelaksanaan-anggaran": "Pelaksanaan Anggaran",
  "barang-milik-negara": "Barang Milik Negara",
  "akuntansi-pelaporan": "Akuntansi Pelaporan",
  "tata-usaha": "Tata Usaha",
  "struktur-organisasi": "Struktur Organisasi",
  helpdesk: "Helpdesk",
};

// --- Helpers ---
const getTitle = (subPage) => {
  if (!subPage) return "Dashboard Utama";
  if (subPage === "helpdesk" || subPage === "struktur-organisasi") {
    return TITLE_MAP[subPage] || "Dashboard Utama";
  }
  return `Dashboard ${TITLE_MAP[subPage] || "Utama"}`;
};

// --- Component ---
export default function DashboardPage() {
  const { subPage } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const justLoggedIn = sessionStorage.getItem("justLoggedIn");
        if (justLoggedIn) {
          sessionStorage.removeItem("justLoggedIn");
          window.location.reload();
        }

        const id = IMAGE_MAP[subPage] || "UTM";
        const response = await apiRequest({ url: `/api/dashboard/${id}` });
        setImageUrl(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [subPage]);

  const title = getTitle(subPage);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Dashboard Utama", path: "/dashboard" }]} />
      <Title>{title}</Title>

      <Paper elevation={3} className="bg-[#F5F6F7]">
        <div className="flex justify-center items-center min-h-[400px]">
          {loading ? (
            <p className="text-gray-600">Memuat gambar dashboard...</p>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`Dashboard ${title}`}
              className="w-full object-contain"
            />
          ) : (
            <p className="text-gray-400">Gambar tidak tersedia</p>
          )}
        </div>
      </Paper>
    </div>
  );
}
