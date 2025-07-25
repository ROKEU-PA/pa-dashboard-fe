import { useAuth } from "@/contexts/AuthContexts";
import {
  Building,
  Layers,
  LogOut,
  UserRoundCog,
  ChevronDown,
  ChevronUp,
  AlignEndHorizontal,
  TrendingUpDown,
  FolderCheck,
  HandCoins,
  FileChartColumn,
  Package,
  BookUser,
  Settings,
  GaugeCircle,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard Utama",
    path: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "PTUK",
    path: "/dashboard/ptuk",
    adminOnly: true,
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
    icon: <Layers />,
  },
  {
    name: "Pelaksanaan Anggaran",
    path: "/dashboard/pelaksanaan-anggaran",
    children: [
      {
        name: "Pengajuan SPP",
        path: "/satuan-kerja",
        icon: <FolderCheck />,
      },
      {
        name: "IKPA",
        path: "/soon",
        icon: <AlignEndHorizontal />,
      },
      {
        name: "Kompilasi",
        path: "/compilation",
        icon: <TrendingUpDown />,
        adminOnly: true,
      },
    ],
    icon: <HandCoins />,
  },
  {
    name: "Barang Milik Negara",
    adminOnly: true,
    path: "/dashboard/barang-milik-negara",
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
    icon: <Package />,
  },
  {
    name: "Akuntansi Laporan",
    adminOnly: true,
    path: "/dashboard/akuntansi-laporan",
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
    icon: <FileChartColumn />,
  },
  {
    name: "Tata Usaha",
    adminOnly: true,
    path: "/dashboard/tata-usaha",
    children: [
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
    icon: <BookUser />,
  },
  {
    name: "Helpdesk",
    path: "/dashboard/helpdesk",
    icon: <MessageSquare />,
  },
  {
    name: "Management",
    icon: <Settings />,
    children: [
      {
        name: "User Manage",
        path: "/user-management",
        icon: <UserRoundCog />,
      },
      {
        name: "Dashboard Manage",
        path: "/dashboard-management",
        icon: <GaugeCircle />,
      },
    ],
    adminOnly: true,
  },
];

function Sidebar({ isAdmin }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => logout();

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (item) => {
    const isOpen = openDropdown === item.name;
    if (!isOpen && item.path) {
      navigate(item.path); // Navigasi ke path parent
    }
    setOpenDropdown(isOpen ? null : item.name);
  };

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#15406A",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        color: "#fff",
      }}
    >
      {/* Bagian atas: Logo & Menu (scrollable jika penuh) */}
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
                      className={`dropdown-parent${
                        openDropdown === item.name ? " open" : ""
                      }`}
                      onClick={() => toggleDropdown(item)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        cursor: "pointer",
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
                      <div>
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
                        {item.children
                          .filter((subItem) => isAdmin || !subItem.adminOnly)
                          .map((subItem) => (
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
