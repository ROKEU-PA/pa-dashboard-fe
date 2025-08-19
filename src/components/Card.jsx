// Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl p-4 border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
