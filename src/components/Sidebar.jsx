import { useAuth } from "@/contexts/AuthContexts";
import { Building, Layers, LogOut, UserRoundCog, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Pelaksanaan Anggaran",
    children: [
      {
        name: "Satuan Kerja",
        path: "/satuan-kerja",
        icon: <Building />,
      },
      {
        name: "Kompilasi",
        path: "/compilation",
        icon: <Layers />,
        adminOnly: true,
      },
      {
        name: "Manajemen Akun",
        path: "/user-management",
        icon: <UserRoundCog />,
        adminOnly: true
      },
    ],
  },
  {
    name: "Akuntansi Laporan",
    adminOnly: true,
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
  },
  {
    name: "Barang Milik Negara",
    adminOnly: true,
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
  },
  {
    name: "PTUK & TU",
    adminOnly: true,
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
  },
];

function Sidebar({ isAdmin }) {
  const { logout } = useAuth();
  const handleLogout = () => logout();

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div
      style={{
        width: "200px",
        height: "100vh",
        background: "#15406A",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        color: "#fff"
      }}
    >
      {/* Bagian atas: Logo & Menu (scrollable jika penuh) */}
      <div style={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
        <img
          src="/logo-kemnaker.png"
          alt="logo"
          width="160"
          style={{ marginBottom: "2rem" }}
        />
        <nav>
          {menuItems
            .filter((item) => isAdmin || !item.adminOnly)
            .map((item, index) => {
              if (item.children) {
                return (
                  <div key={index}>
                    {/* Dropdown toggle */}
                    <div
                      className={`dropdown-parent${openDropdown === item.name ? " open": ""}`}
                      onClick={() => toggleDropdown(item.name)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <div style={{ position: "absolute", right: "-5px" }}>
                        {openDropdown === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    {/* Submenu */}
                    {openDropdown === item.name && (
                      <div style={{ paddingLeft: "1rem", marginTop: "5px" }}>
                        {item.children.map((subItem) => (
                          <NavLink
                            to={subItem.path}
                            key={subItem.path}
                            className={({ isActive }) =>
                              `sidebar-link${isActive ? " active" : ""}`
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              color: "#fff",
                              padding: "6px 0",
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
                    key={item.path}
                    className={({ isActive }) =>
                      `sidebar-link${isActive ? " active" : ""}`
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px",
                      color: "#fff",
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
          borderTop: "1px solid #1F5B8A",
        }}
      >
        <span
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <LogOut />
          Logout
        </span>
      </div>
    </div>
  );
}

export default Sidebar;