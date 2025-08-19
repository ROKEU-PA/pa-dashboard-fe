import { useState, useEffect } from "react";

export function useBudgetExecution(initialValue) {
  const [state, setState] = useState(initialValue);

  function getIKPAColor(value) {
    if (value >= 95) {
      return "text-[#22c55e] bg-[#E4FAEC]"; // green
    } else if (value >= 89) {
      return "text-[#3b82f6] bg-[#DEEAFD]"; // blue
    } else if (value >= 70) {
      return "text-[#DAB802] bg-[#FFF9DD]"; // yellow
    } else {
      return "text-[#ef4444] bg-[#FCDCDC]"; // red
    }
  }

  // Return what you want to expose
  return {
    state,
    getIKPAColor,
  };
}
