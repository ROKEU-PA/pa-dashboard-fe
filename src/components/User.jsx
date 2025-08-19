// Card.jsx
import React from "react";

const User = ({ children, name, previlege, className = "" }) => {
  return (
    <div className={`${className} flex gap-2 items-center mb-4 `}>
      <div className="flex flex-col text-right">
        <span className="text-[14px] font-bold">{name}</span>
        <span className="text-[12px] font-normal">{previlege}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-red-500"></div>
    </div>
  );
};

export default User;
