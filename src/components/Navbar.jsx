import React from "react";
import User from "./User";

function Navbar({ menuName, user }) {
  return (
    <div className="bg-white w-full px-4 py-2 border-b border-gray-100">
      <div className="flex justify-between items-center mt-2">
        {/* - pl-14: geser kanan 56px di HP agar tidak tertutup hamburger
          - md:pl-3: kembalikan ke padding normal di desktop
          - text-lg: font lebih kecil di HP (aslinya text-2xl)
          - md:text-2xl: font kembali besar di desktop
        */}
        <span className="pl-10 md:pl-3 font-bold text-lg md:text-2xl transition-all">
          {menuName}
        </span>

        {/* User tetap di kanan */}
        <div className="flex-shrink-0">
          <User name={user} previlege={"Administrator"} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;