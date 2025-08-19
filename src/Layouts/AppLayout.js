import React from "react";
import Sidebar from "../components/Sidebar";

function AppLayout({ children, isAdmin }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar isAdmin={isAdmin} />
      <div style={{ flex: 1 }}>
        <div style={{ marginLeft: "250px", padding: "1rem" }}>{children}</div>
      </div>
    </div>
  );
}

export default AppLayout;
