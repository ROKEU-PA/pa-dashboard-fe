import React, { useState, useEffect, useContext  } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar";
import { AppContext } from "@/contexts/AppContext";

function AppLayout({ children, isAdmin, title, userName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { userData } = useContext(AppContext);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  return (
    <div className="flex h-screen  overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >
        <Sidebar isAdmin={isAdmin} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1 left-3 z-[60] md:hidden p-2.5 bg-[#59C7FF] rounded-xl shadow-md border border-gray-100 text-[#616484] animate-in fade-in duration-300"
        >
          ☰
        </button>
      )}

      <main className="flex-1 overflow-auto transition-all duration-300">
        <Navbar className="pl-14 md:pl-0" menuName={title} user={userName} role={userData?.role} />
        <div className="p-2 md:p-4 sm:px-5 lg:px-6">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;
