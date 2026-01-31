import React from "react";

const TabPanel = ({
  children,
  value,
  activeValue,
  className = "",
  keepMounted = false,
}) => {
  const isActive = value === activeValue;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      className={`${isActive ? "block" : "hidden"} ${className} mt-4 p-1`}
    >
      {children}
    </div>
  );
};

export default TabPanel;
