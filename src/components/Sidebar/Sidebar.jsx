import { useAuth } from "@/contexts/AuthContexts";
import { LogOut, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";
import { menuItems } from "./constants";

function Sidebar() {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const role = userData?.role;
  const location = useLocation();

  const getFilteredMenuItems = () => {
    if (role === "super_admin") return menuItems;

    if (role === "user" || role === "pic" || role === "bend") {
      const allowedMenus = [
        "E-SPP",
        "E-Arsip",
        "Monitoring",
        "IKPA",
        "SP2D",
        "Realisasi",
        "Kalender",
      ];
      return menuItems.filter((item) => allowedMenus.includes(item.name));
    }

    if (role === "admin") {
      return menuItems
        .filter(
          (item) =>
            item.name === "Pelaksanaan Anggaran" ||
            (item.name === "Management" && item.name !== "Inventaris Kantor")
        )
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) =>
            [
              "Pengajuan SPP",
              "Arsip SPM",
              "Monitoring",
              "User Manage",
              "Kalender",
            ].includes(child.name)
          ),
        }));
    }

    if (role === "guest") {
      const excludedMenus = [
        "Management",
        "Inventaris Kantor",
        "Pengambilan Persediaan",
        "E-SPP",
        "E-Arsip",
        "Monitoring",
        "IKPA",
        "Realisasi",
        "Kalender",
      ];
      return menuItems
        .filter((item) => !excludedMenus.includes(item.name))
        .map((item) => {
          if (item.name === "Pelaksanaan Anggaran") {
            return {
              ...item,
              children: item.children?.filter((child) =>
                ["Dashboard", "IKPA", "Realisasi", "Kalender"].includes(
                  child.name
                )
              ),
            };
          }
          return item;
        });
    }

    if (!role) {
      const pathname = location.pathname;
      if (pathname.includes("/inventaris-kantor")) {
        return menuItems.filter((item) => item.name === "Inventaris Kantor");
      }
      if (pathname.includes("/tata-usaha")) {
        return menuItems.filter(
          (item) => item.name === "Pengambilan Persediaan"
        );
      }
      return [];
    }
  };

  const toggleDropdown = (item) => {
    const isOpen = openDropdown === item.name;

    if (!item.children && item.path) {
      setOpenDropdown(null);
      navigate(item.path);
      return;
    }

    if (!isOpen && item.path) {
      navigate(item.path);
    }

    setOpenDropdown(isOpen ? null : item.name);
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const matchedMenu = getFilteredMenuItems().find((item) =>
      item.children?.some((child) => currentPath.startsWith(child.path))
    );

    if (matchedMenu) {
      setOpenDropdown(matchedMenu.name);
    } else {
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  return (
    <div className="w-[270px] h-screen flex flex-col fixed top-0 left-0 bg-gradient-to-b from-[#082b67] to-[#061d49] text-[#dcecff] z-20 overflow-hidden transition-all duration-250">
      
      {/* Scrollable Area */}
      <div className="p-4 flex-1 overflow-y-auto sidebar-scroll relative z-10">
        
        {/* Logo */}
        <img
          src="/rokeu_logo_white.webp"
          alt="logo"
          width="150"
          className="mt-5 mb-10 ml-7"
        />

        <nav className="flex flex-col w-full gap-1.5">
          {getFilteredMenuItems().map((item, index) => {
            if (item.children) {
              const isParentActive =
                openDropdown === item.name ||
                item.children.some((child) =>
                  location.pathname.startsWith(child.path)
                );

              return (
                <div key={index} className="flex flex-col w-full">
                  {/* Parent Dropdown */}
                  <div
                    onClick={() => navigate(item?.path)}
                    className={`relative flex justify-between items-center gap-13 px-3.5 py-2.5 h-[43px] rounded-[11px] text-md font-medium mx-auto w-full cursor-pointer transition-all duration-200 group ${
                      isParentActive
                        ? "bg-gradient-to-r from-[#1565C0]/80 to-[#42A5F5]/25 text-white"
                        : "text-[#cfe2f7] bg-transparent hover:bg-[#42A5F5]/15 hover:translate-x-[3px]"
                    }`}
                  >
                    {/* Active Indicator (Garis Biru Muda Melayang) */}
                    {isParentActive && (
                      <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#53c7ff]"></div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item);
                      }}
                    >
                      {openDropdown === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {/* Submenu */}
                  {openDropdown === item.name && (
                    <div className="w-full flex flex-col items-center mt-1 mb-2 gap-1 animate-[fadeIn_0.3s_ease]">
                      {item.children.map((subItem) => (
                        <NavLink
                          to={subItem.path}
                          end
                          key={subItem.path}
                          className={({ isActive }) =>
                            `relative flex justify-start items-center gap-3 py-2 pl-11 pr-4 h-[38px] text-[13px] rounded-[11px] w-[80%] mx-auto transition-all duration-200 ${
                              isActive
                                ? "text-white bg-[#42A5F5]/20 font-semibold"
                                : "text-[#cfe2f7] hover:bg-[#42A5F5]/15 hover:translate-x-[3px]"
                            }`
                          }
                        >
                          {subItem.icon}
                          <span className="truncate">{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              {/* Menu Tanpa Anak (Single Link) */}
              return (
                <NavLink
                  to={item.path}
                  end
                  key={item.path}
                  className={({ isActive }) =>
                    `relative flex justify-start items-center gap-3 px-3.5 py-2.5 h-[43px] rounded-[11px] text-md font-medium mx-auto w-full transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-r from-[#1565C0]/80 to-[#42A5F5]/25 text-white"
                        : "text-[#cfe2f7] bg-transparent hover:bg-[#42A5F5]/15 hover:translate-x-[3px]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator (Garis Biru Muda Melayang) */}
                      {isActive && (
                        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#53c7ff]"></div>
                      )}
                      {item.icon}
                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            }
          })}
        </nav>
      </div>

      {/* Footer / Copyright */}
      <div className="p-4 mb-2 text-center relative z-10">
        <span className="text-[#dcecff] text-xs tracking-wide">
          © Rokeu BMN 2026, Version 2.0
        </span>
      </div>

      {/* Gambar Dekorasi di Pojok Kanan Bawah */}
      <img
        src="/logo-kemnaker-decoration.webp"
        alt="logo-decoration"
        className="absolute z-0 right-[-3rem] bottom-[-4.5rem] rotate-[168.75deg] opacity-10 pointer-events-none select-none"
        loading="eager"
        width={200}
      />
    </div>
  );
}

export default Sidebar;