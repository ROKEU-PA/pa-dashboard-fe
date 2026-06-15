import React from "react";

function TableCell({
  children,
  align = [],
  component = "td",
  scope,
  sx = {},
  style = {},
  index = null,
  className = "",
  colspan = "1",
  rowspan = "1",
  ...props
}) {
  const Component = component;
  const textAlign =
    align === "right" ? "right" : align === "center" ? "center" : "left";

  const defaultStyle = {
    ...style,
    padding: "10px 16px",
    textAlign,
    fontWeight: component === "th" ? 600 : 400,
    // borderBottom: "1px solid #e0e0e0",
    ...sx,
  };

  return (
    <Component
      style={defaultStyle}
      colSpan={colspan}
      rowSpan={rowspan}
      scope={scope}
      {...props}
      className={`${className} ${index ? ((index + 1) % 2 !== 0 ? "bg-white" : "bg-[#EBF8FF]") : ""}`}
    >
      {children}
    </Component>
  );
}

export default TableCell;
