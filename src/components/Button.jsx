import React, { useState } from "react";
import PropTypes from "prop-types";

function Button({
  type = "button",
  variant = "primary",
  className,
  size = "medium",
  disabled = false,
  onClick,
  children,
  style,
  icon = null,
}) {
  const [isHovered, setHovered] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const baseStyle = {
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.6 : 1,
    outline: "none",
  };

  const variantStyles = {
    primary: {
      backgroundColor: isActive ? "#0f2e4c" : isHovered ? "#2F8AFD" : "#59C7FF",
      color: "white",
    },
    secondary: {
      backgroundColor: isActive ? "#3bb999" : isHovered ? "#43e6bd" : "#4cd4b0",
      color: "#59C7FF",
    },
    outline: {
      backgroundColor: isActive
        ? "#e6f0f8"
        : isHovered
          ? "#f3faff"
          : "transparent",
      border: "2px solid #59C7FF",
      color: "#59C7FF",
    },
    danger: {
      backgroundColor: isActive ? "#b2241c" : isHovered ? "#e2544a" : "#d93025",
      color: "white",
    },
  };

  const sizeStyles = {
    small: {
      padding: "0.4em 0.8em",
      fontSize: "0.875rem",
    },
    medium: {
      padding: "0.5em 1.0em",
      fontSize: "0.975rem",
    },
    large: {
      padding: "0.6em 1.2em",
      fontSize: "1rem",
    },
    extraLarge: {
      padding: "0.8em 1.5em",
      fontSize: "1.125rem",
    },
  };

  const focusStyle = isFocused
    ? {
        boxShadow: "0 0 0 3px rgba(21, 64, 106, 0.3)",
      }
    : {};

  const styleFinal = {
    ...style,
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...focusStyle,
  };

  return (
    <button
      className={`pointer ${className}`}
      type={type}
      style={styleFinal}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div style={{ display: "inline-flex", gap: "0.5em" }}>
        {icon && icon}
        {children && (
          <span
            className="whitespace-nowrap"
            style={{ lineHeight: icon ? "25px" : 0 }}
          >
            {children}
          </span>
        )}
      </div>
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;
