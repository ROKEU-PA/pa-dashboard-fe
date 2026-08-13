import React, { useState, useEffect } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContexts";

function Navbar({ menuName, user, role }) {
  const [currentDate, setCurrentDate] = useState({ hari: "", tanggal: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const today = new Date();
    const hari = today.toLocaleDateString("id-ID", { weekday: "long" });
    const tanggal = today.toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
    setCurrentDate({ hari, tanggal });

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 3. FUNGSI TOGGLE DARK MODE
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (name.length >= 2) return name.substring(0, 2).toUpperCase();
    return name.toUpperCase();
  };

  const { logout } = useAuth();
  const handleLogout = () => logout();

  return (
    <header className="bg-white dark:bg-[#182335] w-full h-[94px] border-b border-[#e5edf5] dark:border-white/10 shadow-sm flex items-center px-4 md:px-8 sticky top-0 z-20 transition-colors duration-300">
      <div className="flex justify-between items-center w-full">
        
        <div className="flex flex-col ml-10 md:ml-0">
          <h1 className="font-bold text-[#18324f] dark:text-white text-2xl md:text-[28px] leading-tight tracking-tight m-0 transition-colors">
            {menuName || "Dashboard"}
          </h1>
          {user && menuName == "Monitoring E-SPP" && (
            <p className="text-[#718096] dark:text-gray-400 text-[13px] md:text-[14px] mt-1 m-0">
              Selamat Datang, <strong className="font-bold text-[#18324f] dark:text-blue-400">{user}</strong>
            </p>
          )}
          {menuName == "Satuan Kerja" && (
            <p className="text-[#718096] dark:text-gray-400 text-[13px] md:text-[14px] mt-1 m-0">
              Silahkan pilih satuan kerja anda
            </p>
          )}
          {menuName == "E-SPP" && (
            <p className="text-[#718096] dark:text-gray-400 text-[13px] md:text-[14px] mt-1 m-0">
              Elektronik Surat Permintaan Pembayaran
            </p>
          )}
        </div>

        {role !== null && role !== undefined && (
          <div className="flex items-center gap-2.5 md:gap-3">
            
            <div className="hidden md:block text-right mr-3">
              <div className="text-[#718096] dark:text-gray-400 text-[13px] leading-tight">
                {currentDate.hari}
              </div>
              <strong className="text-[#18324f] dark:text-white text-[13px] font-bold leading-tight">
                {currentDate.tanggal}
              </strong>
            </div>

            {/* Notification Button */}
            <button className="relative w-[42px] h-[42px] flex items-center justify-center border border-[#e5edf5] dark:border-white/10 rounded-xl bg-white dark:bg-[#111C30] text-[#18324f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="absolute top-[8px] right-[8px] w-[7px] h-[7px] bg-[#F44336] rounded-full border-[1.5px] border-white dark:border-[#111C30]"></span>
            </button>

            {/* 4. DARK MODE BUTTON (Udah pakai fungsi onClick) */}
            <button 
              onClick={toggleTheme}
              className="hidden sm:flex w-[42px] h-[42px] items-center justify-center border border-[#e5edf5] dark:border-white/10 rounded-xl bg-white dark:bg-[#111C30] text-[#18324f] dark:text-yellow-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none"
            >
              {isDarkMode ? (
                <Sun size={20} strokeWidth={1.8} />
              ) : (
                <Moon size={20} strokeWidth={1.8} />
              )}
            </button>

            {/* Help Button */}
            <button className="hidden sm:flex w-[42px] h-[42px] items-center justify-center border border-[#e5edf5] dark:border-white/10 rounded-xl bg-white dark:bg-[#111C30] text-[#18324f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>

            {/* Avatar Profile */}
            <div className="relative ml-1">
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-[43px] h-[43px] rounded-[13px] flex items-center justify-center bg-gradient-to-br from-[#1565C0] to-[#42A5F5] text-white font-[800] text-[15px] shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-[1px] transition-all"
              >
                {getInitials(user)}
              </div>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#111C30] border border-[#e5edf5] dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] rounded-xl p-2 z-50 animate-[fadeIn_0.2s_ease]">
                    <div
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="cursor-pointer flex items-center gap-3 text-[#F44336] hover:bg-[#ffebea] dark:hover:bg-red-500/20 p-3 rounded-lg transition-colors group"
                    >
                      <LogOut size={18} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
                      <span className="font-bold text-[14px]">Logout</span>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;