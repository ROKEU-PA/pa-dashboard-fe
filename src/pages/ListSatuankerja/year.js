import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { AppContext } from "@/contexts/AppContext";
import { Calendar } from "lucide-react";

function YearSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { listMenu, userData } = useContext(AppContext);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

 const handleYearClick = (tahun) => {
  const role = userData?.role?.toLowerCase()?.trim();
  const adminLikeRoles = ["admin", "super_admin", "superadmin", "pic"];

  if (adminLikeRoles.includes(role)) {
    navigate(`/e-arsip/${tahun}`);
  } else {

    const userAccessCode = userData?.access_code?.[0];
    const userSatkerMenu = listMenu.find(
      (menu) => Number(menu.code) === Number(userAccessCode)
    );

    if (userSatkerMenu && userSatkerMenu.path) {
      const pathParts = userSatkerMenu.path.split("/").filter(Boolean);
      const satkerIdentifier = pathParts[pathParts.length - 1]; 
      navigate(`/arsip/${tahun}/${satkerIdentifier}`);
    } else {
      console.warn("Menu satker yang sesuai dengan access code tidak ditemukan.");
      navigate(`/e-arsip/${tahun}`);
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