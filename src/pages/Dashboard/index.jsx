// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Title from "@/components/Title";
// import Paper from "@/components/Paper";
// import Breadcrumbs from "@/components/Breadcrumbs";
// import { apiRequest } from "@/services/APIHelper";

// // --- Constants ---
// const IMAGE_MAP = {
//   ptuk: "PTUKP",
//   "pelaksanaan-anggaran": "PAP",
//   "barang-milik-negara": "BMNP",
//   "akuntansi-pelaporan": "ALP",
//   "tata-usaha": "TUP",
//   "struktur-organisasi": "SOP",
//   helpdesk: "HDP",
// };

// const TITLE_MAP = {
//   ptuk: "PTUKP",
//   "pelaksanaan-anggaran": "Pelaksanaan Anggaran",
//   "barang-milik-negara": "Barang Milik Negara",
//   "akuntansi-pelaporan": "Akuntansi Pelaporan",
//   "tata-usaha": "Tata Usaha",
//   "struktur-organisasi": "Struktur Organisasi",
//   helpdesk: "Helpdesk",
// };

// // --- Helpers ---
// const getTitle = (subPage) => {
//   if (!subPage) return "Dashboard Utama";
//   if (subPage === "helpdesk" || subPage === "struktur-organisasi") {
//     return TITLE_MAP[subPage] || "Dashboard Utama";
//   }
//   return `Dashboard ${TITLE_MAP[subPage] || "Utama"}`;
// };

// // --- Component ---
// export default function DashboardPage() {
//   const { subPage } = useParams();
//   const [imageUrl, setImageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchImage = async () => {
//       try {
//         const justLoggedIn = sessionStorage.getItem("justLoggedIn");
//         if (justLoggedIn) {
//           sessionStorage.removeItem("justLoggedIn");
//           window.location.reload();
//         }

//         const id = IMAGE_MAP[subPage] || "UTM";
//         const response = await apiRequest({ url: `/api/dashboard/${id}` });
//         setImageUrl(response.data);
//       } catch (error) {
//         console.error("Failed to fetch dashboard image:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImage();
//   }, [subPage]);

//   const title = getTitle(subPage);

//   return (
//     <div>
//       <Breadcrumbs items={[{ name: "Dashboard Utama", path: "/dashboard" }]} />
//       <Title>{title}</Title>

//       <Paper elevation={3} className="bg-[#F5F6F7] p-4 sm:p-6 md:p-8">
//         <div className="flex justify-center items-center min-h-[400px]">
//           {loading ? (
//             <p className="text-gray-600">Memuat gambar dashboard...</p>
//           ) : imageUrl ? (
//             <img
//               src={imageUrl}
//               alt={`Dashboard ${title}`}
//               className="w-full max-w-5xl h-auto object-contain mx-auto"
//             />
//           ) : (
//             <p className="text-gray-400">Gambar tidak tersedia</p>
//           )}
//         </div>
//       </Paper>
//     </div>
//   );
// }

import React, { useContext } from "react";
import User from "@/components/User";
import { Phone, User as UserIcon, Calendar, Menu } from "lucide-react";
import { AppContext } from "@/contexts/AppContext";
import Title from "@/components/Title";

export default function Helpdesk() {
  const { setMobileMenuOpen } = useContext(AppContext);

  return (
    <div className="flex flex-col h-[875px]  bg-white overflow-hidden">
      {/* MAIN CONTENT  */}
      <div className="relative flex-1 bg-gradient-to-bl from-[#59c6ff]  to-[#ffffff] flex flex-col items-center justify-start md:justify-center overflow-y-auto overflow-x-hidden">
        {/* LOGO HELP DESK DI KIRI BAWAH*/}
        <div className="absolute bottom-0 left-0 z-20 hidden md:block">
          <img
            src="/help desk.png"
            alt="Logo Help Desk"
            className=" h-auto object-contain drop-shadow-md"
          />
        </div>
        <div className="relative z-10  flex flex-col items-center text-center space-y-6 md:space-y-8 mt-4 md:mt-0 mb-8">
          <div className="flex flex-col items-center space-y-3">
            <img
              src="/logo-kemnaker-ori.webp"
              alt="Logo Kemnaker"
              className="h-12 md:h-16 object-contain mb-2"
            />

            <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 tracking-tight px-2 leading-tight">
              Biro Keuangan dan Barang Milik Negara
            </h1>
            <p className="text-gray-600 text-sm md:text-xl font-medium max-w-xs md:max-w-2xl leading-relaxed">
              Layanan Konsultasi terkait pengelolaan dan barang milik negara di
              lingkungan Kementerian Ketenagakerjaan
            </p>
          </div>

          {/* QR CODE SECTION */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-widest">
              Scan Disini
            </h3>

            <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-white">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/6281234567890"
                alt="QR Code WhatsApp"
                className="w-28 h-28 md:w-40 md:h-40 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* KETENTUAN KONSULTASI */}
          <div className="w-full max-w-2xl mt-4 px-4 md:px-0">
            <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-200 inline-block pb-1">
              Ketentuan Konsultasi
            </h3>

            <div className="grid grid-cols-1 gap-5">
              {/* Item 1 */}
              <div className="flex items-center gap-4 text-left bg-white/30 p-3 rounded-xl backdrop-blur-sm border border-white/50">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md shrink-0">
                  <Phone size={20} className="text-blue-500" />
                </div>
                <p className="text-gray-800 font-semibold text-sm md:text-base leading-snug">
                  Pertanyaan dan Konsultasi dilakukan melalui nomor Whatsapp
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-4 text-left bg-white/30 p-3 rounded-xl backdrop-blur-sm border border-white/50">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md shrink-0">
                  <UserIcon size={20} className="text-blue-500" />
                </div>
                <p className="text-gray-800 font-semibold text-sm md:text-base leading-snug">
                  Hanya Diperuntukan bagi pegawai ASN Kementerian
                  Ketenagakerjaan
                </p>
              </div>

              {/* Item 3 (Jadwal) */}
              <div className="flex items-start gap-4 text-left bg-white/30 p-3 rounded-xl backdrop-blur-sm border border-white/50">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md shrink-0">
                  <Calendar size={20} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-800 font-bold text-sm md:text-base">
                    Operasional Senin s.d Jumat:
                  </p>
                  <p className="text-gray-700 text-xs md:text-sm font-medium">
                    08.00 - 12.00 WIB & 13.00 - 16.00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COPYRIGHT --- */}
        <div className="w-full text-center md:text-right md:absolute md:bottom-6 md:right-8 z-20 mt-8 md:mt-0 text-xs text-gray-500 font-bold">
          © Rokeu BMN 2025 | Version 2.0
        </div>
      </div>
    </div>
  );
}
