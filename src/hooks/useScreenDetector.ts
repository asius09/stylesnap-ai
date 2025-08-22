import { useEffect, useState } from "react";

export const useScreenDetector = () => {
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };

    setWidth(window.innerWidth); // set initial width on client

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 425;
  const isTablet = width <= 1024;
  const isDesktop = width > 1024;

  return { isMobile, isTablet, isDesktop };
};
