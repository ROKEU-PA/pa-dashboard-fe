import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";
import { Calendar } from "lucide-react";

function YearSelectionPage() {
  const navigate = useNavigate();
  const { listMenu, userData } = useContext(AppContext);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

  const handleYearClick = (tahun) => {
  const role = userData?.role;

  // Tentukan siapa saja yang boleh melihat menu daftar seluruh satker
  const adminRoles = ["admin", "super_admin", "superadmin", "pic"];

  if (adminRoles.includes(role)) {
    // Mengarah ke <Route path="/e-arsip/:tahun" element={<MenuPage />} />
    navigate(`/e-arsip/${tahun}`);
  } else {
    // Jalur untuk USER biasa (Eksplisit mencari path satuan kerja mereka)
    const satkerMenu = listMenu.find(
      (menu) => menu.path && menu.path.startsWith("/satuan-kerja/")
    );

    const userMenuPath = satkerMenu?.path;

    if (userMenuPath) {
      const pathParts = userMenuPath.split("/").filter(Boolean);
      // Mengambil segmen terakhir (misal: 'biro-keuangan' atau 'binalavotas')
      const satkerIdentifier = pathParts[pathParts.length - 1]; 
      
      // Mengarah ke <Route path="/arsip/:tahun/:satker" element={<ArchivePage />} />
      navigate(`/arsip/${tahun}/${satkerIdentifier}`);
    } else {
      // Fallback aman jika menu user belum termuat dari API
      console.warn("Data menu satker belum siap atau tidak ditemukan.");
      navigate("/satuan-kerja/pengajuan");
    }
  }
};

  return (
    <div className="p-8 mx-auto min-h-screen bg-slate-50/50">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className="group flex flex-col items-stretch bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#308BFD] transition-all duration-300 hover:-translate-y-1 overflow-hidden text-center"
          >
            <div className="flex justify-center items-center py-6 bg-white transition-colors duration-300 group-hover:bg-slate-50">
              <Calendar className="w-8 h-8 text-[#308BFD] group-hover:text-[#59C6FF] transition-colors duration-300" />
            </div>

            <div className="relative py-3 bg-gradient-to-r from-[#308BFD] to-[#59C6FF] overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="relative font-bold text-xl text-white tracking-wide z-10">
                {year}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default YearSelectionPage;