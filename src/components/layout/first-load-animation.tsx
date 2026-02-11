"use client";

import { motion } from "motion/react";
import {
  createContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** True after the first-load blur animation has completed. Sections use this to delay their entrance so only one animation runs on load. */
export const FirstLoadContext = createContext(false);

export function FirstLoadAnimation({ children }: { children: ReactNode }) {
  const hasAnimatedRef = useRef(false);
  const [done, setDone] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    setDone(true);
  }, []);

  if (done) {
    return (
      <FirstLoadContext.Provider value={true}>
        {children}
      </FirstLoadContext.Provider>
    );
  }

  return (
    <FirstLoadContext.Provider value={false}>
      <motion.div
        initial={{ filter: "blur(12px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </FirstLoadContext.Provider>
  );
}
