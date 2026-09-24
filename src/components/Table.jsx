import React from "react";

function Table({ className = "", children, ...props }) {
  return (
    <table 
      className={`w-full border-collapse ${className}`} 
      {...props}
    >
      {children}
    </table>
  );
}

export default Table;