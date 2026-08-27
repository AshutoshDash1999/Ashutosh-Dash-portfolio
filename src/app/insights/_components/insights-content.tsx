"use client";

import { IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import { type ReactNode, useState } from "react";
import { mutate } from "swr";
import { invalidateInsightsCache } from "@/app/insights/actions";
import { Button } from "@/components/ui/button";
import { BreakdownBarChart } from "./breakdown-bar-chart";
import { BreakdownDonutChart } from "./breakdown-donut-chart";
import { StatCards } from "./stat-cards";
import { TimeSeriesChart } from "./time-series-chart";
import { TrafficTrendChart } from "./traffic-trend-chart";
import { UtmOverTimeChart } from "./utm-over-time-chart";
import { WebVitalsCard } from "./web-vitals-card";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string): string {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function DashboardSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-heading mb-4">{title}</h2>
      {children}
    </div>
  );
}

export function InsightsContent() {
  const [isInvalidating, setIsInvalidating] = useState(false);

  async function handleInvalidateCache() {
    if (isInvalidating) return;
    setIsInvalidating(true);
    try {
      await invalidateInsightsCache();
      await mutate((key) => typeof key === "string" && key.startsWith("/api/"));
    } finally {
      setIsInvalidating(false);
    }
  }

  return (
    <section className="px-6 md:px-12 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-heading mb-2">
            Site Insights
          </h1>
          <p className="text-foreground/70">
            Live analytics from PostHog. Each panel uses the date range
            configured in its saved insight.
          </p>
        </div>
        <Button
          variant="neutral"
          size="sm"
          onClick={handleInvalidateCache}
          disabled={isInvalidating}
          className="w-fit shrink-0"
        >
          <IconRefresh
            className={isInvalidating ? "animate-spin" : undefined}
            aria-hidden
          />
          {isInvalidating ? "Refreshing…" : "Refresh data"}
        </Button>
      </motion.div>

      <DashboardSection title="Overview">
        <StatCards />
      </DashboardSection>

      <DashboardSection title="Traffic">
        <div className="mb-6">
          <TrafficTrendChart delay={0.15} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakdownBarChart
            endpoint="/api/graphs/top-pages"
            title="Top Pages"
            description="Most viewed pages"
            delay={0.2}
          />
          <TimeSeriesChart
            endpoint="/api/graphs/time-on-site"
            title="Time on Site"
            description="Average daily session time"
            label="Duration"
            color="var(--chart-5)"
            valueFormatter={formatSeconds}
            delay={0.2}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Acquisition">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BreakdownBarChart
            endpoint="/api/graphs/traffic-sources"
            title="Traffic Sources"
            description="Visitors by referrer source"
            brandColors
            delay={0.25}
          />
          <BreakdownBarChart
            endpoint="/api/graphs/referring-domains"
            title="Referring Domains"
            description="Visitors by referring domain"
            delay={0.25}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakdownBarChart
            endpoint="/api/graphs/campaign-sources-all-time"
            title="UTM Sources"
            description="All-time visits by UTM source"
            brandColors
            delay={0.3}
          />
          <UtmOverTimeChart delay={0.3} />
        </div>
      </DashboardSection>

      <DashboardSection title="Audience">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BreakdownDonutChart
            endpoint="/api/graphs/audience-by-country"
            title="Top Countries"
            description="Visitors by geographic location"
            centerLabel="Visitors"
            labelFormatter={countryName}
            delay={0.35}
          />
          <BreakdownDonutChart
            endpoint="/api/graphs/device-types"
            title="Device Types"
            description="Visitors by device category"
            centerLabel="Visitors"
            delay={0.35}
          />
          <BreakdownDonutChart
            endpoint="/api/graphs/theme-preference"
            title="Theme Preference"
            description="Light vs dark mode usage"
            centerLabel="Visitors"
            delay={0.35}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakdownBarChart
            endpoint="/api/graphs/browsers"
            title="Browsers"
            description="Visitors by browser"
            delay={0.4}
          />
          <BreakdownBarChart
            endpoint="/api/graphs/os"
            title="Operating Systems"
            description="Visitors by operating system"
            delay={0.4}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Engagement">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakdownBarChart
            endpoint="/api/graphs/nav-clicks"
            title="Navigation Clicks"
            description="Clicks by navigation item"
            delay={0.45}
          />
          <BreakdownBarChart
            endpoint="/api/graphs/portfolio-interactions"
            title="Portfolio Interactions"
            description="Total clicks by interaction type"
            delay={0.45}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Performance">
        <WebVitalsCard delay={0.5} />
      </DashboardSection>
    </section>
  );
}
