// Card.jsx
import React from "react";

const Card = ({
  children,
  className = "",
  icon,
  color,
  title,
  subCaption = "",
}) => {
  return (
    <div className={``}>
      <div
        className={`${color} rounded-full content-center p-2 w-fit mx-[20px] relative mb-[-2rem]`}
      >
        {icon}
      </div>
      <div
        className={`bg-white rounded-xl mt-4 px-[1.5rem] py-[2rem] border border-gray-200 ${className}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <span className="font-bold text-lg">{title}</span>
          </div>
          <span className="text-sm font-bold text-[#898A8D]">{subCaption}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Card;
