import React from "react";
import PropTypes from "prop-types";

function Button({
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  onClick,
  children,
  icon = null,
  ...props
}) {
  // 1. BASE STYLE: Gaya dasar yang pasti nempel di semua tombol
  const baseClasses = 
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl outline-none transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none";

  // 2. VARIANT STYLE: Warna & Tema (Sudah disesuaikan dengan tema aplikasi lu)
  const variantClasses = {
    primary: 
      "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500/50 border border-transparent",
    secondary: 
      "bg-teal-400 hover:bg-teal-500 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-teal-400/50 border border-transparent",
    outline: 
      "bg-transparent border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:ring-2 focus:ring-blue-500/50",
    danger: 
      "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-500/50 border border-transparent",
    custom: 
      "", // Kosong, biar lu bebas 100% nge-custom via prop 'className' (misal buat tombol gradient)
  };

  // 3. SIZE STYLE: Ukuran padding & font
  const sizeClasses = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-2.5 text-base",
    extraLarge: "px-8 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      // Gabungin semua class secara otomatis
      className={`${baseClasses} ${variantClasses[variant] || ""} ${sizeClasses[size] || ""} ${className}`}
      {...props}
    >
      {/* Icon (kalau ada) */}
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      
      {/* Teks / Children */}
      {children && (
        <span className="whitespace-nowrap">
          {children}
        </span>
      )}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger", "custom"]),
  size: PropTypes.oneOf(["small", "medium", "large", "extraLarge"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.node,
};

export default Button;