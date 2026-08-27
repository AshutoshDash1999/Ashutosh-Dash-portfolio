"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  IconArrowBounce,
  IconClick,
  IconClock,
  IconEye,
  IconFileDownload,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useStat } from "./use-insights";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

const statDefs = [
  {
    key: "visitors",
    endpoint: "/api/overview/audience",
    label: "Unique Visitors",
    icon: IconUsers,
    color: "bg-chart-1",
    tooltip:
      "Distinct visitors, from the saved PostHog insight's configured date range.",
  },
  {
    key: "pageviews",
    endpoint: "/api/overview/views",
    label: "Pageviews",
    icon: IconEye,
    color: "bg-chart-2",
    tooltip: "Total $pageview events tracked by PostHog.",
  },
  {
    key: "bounce-rate",
    endpoint: "/api/overview/bounce-rate",
    label: "Bounce Rate",
    icon: IconArrowBounce,
    color: "bg-chart-3",
    tooltip: "Share of sessions that left after viewing a single page.",
  },
  {
    key: "avg-session",
    endpoint: "/api/overview/avg-session",
    label: "Avg. Session",
    icon: IconClock,
    color: "bg-chart-5",
    tooltip: "Average session duration (mm:ss).",
  },
  {
    key: "resume-downloads",
    endpoint: "/api/overview/resume-downloads",
    label: "Resume Downloads",
    icon: IconFileDownload,
    color: "bg-chart-4",
    tooltip: "Times the resume was downloaded.",
  },
  {
    key: "project-clicks",
    endpoint: "/api/overview/project-clicks",
    label: "Project Clicks",
    icon: IconClick,
    color: "bg-chart-6",
    tooltip: "Clicks on project links and demos.",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function StatCard({ def }: { def: (typeof statDefs)[number] }) {
  const { data, isLoading, error } = useStat(def.endpoint);
  const Icon = def.icon;

  let display: string;
  if (error || data?.value == null) {
    display = "—";
  } else {
    display = data.formatted ?? formatNumber(data.value);
  }

  return (
    <motion.div variants={cardVariants}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-0 h-full bg-secondary-background cursor-help">
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={cn(
                  "size-11 shrink-0 rounded-base border-2 border-border flex items-center justify-center",
                  def.color,
                )}
              >
                <Icon className="size-5 text-main-foreground" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-foreground/70 truncate">
                  {def.label}
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-14" />
                ) : (
                  <span className="text-lg font-heading truncate">
                    {display}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-62.5 text-sm">
          {def.tooltip}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}

export function StatCards() {
  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statDefs.map((def) => (
          <StatCard key={def.key} def={def} />
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
