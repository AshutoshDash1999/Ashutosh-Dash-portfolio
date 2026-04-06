"use client";

import type { TablerIcon } from "@tabler/icons-react";
import {
  IconChartBar,
  IconDatabase,
  IconLoader2,
  IconRocket,
  IconSparkles,
  IconWorld,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const messageRowVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const iconVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 8, -8, 0],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut" as const,
    },
  },
};

const LOADING_DURATION_MS = 1200;
const MESSAGE_INTERVAL_MS = 380;

const LOADING_MESSAGES: { message: string; Icon: TablerIcon }[] = [
  { message: "Loading content…", Icon: IconLoader2 },
  { message: "Fetching analytics…", Icon: IconChartBar },
  { message: "Preparing your experience…", Icon: IconRocket },
  { message: "Warming up the pixels…", Icon: IconSparkles },
  { message: "Syncing data…", Icon: IconDatabase },
  { message: "Connecting to the web…", Icon: IconWorld },
];

export function LoadingScreen({
  userName,
  onComplete,
}: {
  userName: string;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleComplete = useCallback(() => {
    if (isComplete) return;
    setIsComplete(true);
    onComplete();
  }, [onComplete, isComplete]);

  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / LOADING_DURATION_MS) * 100);
      setProgress(p);
      if (p >= 100) {
        handleComplete();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [handleComplete]);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 p-4"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border-4 border-black bg-chart-3 shadow-[6px_6px_0_0_black]">
        <div className="flex items-center gap-2 border-b-4 border-black bg-chart-8 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-black" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-black" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-black" aria-hidden />
          </div>
        </div>

        <div className="p-6">
          <p className="mb-4 text-xl font-bold leading-7 text-black md:text-2xl md:leading-8 text-center">
            {userName}
          </p>

          <motion.div
            key={messageIndex}
            className="mb-4 flex items-center justify-center gap-2 text-base font-medium text-black md:text-lg"
            variants={messageRowVariants}
            initial="initial"
            animate="animate"
            aria-live="polite"
          >
            {LOADING_MESSAGES.slice(messageIndex, messageIndex + 1).map(
              ({ message, Icon }) => (
                <Fragment key={messageIndex}>
                  <motion.span
                    className="flex shrink-0 items-center justify-center"
                    variants={iconVariants}
                    animate="animate"
                    aria-hidden
                  >
                    <Icon className="size-5 md:size-6" />
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.08,
                      ease: "easeOut",
                    }}
                  >
                    {message}
                  </motion.span>
                </Fragment>
              ),
            )}
          </motion.div>

          <Progress
            value={progress}
            className="h-6 border-4 border-black rounded-full bg-black **:data-[slot=progress-indicator]:bg-chart-2 **:data-[slot=progress-indicator]:rounded-l-full **:data-[slot=progress-indicator]:border-0"
          />
        </div>
      </div>
    </div>
  );
}
