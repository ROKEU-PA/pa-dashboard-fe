import React from "react";

export function TableBody({ children, className = "", ...props }) {
  return (
    <tbody 
      className={`divide-y divide-slate-100 dark:divide-white/5 ${className}`} 
      {...props}
    >
      {children}
    </tbody>
  );
}