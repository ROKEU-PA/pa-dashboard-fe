import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

function AppLayout({ children, isAdmin }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen  overflow-hidden">
      {/* Overlay mobile */}
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

      {/* Konten utama */}
      <main className="flex-1 p-4 overflow-auto transition-all duration-300">
        {/* Hamburger button */}
        <div className="md:hidden sticky top-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-800 bg-gray-200 p-2 rounded-md"
          >
            ☰
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}

export default AppLayout;
