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
    <div className="relative">
      {/* Icon Badge */}
      <div
        className={`${color} rounded-full p-2 w-fit mx-5 relative z-10 -mb-4`}
      >
        {icon}
      </div>

      {/* Card Content */}
      <div
        className={`bg-white rounded-xl pt-8 px-6 pb-6 border border-gray-200 ${className}`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          {subCaption && (
            <span className="text-sm font-bold text-gray-400">
              {subCaption}
            </span>
          )}
        </div>

        {/* Children Container with overflow control */}
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
export default Card;
