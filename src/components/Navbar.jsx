import React from "react";
import User from "./User";

function Navbar({ menuName, user }) {
  return (
<<<<<<< HEAD
    <div className="bg-white w-full px-4 py-2 ">
      <div className="flex justify-between items-center mt-2">
        <span className="pl-10 md:pl-3 font-bold text-lg md:text-2xl transition-all">
          {menuName}
        </span>
        <div className="flex-shrink-0">
          <User name={user} previlege={"Administrator"} />
        </div>
    </div>
=======
    <div className="bg-white w-full py-2 px-4">
      <div className="flex justify-between items-center mt-2">
        <span className="pl-10 md:pl-3 font-bold text-lg transition-all md:text-2xl">{menuName}</span>
        <div className="flex-shrink-0">
          <User name={user} previlege={"Administrator"} />
        </div>
      </div>
>>>>>>> bda8cd1 (refactor(dashboard): improve state property structure)
    </div>
  );
}

export default Navbar;