import { useState } from "react";

export const useFinancialAdiministrator = () => {
  const [activeTab, setActiveTab] = useState("Realisasi Penerimaan");

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return {
    activeTab,
    handleTabChange,
  };
};
