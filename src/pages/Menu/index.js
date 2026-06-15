import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  }, [setListMenu, auth?.accessToken]);

  return (
    <div className="px-4 py-3">
      <div className="grid grid-cols-1 md:auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

            const hasAccess =
              isAdmin ||
              isPic ||
              userData?.access_code?.includes(Number(data.code));

            return (
              <Link
                key={index}
                to={targetPath}
                className={`flex h-full ${!hasAccess ? "pointer-events-none" : ""}`}
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
                    flex flex-col h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white
                    shadow-sm transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                    ${
                      !hasAccess
                        ? "cursor-not-allowed grayscale opacity-50"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <div
                    className="
                      flex h-28 items-center overflow-hidden
                      bg-[#4CD4B0]
                    "
                  >
                    <span
                      className=" select-none  ml-1 text-[80px] font-black leading-none text-[#2bb490]
                      "
                    >
                      {data.code}
                    </span>
                  </div>
                  <div className="p-5 ">
                    <h2 className="text-base font-semibold text-slate-800">
                      {data.name}
                    </h2>
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