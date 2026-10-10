import { useState } from "react";

export function useIsMobileView() {
  const [isMobile] = useState(window.innerWidth < 768);

  return isMobile;
}