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
  Network,
  Archive,
  Axis3D,
  Table,
} from "lucide-react";
import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";

const menuItems = [
  {
    name: "Dashboard Utama",
    path: "/dashboard-utama",
    icon: <LayoutDashboard />,
  },
  {
    name: "PTUK",
    path: "/dashboard/ptuk",
    adminOnly: true,
    children: [
      {
        name: "Tuntutan Ganti Rugi",
        path: "/ptuk/tuntutan-ganti-rugi",
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
        name: "Dashboard",
        path: "/pelaksanaan-anggaran",
        icon: <Axis3D />,
      },
        name: "Tanda Terima SPP",
        path: "/tanda-terima",
        icon: <Table />,
      },
      {
        name: "Pengajuan SPP",
        path: "/satuan-kerja/pengajuan",
        icon: <FolderCheck />,
      },
      {
        name: "IKPA",
        path: "/ikpa",
        icon: <AlignEndHorizontal />,
      },
      {
        name: "Arsip SPM",
        path: "/satuan-kerja",
        icon: <Archive />,
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
        name: "Dashboard",
        path: "/barang-milik-negara",
        icon: <Axis3D />,
      },
      {
        name: "Home",
        path: "/soon",
        icon: <Building />,
      },
    ],
    icon: <Package />,
  },
  {
    name: "Akuntansi Pelaporan",
    adminOnly: true,
    path: "/dashboard/akuntansi-pelaporan",
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
    name: "Struktur Organisasi",
    path: "/dashboard/struktur-organisasi",
    icon: <Network />,
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

function Sidebar() {
  const { userData } = useContext(AppContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const role = userData?.role;

  const handleLogout = () => logout();

  // 🔍 Filter menu berdasarkan role
  const getFilteredMenuItems = () => {
    if (role === "admin") return menuItems;

    if (role === "user" || role === "pic") {
      return menuItems
        .filter((item) => item.name === "Pelaksanaan Anggaran")
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) =>
            ["Pengajuan SPP", "Arsip SPM", "Tanda Terima SPP"].includes(child.name)
          ),
        }));
    }

    if (role === "guest") {
      return menuItems.filter((item) => item.name !== "Management");
    }

    return [];
  };

  const toggleDropdown = (item) => {
    const isOpen = openDropdown === item.name;
    if (!isOpen && item.path) {
      navigate(item.path);
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
      {/* Logo dan isi menu */}
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
          {getFilteredMenuItems().map((item, index) => {
            if (item.children) {
              return (
                <div key={index}>
                  {/* Parent dropdown */}
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

      {/* Logout */}
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
