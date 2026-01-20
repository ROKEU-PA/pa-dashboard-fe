import React from "react";
import User from "./User";

function Navbar({ menuName, user }) {
  return (
    <div className="bg-white w-full px-4">
      <div className="flex justify-between flex-wrap mt-2">
        <span className="px-3 font-bold text-2xl">{menuName}</span>
        <User name={user} previlege={"Administrator"} />
      </div>
    </div>
  );
}

export default Navbar;