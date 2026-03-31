import React from "react";

function TableCell({
  children,
  align = "left",
  component = "td",
  scope,
  sx = {},
  style = {},
  index = null,
  className = "",
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
      scope={scope}
      {...props}
      className={`${className} ${index ? ((index + 1) % 2 !== 0 ? "bg-white" : "bg-[#EBF8FF]") : ""}`}
    >
      {children}
    </Component>
  );
}

export default TableCell;
