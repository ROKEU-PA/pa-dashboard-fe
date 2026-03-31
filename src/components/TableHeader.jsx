import React from "react";

function TableHeader({ children, className }) {
  const headerStyle = {
    backgroundColor: "#2F8AFD",
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontWeight: 600,
    color: "#ffffff",
  };
  return (
    <thead className={className} style={headerStyle}>
      {children}
    </thead>
  );
}

export default TableHeader;
