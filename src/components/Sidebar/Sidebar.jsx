import { useAuth } from "@/contexts/AuthContexts";
import { LogOut, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";
import { menuItems } from "./constants";

function Sidebar() {
  const { userData } = useContext(AppContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const role = userData?.role;
  const location = useLocation();

  const handleLogout = () => logout();

  const getFilteredMenuItems = () => {
    if (role === "super_admin") return menuItems;

    if (role === "user" || role === "pic") {
      return menuItems
        .filter((item) => item.name === "Pelaksanaan Anggaran")
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) =>
            ["Pengajuan SPP", "Arsip SPM", "Tanda Terima SPP", "LLAT"].includes(
              child.name,
            ),
          ),
        }));
    }

    if (role === "admin") {
      return menuItems
        .filter(
          (item) =>
            item.name === "Pelaksanaan Anggaran" || item.name === "Management"|| item.name === "Inventaris Kantor",
        )
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) =>
            [
              "Pengajuan SPP",
              "Arsip SPM",
              "Tanda Terima SPP",
              "User Manage",
              "LLAT",
            ].includes(child.name),
          ),
        }));
    }

    if (role === "guest") {
      return menuItems
        .filter((item) => item.name !== "Management" && item.name !== "Inventaris Kantor")
        .map((item) => {
          if (item.name === "Pelaksanaan Anggaran") {
            return {
              ...item,
              children: item.children?.filter((child) =>
                ["Dashboard", "IKPA", "Realisasi", "LLAT", "About"].includes(
                  child.name,
                ),
              ),
            };
          }
          return item;
        });
    }

    return [];
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
          justifyItems: "center",
        }}
        className="sidebar-scroll"
      >
        <img
          src="/rokeu_logo_white.webp"
          alt="logo"
          width="150"
          className="mt-5 mb-10"
        />
        <nav>
          {getFilteredMenuItems().map((item, index) => {
            if (item.children) {
              return (
                <div key={index}>
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
                      padding: "10px",
                      cursor: "pointer",
                      marginBottom: "5px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <div onClick={() => toggleDropdown(item)}>
                      {openDropdown === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {/* Submenu */}
                  {openDropdown === item.name && (
                    <div style={{ paddingLeft: "1rem", marginTop: "5px" }}>
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
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 6px",
                            textDecoration: "none",
                            fontSize: "0.9rem",
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
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px",
                    textDecoration: "none",
                    borderRadius: "5px",
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
