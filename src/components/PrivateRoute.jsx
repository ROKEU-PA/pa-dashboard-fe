import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";
import { AppContext } from "@/contexts/AppContext";
import { isAuthorizedRoute } from "@/services/GeneralHelper";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  const { userData, listMenu } = useContext(AppContext);
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
      return;
    }

    const menus = [
      ...listMenu,
      { path: "/satuan-kerja" },
      { path: "/" },
      { path: "/compilation" },
      { path: "/user-management" },
      { path: "/soon" },
    ];

    const allowed = isAuthorizedRoute(location.pathname, userData, menus);

    if (!allowed) {
      if (userData !== null) {
        if (userData.role === "user" || userData.role === "pic") {
          const parts = location.pathname.split("/").filter(Boolean);

          if (parts[0] === "satuan-kerja" && parts.length > 1) {
            // Buat path baru dengan menghapus bagian terakhir
            const newPath = "/" + parts.slice(0, -1).join("/");
            window.location.replace(newPath);
          } else {
            window.location.replace("/satuan-kerja/pengajuan");
          }
          return;
        } else {
          window.location.replace("/dashboard-utama");
          return;
        }
      }
    }

    setIsAllowed(true);
  }, [token, userData, listMenu, location.pathname]);

  // Jangan render apa pun sampai izin dicek
  if (isAllowed === null) return null;

  return children;
};

export default PrivateRoute;
