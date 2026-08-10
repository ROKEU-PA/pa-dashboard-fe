import React from "react";

function TableCell({
  children,
  align = "left",
  component = "td",
  className = "",
  colspan = "1",
  rowspan = "1",
  ...props
}) {
  const Component = component;
  
  // Ubah prop align jadi class Tailwind
  const textAlign =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <Component
      colSpan={colspan}
      rowSpan={rowspan}
      className={`px-4 py-3.5 align-middle transition-colors ${textAlign} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default TableCell;