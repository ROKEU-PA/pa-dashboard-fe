import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";
import { fetchMenu } from "./menuHooks";
import { useAuth } from "@/contexts/AuthContexts";
// Import Icon dari Lucide (Pastikan sudah install lucide-react)
import { 
  Scale, 
  FileText, 
  Users, 
  ClipboardList, 
  Building2, 
  Handshake, 
  Megaphone, 
  GraduationCap,
  ArrowRight,
  Lock
} from "lucide-react";

function MenuPage() {
  const { auth } = useAuth();
  const { subPage, tahun } = useParams();

  const { handleChangeMenu, listMenu, setListMenu, userData, isAdmin } =
    useContext(AppContext);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menuData = await fetchMenu(auth?.accessToken);
        setListMenu(menuData.data);
      } catch (error) {
        console.error("Error loading menu:", error);
      }
    };

    loadMenu();
  }, [setListMenu, auth?.accessToken]);

  // Fungsi helper untuk mapping icon berdasarkan kode biro
  const getBiroIcon = (code) => {
    const iconProps = { size: 24, strokeWidth: 1.5 };
    switch (code?.toString()) {
      case "2157": return <Scale {...iconProps} />;
      case "2158": return <FileText {...iconProps} />;
      case "2159": return <Users {...iconProps} />;
      case "2160": return <ClipboardList {...iconProps} />;
      case "2161": return <Building2 {...iconProps} />;
      case "2162": return <Handshake {...iconProps} />;
      case "2163": return <Megaphone {...iconProps} />;
      case "450990": return <GraduationCap {...iconProps} />;
      default: return <Building2 {...iconProps} />;
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 min-h-screen bg-[#f4f7fa] dark:bg-transparent transition-colors duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {listMenu &&
          listMenu.map((data, index) => {
            const pathParts = data.path.split("/").filter(Boolean);
            const satkerIdentifier = pathParts[pathParts.length - 1];
            const currentPath = window.location.pathname;
            let targetPath = data.path;

            if (currentPath.startsWith("/e-arsip")) {
              const yearParam = tahun || subPage;
              targetPath = `/arsip/${yearParam}/${satkerIdentifier}`;
            } else if (
              currentPath.startsWith("/e-ssp") ||
              currentPath.startsWith("/satuan-kerja")
            ) {
              const base = "/" + pathParts[0];
              targetPath = `${base}/${satkerIdentifier}`;
            }
            
            const isPic = userData?.role?.toLowerCase() === "pic";
            const hasAccess = isAdmin || isPic || userData?.access_code?.includes(Number(data.code));

            return (
              <Link
                key={index}
                to={targetPath}
                className={`group flex h-[160px] ${!hasAccess ? "pointer-events-none" : ""}`}
                onClick={() => {
                  if (hasAccess) {
                    handleChangeMenu({
                      ...data,
                      path: targetPath,
                    });
                  }
                }}
              >
                <div
                  className={`
                    relative flex flex-col w-full h-full overflow-hidden rounded-[20px] border transition-all duration-300 p-5
                    ${
                      hasAccess
                        ? "bg-white dark:bg-[#111C30]/80 border-slate-100 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(21,101,192,0.12)] hover:border-blue-400/50 dark:hover:border-blue-500/50 cursor-pointer backdrop-blur-md"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 cursor-not-allowed opacity-70 grayscale-[30%]"
                    }
                  `}
                >
                  {/* WATERMARK ANGKA BACKGROUND (Sesuai Gambar) */}
                  <span className={`absolute top-2 right-4 text-[68px] font-black select-none pointer-events-none transition-all duration-300 ${hasAccess ? "text-slate-50 dark:text-white/5 group-hover:scale-110 group-hover:text-blue-50/80 dark:group-hover:text-blue-500/10" : "text-slate-100 dark:text-white/5"}`}>
                    {data.code}
                  </span>

                  {/* KONTEN CARD */}
                  <div className="relative z-10 flex gap-4">
                    {/* Icon Container */}
                    <div className={`shrink-0 w-[46px] h-[46px] rounded-full flex items-center justify-center transition-colors duration-300 ${hasAccess ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                      {getBiroIcon(data.code)}
                    </div>
                    
                    {/* Text Title & Subtitle */}
                    <div className="flex flex-col pt-1">
                      <h2 className={`text-2xl font-extrabold leading-none mb-1.5 ${hasAccess ? "text-[#0A2A66] dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                        {data.code}
                      </h2>
                      <p className={`text-[12px] font-semibold leading-snug pr-2 ${hasAccess ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                        {data.name}
                      </p>
                    </div>
                  </div>

                  {/* Arrow / Lock Button Bottom Right */}
                  <div className="mt-auto pt-2 flex justify-end relative z-10">
                    {hasAccess ? (
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                        <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                        <Lock size={14} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default MenuPage;