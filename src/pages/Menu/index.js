import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AppContext } from "@/contexts/AppContext";
import { fetchMenu } from "./menuHooks";
import { useAuth } from "@/contexts/AuthContexts";

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
  }, [setListMenu]);

  return (
    <div className="px-4 py-2.5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {listMenu &&
          listMenu.map((data, index) => {
            // Cek apakah user punya akses ke satker ini
            const hasAccess = isAdmin || userData?.access_code?.includes(Number(data.code));

            return (
              <Link
                key={index}
                to={(() => {
                  const pathParts = data.path.split("/").filter(Boolean);
                  const base = "/" + pathParts[0];
                  const end = pathParts.slice(1).join("/");

                 if (tahun) {
                    return `/arsip/${tahun}/${end}`;
                  }

                  if (subPage) {
                    return `${base}/${subPage}/${end}`;
                  }

                  return data.path;
                })()}
                onClick={() => hasAccess && handleChangeMenu(data)}
                className={`no-underline block group rounded-md overflow-hidden transition-all duration-200 ${
                  hasAccess 
                    ? "cursor-pointer hover:scale-105 hover:shadow-xl" 
                    : "pointer-events-none select-none opacity-50 grayscale-[40%]"
                }`}
              >
                {/* Bagian Angka Kodifikasi Satker */}
                <div className="h-[100px] bg-[#4CD4B0] text-[#2bb490] font-black text-[100px] flex items-center select-none leading-none overflow-hidden">
                  {data.code}
                </div>

                {/* Bagian Nama Satker */}
                <div className="bg-white p-5 text-gray-800 font-normal transition-all duration-200 group-hover:font-semibold">
                  {data.name}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default MenuPage;