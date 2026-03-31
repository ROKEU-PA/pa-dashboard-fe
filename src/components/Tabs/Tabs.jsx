import React, { useState, useRef, useEffect } from "react";

const Tabs = ({
  children,
  value,
  onChange,
  variant = "standard", // 'standard' | 'fullWidth' | 'scrollable' | 'contained'
  indicatorColor = "bg-blue-600",
  className = "",
  centered = false,
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef(null);
  const isContained = variant === "contained";

  useEffect(() => {
    if (!isContained) {
      updateIndicator();
    }
  }, [value, isContained]);

  const updateIndicator = () => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('[aria-selected="true"]');
      if (activeTab) {
        setIndicatorStyle({
          width: activeTab.offsetWidth,
          left: activeTab.offsetLeft,
        });
      }
    }
  };

  const handleTabClick = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const getContainerClasses = () => {
    const base = "relative inline-flex";
    const variantClasses = {
      standard: "",
      fullWidth: "w-full",
      scrollable: "overflow-x-auto",
      contained: "w-full",
    };
    const centerClass = centered && !isContained ? "justify-center" : "";

    return `${base} ${variantClasses[variant]} ${centerClass}`;
  };

  const getTabsClasses = () => {
    if (isContained) {
      return "flex bg-gray-100 rounded-lg p-1 gap-2";
    }

    const base = "flex border-b border-gray-200";
    const variantClasses = {
      standard: "",
      fullWidth: "w-full",
      scrollable: "min-w-max",
    };

    return `${base} ${variantClasses[variant]}`;
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <div ref={tabsRef} role="tablist" className={getTabsClasses()}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isActive: child.props.value === value,
              onClick: handleTabClick,
              variant: variant,
              className:
                variant === "fullWidth" || isContained
                  ? "flex-1"
                  : child.props.className,
            });
          }
          return child;
        })}

        {/* Material UI-style indicator - only for non-contained variants */}
        {!isContained && (
          <span
            className={`absolute bottom-0 h-[2px] transition-all duration-300 ease-in-out ${indicatorColor}`}
            style={{
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
