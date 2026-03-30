import React from "react";
import User from "./User";

function Navbar({ menuName, user }) {
  return (
    <div className="bg-white w-full">
      <div className="flex justify-between items-center flex-nowrap mt-2">
        <span className="md:px-4 pl-16 font-bold text-x1 md:text-2xl">{menuName}</span>
        <User name={user} previlege={"Administrator"} />
      </div>
    </div>
  );
}

export default Navbar;