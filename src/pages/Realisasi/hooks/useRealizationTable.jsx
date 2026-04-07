import { useState } from "react";

export const useRealizationTable = () => {
  const [selectOpenMonth, setSelectOpenMonth] = useState(false);
  const [selectOpenYear, setSelectOpenYear] = useState(false);

  return {
    selectOpenMonth,
    selectOpenYear,
    setSelectOpenMonth,
    setSelectOpenYear,
  };
};
