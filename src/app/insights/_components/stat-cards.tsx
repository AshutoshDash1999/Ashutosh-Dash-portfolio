"use client";

import {
  IconAlertTriangle,
  IconClock,
  IconEye,
  IconFileDownload,
  IconUserCheck,
  IconUserScan,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useEngagement,
  usePageviews,
  useResumeButtonClicks,
  useSession,
  useVisitors,
} from "@/lib/api/hooks";
import { type InsightsPeriod, insightsPeriodLabel } from "@/lib/api/stats-days";
import { cn } from "@/lib/utils";
import { useInsightsPeriod } from "./insights-period-context";

interface StatsData {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  totalSessions: number;
  resumeButtonClicks: number;
  returningVisitors: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function getStatCardDefs(periodLabel: string, period: InsightsPeriod) {
  const returningTooltip =
    period === "all"
      ? "Visitors with pageviews on more than one calendar day in the all-time window."
      : `Repeat visitors in the ${periodLabel}, based on earliest pageview before the selected window.`;

  return [
    {
      key: "totalPageviews",
      label: "Total Pageviews",
      icon: IconEye,
      color: "bg-chart-1",
      format: (value: number) => formatNumber(value),
      tooltip: `Total page views in the ${periodLabel}. Calculated by counting all $pageview events tracked by PostHog.`,
    },
    {
      key: "uniqueVisitors",
      label: "Unique Visitors",
      icon: IconUsers,
      color: "bg-chart-2",
      format: (value: number) => formatNumber(value),
      tooltip: `Distinct users in the ${periodLabel}. Calculated using COUNT(DISTINCT distinct_id) from pageview events.`,
    },
    {
      key: "totalSessions",
      label: "Total Sessions",
      icon: IconUserScan,
      color: "bg-chart-5",
      format: (value: number) => formatNumber(value),
      tooltip: `Browsing sessions in the ${periodLabel}. Calculated using COUNT(DISTINCT $session_id) from pageview events.`,
    },
    {
      key: "avgSessionDuration",
      label: "Avg. Session",
      icon: IconClock,
      color: "bg-chart-3",
      format: (value: number) => formatDuration(value),
      tooltip: `Average time per session in the ${periodLabel}. Calculated as AVG(last_timestamp - first_timestamp) for each session.`,
    },
    {
      key: "resumeButtonClicks",
      label: "Resume clicks",
      icon: IconFileDownload,
      color: "bg-chart-4",
      format: (value: number) => formatNumber(value),
      tooltip: `Times the hero resume button was clicked (${periodLabel}). Counts PostHog event resume_button_click.`,
    },
    {
      key: "returningVisitors",
      label: "Returning",
      icon: IconUserCheck,
      color: "bg-chart-6",
      format: (value: number) => formatNumber(value),
      tooltip: returningTooltip,
    },
  ] as const;
}

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

function StatCardSkeleton() {
  return (
    <Card className="p-0">
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="size-12 shrink-0" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardsError() {
  return (
    <Alert variant="destructive">
      <IconAlertTriangle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load statistics. Please try again later.
      </AlertDescription>
    </Alert>
  );
}

export function StatCards() {
  const { period } = useInsightsPeriod();
  const periodLabel = useMemo(() => insightsPeriodLabel(period), [period]);
  const statCards = useMemo(
    () => getStatCardDefs(periodLabel, period),
    [periodLabel, period],
  );

  const { totalPageviews, isPageviewsLoading, pageviewsError } =
    usePageviews(period);
  const { uniqueVisitors, isVisitorsLoading, visitorsError } =
    useVisitors(period);
  const { avgSessionDuration, isSessionLoading, sessionError } =
    useSession(period);
  const { engagement, isEngagementLoading, engagementError } =
    useEngagement(period);
  const { resumeButtonClicks, isResumeClicksLoading, resumeClicksError } =
    useResumeButtonClicks(period);

  const isLoading =
    isPageviewsLoading ||
    isVisitorsLoading ||
    isSessionLoading ||
    isEngagementLoading ||
    isResumeClicksLoading;
  const hasError =
    pageviewsError ||
    visitorsError ||
    sessionError ||
    engagementError ||
    resumeClicksError;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(["s0", "s1", "s2", "s3", "s4", "s5"] as const).map((id) => (
          <StatCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (hasError) {
    return <StatCardsError />;
  }

  const data: StatsData = {
    totalPageviews: totalPageviews ?? 0,
    uniqueVisitors: uniqueVisitors ?? 0,
    avgSessionDuration: avgSessionDuration ?? 0,
    totalSessions: engagement?.totalSessions ?? 0,
    resumeButtonClicks: resumeButtonClicks ?? 0,
    returningVisitors: engagement?.returningVisitors ?? 0,
  };

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const value = data[stat.key as keyof StatsData];
          const formattedValue =
            typeof value === "number" ? stat.format(value) : String(value);

          return (
            <motion.div key={stat.key} variants={cardVariants}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-0 h-full bg-secondary-background cursor-help">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div
                        className={cn(
                          "size-11 shrink-0 rounded-base border-2 border-border flex items-center justify-center",
                          stat.color,
                        )}
                      >
                        <Icon className="size-5 text-main-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs text-foreground/70 truncate">
                          {stat.label}
                        </span>
                        <span className="text-lg font-heading truncate">
                          {formattedValue}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[250px] text-sm">
                  {stat.tooltip}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
}
