import { useState, useEffect } from "react";

export const useMediaQuery = (breakpoint) => {
  const [matches, setMatches] = useState(() => window.innerWidth > breakpoint);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const handleChange = (event) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpoint]);

  return matches;
};
