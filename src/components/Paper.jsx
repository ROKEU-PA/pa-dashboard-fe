import React from "react";

function Paper({ children, elevation = 1, style, ...props }) {
  // Simple shadow variations based on elevation level (1 to 5)
  const shadows = [
    "none",
    "0 1px 3px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.07), 0 2px 1px rgba(0,0,0,0.06)",
    "0 2px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
    "0 4px 8px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.07)",
    "0 6px 10px rgba(0,0,0,0.09), 0 5px 8px rgba(0,0,0,0.06)",
    "0 8px 12px rgba(0,0,0,0.08), 0 7px 10px rgba(0,0,0,0.05)",
  ];

  const paperStyle = {
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[elevation] || shadows[3],
    padding: "1rem",
    ...style,
  };

  return (
    <div style={paperStyle} {...props}>
      <div>{children}</div>
    </div>
  );
}

export default Paper;
