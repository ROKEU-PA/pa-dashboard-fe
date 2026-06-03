import React from "react";
import User from "./User";

function Navbar({ menuName, user,role }) {
  return (
    
    <div className="bg-white w-full px-4">
      <div className="flex justify-between flex-wrap p-2">
        <span className="px-3 font-bold pl-6 md:pl-0 text-2xl">{menuName}</span>
          {role !== null && role !== undefined && (
            <User
              name={user}
              previlege="Administrator"
              role={role}
            />
          )}
      </div>
    </div>
  );
}

export default Navbar;