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

    if (role === "user" || role === "pic") {
      const allowedMenus = ["E-SPP", "E-Arsip", "Monitoring", "IKPA", "SP2D", "Realisasi", "Kalender"];
      return menuItems.filter(item => allowedMenus.includes(item.name));
    }   

    if (role === "admin") {
      return menuItems
        .filter(
          (item) =>
            item.name === "Pelaksanaan Anggaran" || item.name === "Management" && item.name !== "Inventaris Kantor",
        )
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) =>
            [
              "Pengajuan SPP",
              "Arsip SPM",
              "Monitoring E-SPP",
              "User Manage",
              "Kalender",
            ].includes(child.name),
          ),
        }));
    }

    if (role === "guest") {
      const excludedMenus = ["Management", "Inventaris Kantor", "Pengambilan Persediaan","E-SPP", "E-Arsip", "Monitoring", "IKPA", "Realisasi", "Kalender"];
      return menuItems
        .filter((item) => !excludedMenus.includes(item.name))
        .map((item) => {
          if (item.name === "Pelaksanaan Anggaran") {
            return {
              ...item,
              children: item.children?.filter((child) =>
                ["Dashboard", "IKPA", "Realisasi", "Kalender"].includes(
                  child.name,
                ),
              ),
            };
          }
          return item;
        });
    }

    if (!role) {
    const pathname = location.pathname;
      if (pathname.includes("/inventaris-kantor")) {
        return menuItems.filter(
          (item) => item.name === "Inventaris Kantor"
        );
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
      item.children?.some((child) => currentPath.startsWith(child.path)),
    );

    if (matchedMenu) {
      setOpenDropdown(matchedMenu.name);
    } else {
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        color: "#fff",
        overflow: "hidden",
      }}
      className="bg-gradient-to-b from-[#59C7FF] to-[#2F8AFD]"
    >
      <div
        style={{
          padding: "1rem",
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="sidebar-scroll"
      >
        <img
          src="/rokeu_logo_white.webp"
          alt="logo"
          width="150"
          className="mt-5 mb-10 ml-5"
        />
      
        <nav style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {getFilteredMenuItems().map((item, index) => {
            if (item.children) {
              return (
                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* Parent dropdown */}
                  <div
                    className={`dropdown-parent${
                      openDropdown === item.name ? " open" : ""
                    }`}
                    onClick={() => navigate(item?.path)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 16px",
                      cursor: "pointer",
                      margin: "0 auto 5px auto",
                      borderRadius: "8px",
                      width: "85%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <div onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item);
                    }}>
                      {openDropdown === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {/* Submenu */}
                  {openDropdown === item.name && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2px" }}>
                      {item.children.map((subItem) => (
                        <NavLink
                          to={subItem.path}
                          end
                          key={subItem.path}
                          className={({ isActive }) =>
                            `sidebar-link${isActive ? " active" : ""}`
                          }
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px 16px",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            borderRadius: "8px",
                            width: "80%",
                            margin: "0 auto 4px auto",
                            boxSizing: "border-box",
                          }}
                        >
                          {subItem.icon}
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <NavLink
                  to={item.path}
                  end
                  key={item.path}
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? " active" : ""}`
                  }
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 16px",
                    textDecoration: "none",
                    borderRadius: "8px",
                    margin: "0 auto 5px auto",
                    width: "85%",
                    boxSizing: "border-box",
                  }}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              );
            }
          })}
        </nav>
      </div>
      <div
        style={{
          padding: "1rem",
          marginBottom: "0.7rem",
          textAlign: "center",
        }}
      >
        <span
          style={{
            position: "relative",
            gap: "8px",
            zIndex: 10,
            color: "#fff",
            fontSize: "12px",
          }}
        >
          © Rokeu BMN 2026, Version 2.0
        </span>
      </div>
      <img
        src={"/logo-kemnaker-decoration.webp"}
        alt={"logo-decoration"}
        className={`absolute z-0 right-[-3rem] rotate-[168.75deg] bottom-[-4.5rem]`}
        loading="eager"
        width={200}
      />
    </div>
  );
}

export default Sidebar;
