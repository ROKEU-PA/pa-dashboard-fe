const Tab = ({
  label,
  value,
  isActive,
  onClick,
  disabled = false,
  icon,
  variant,
  className = "",
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(value);
    }
  };

  const isContained = variant === "contained";

  const baseClasses =
    "relative font-medium text-sm transition-all duration-200 cursor-pointer whitespace-nowrap w-fit";

  if (isContained) {
    const containedClasses = isActive
      ? "bg-[#59C7FF] text-white rounded-lg"
      : "text-[#898A8D] hover:text-gray-900 rounded-lg";
    const containedDisabled = disabled
      ? "opacity-50 cursor-not-allowed hover:text-[#898A8D]"
      : "";
    const containedPadding = "px-4 py-2 ";

    return (
      <button
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        onClick={handleClick}
        disabled={disabled}
        className={`${baseClasses} ${containedPadding} ${containedClasses} ${containedDisabled} ${className}`}
      >
        <div className="flex items-center justify-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span>{label}</span>
        </div>
      </button>
    );
  }

  // Standard variant styling
  const standardPadding = "px-4 py-3 min-w-[90px]";
  const activeClasses = isActive
    ? "text-blue-600"
    : "text-[#898A8D] hover:text-gray-900";
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed hover:text-[#898A8D]"
    : "";

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${standardPadding} ${activeClasses} ${disabledClasses} ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span>{label}</span>
      </div>
    </button>
  );
};

export default Tab;
