import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams } from "react-router-dom";
import { apiRequest } from "@/services/APIHelper";

function DashboardPage() {
  const { subPage } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  // Mapping nama path ke ID backend
  const imageMap = {
    ptuk: "PTUKP",
    "pelaksanaan-anggaran": "PAP",
    "barang-milik-negara": "BMNP",
    "akuntansi-laporan": "ALP",
    "tata-usaha": "TUP",
    helpdesk: "HDP",
  };

  const titleMap = {
    ptuk: "PTUKP",
    "pelaksanaan-anggaran": "Pelaksanaan Anggaran",
    "barang-milik-negara": "Barang Milik Negara",
    "akuntansi-laporan": "Akuntansi Laporan",
    "tata-usaha": "Tata Usaha",
    helpdesk: "Helpdesk",
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const id = imageMap[subPage] || "UTM";
        const response = await apiRequest({ url: `/api/dashboard/${id}` });
        const isTitle =
          subPage === "helpdesk"
            ? titleMap[subPage]
            : `Dashboard ${titleMap[subPage] || "Utama"}`;
        setTitle(isTitle);
        setImageUrl(response.data);
      } catch (error) {
        console.error("Gagal fetch gambar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [subPage]);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Dashboard Utama", path: "/dashboard" }]} />
      <Title>{title}</Title>
      <Paper elevation={3} style={{ backgroundColor: "#F5F6F7" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          {loading ? (
            <p style={{ color: "#555" }}>Memuat gambar dashboard...</p>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Dashboard"
              style={{ width: "100%", objectFit: "contain" }}
            />
          ) : (
            <p style={{ color: "#999" }}>Gambar tidak tersedia</p>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default DashboardPage;
