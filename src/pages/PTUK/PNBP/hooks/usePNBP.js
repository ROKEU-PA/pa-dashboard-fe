import { useState } from "react";

export const usePNBP = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return {
    activeTab,
    handleTabChange,
  };
};
