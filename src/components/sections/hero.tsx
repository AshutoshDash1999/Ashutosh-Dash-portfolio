"use client";

import { FirstLoadContext } from "@/components/layout/first-load-animation";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import data from "@/lib/data.json";
import { IconFileText } from "@tabler/icons-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const cardGameSkeletonCellKeys = [
  "cg-sk-0",
  "cg-sk-1",
  "cg-sk-2",
  "cg-sk-3",
  "cg-sk-4",
  "cg-sk-5",
  "cg-sk-6",
  "cg-sk-7",
  "cg-sk-8",
  "cg-sk-9",
  "cg-sk-10",
  "cg-sk-11",
] as const;

const slidePuzzleSkeletonCellKeys = [
  "sp-sk-0",
  "sp-sk-1",
  "sp-sk-2",
  "sp-sk-3",
  "sp-sk-4",
  "sp-sk-5",
  "sp-sk-6",
  "sp-sk-7",
] as const;

const CardGameSkeleton = () => (
  <div className="w-full h-full min-h-96 border-4 border-border rounded-lg bg-main p-6 flex flex-col gap-4">
    <div className="grid grid-cols-4 gap-4 flex-1">
      {cardGameSkeletonCellKeys.map((cellKey) => (
        <Skeleton key={cellKey} className="w-full aspect-square" />
      ))}
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-11 w-36" />
    </div>
  </div>
);

const SlidePuzzleSkeleton = () => (
  <div className="w-full h-full min-h-96 border-4 border-border rounded-lg bg-main p-6 flex flex-col gap-4">
    <div className="grid grid-cols-3 gap-2 flex-1">
      {slidePuzzleSkeletonCellKeys.map((cellKey) => (
        <Skeleton key={cellKey} className="w-full aspect-square" />
      ))}
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-11 w-36" />
    </div>
  </div>
);

const CardGame = dynamic(() => import("./card-game"), {
  ssr: false,
  loading: () => <CardGameSkeleton />,
});

const SlidePuzzle = dynamic(() => import("./slide-puzzle"), {
  ssr: false,
  loading: () => <SlidePuzzleSkeleton />,
});

const containerVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const headingVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const heading1Variants = {
  initial: headingVariants.initial,
  animate: {
    ...headingVariants.animate,
    transition: { duration: 0.6, delay: 0.1, ease: "easeOut" as const },
  },
};

const heading2Variants = {
  initial: headingVariants.initial,
  animate: {
    ...headingVariants.animate,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" as const },
  },
};

const heading3Variants = {
  initial: headingVariants.initial,
  animate: {
    ...headingVariants.animate,
    transition: { duration: 0.6, delay: 0.3, ease: "easeOut" as const },
  },
};

const cardGameContainerVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.4, ease: "easeOut" as const },
  },
};

const resumeLinkVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.4, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const { personal } = data;
  const { trackEvent } = useTrackEvent();
  const firstLoadComplete = useContext(FirstLoadContext);
  const [cardGameWrapperEntered, setCardGameWrapperEntered] = useState(false);

  const handleResumeClick = () => {
    trackEvent("resume_button_click", { location: "hero" });
  };

  return (
    <section id="hero" className="px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <motion.div
          className="flex-1 space-y-4"
          initial="initial"
          animate={firstLoadComplete ? "animate" : "initial"}
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-heading"
            initial="initial"
            animate={firstLoadComplete ? "animate" : "initial"}
            variants={heading1Variants}
          >
            {personal.name}
          </motion.h1>
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-heading text-main inline-block"
            initial="initial"
            animate={firstLoadComplete ? "animate" : "initial"}
            variants={heading2Variants}
          >
            {personal.title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-foreground max-w-2xl"
            initial="initial"
            animate={firstLoadComplete ? "animate" : "initial"}
            variants={heading3Variants}
          >
            {personal.bio}
          </motion.p>

          <motion.div
            initial="initial"
            animate={firstLoadComplete ? "animate" : "initial"}
            variants={resumeLinkVariants}
          >
            <Link
              href="/Ashutosh_Dash_Frontend_Dev.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors group"
              aria-label="View resume"
              onClick={handleResumeClick}
            >
              <Button size="xl">
                <IconFileText className="size-5" />
                <span className="text-base md:text-sm">View my Resume</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex-1 w-full min-h-96 flex items-center justify-center"
          initial="initial"
          animate={firstLoadComplete ? "animate" : "initial"}
          variants={cardGameContainerVariants}
          onAnimationComplete={() => {
            if (firstLoadComplete) setCardGameWrapperEntered(true);
          }}
        >
          <div className="w-full md:hidden">
            <SlidePuzzle entranceReady={cardGameWrapperEntered} />
          </div>
          <div className="hidden w-full md:block">
            <CardGame entranceReady={cardGameWrapperEntered} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
