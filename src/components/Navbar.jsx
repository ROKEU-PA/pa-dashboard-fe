import React from "react";
import User from "./User";

function Navbar({ menuName, user, role }) {
  return (
    <header className="bg-white w-full h-[70px] border-b border-slate-200 shadow-sm flex items-center px-4 md:px-6 sticky top-0 z-20">
      <div className="flex justify-between items-center w-full">
        
        <h1 className="font-bold text-slate-800 text-xl md:text-2xl pl-10 md:pl-0 tracking-tight">
          {menuName}
        </h1>

        {role !== null && role !== undefined && (
          <div className="flex items-center gap-3">
            <User
              name={user}
              previlege="Administrator"
              role={role}
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;