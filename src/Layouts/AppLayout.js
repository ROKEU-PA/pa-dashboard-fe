import React, { useState, useEffect, useContext } from "react";
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
    <div className="h-screen w-full overflow-hidden flex md:grid md:grid-cols-[270px_1fr] bg-[#f5f7fa] dark:bg-[#0f1724]">
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-[270px] transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:block
        `}
      >
        <Sidebar isAdmin={isAdmin} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-4 z-[60] md:hidden p-2 bg-[#082b67] rounded-lg shadow-lg text-white border border-white/10 animate-in fade-in duration-300"
          aria-label="Buka Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      )}

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 w-full h-screen overflow-y-auto transition-all duration-300 relative">
        <Navbar menuName={title} user={userName} role={userData?.role} />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
      
    </div>
  );
}

export default AppLayout;