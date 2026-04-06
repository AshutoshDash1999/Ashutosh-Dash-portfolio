"use client";

import { IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { mutate } from "swr";
import { invalidateInsightsCache } from "@/app/insights/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type InsightsPeriod, insightsPeriodLabel } from "@/lib/api/stats-days";
import {
  BrowsersChart,
  CountriesChart,
  DeviceTypesChart,
  StatCards,
  TrafficSourcesChart,
  VisitorsChart,
  WebVitalsChart,
} from "./index";
import { useInsightsPeriod } from "./insights-period-context";

const periodOptions: {
  value: string;
  period: InsightsPeriod;
  label: string;
}[] = [
  { value: "7", period: 7, label: "Last 7 days" },
  { value: "30", period: 30, label: "Last 30 days" },
  { value: "90", period: 90, label: "Last 3 months" },
  { value: "all", period: "all", label: "All time" },
];

export function InsightsContent() {
  const { period, setPeriod } = useInsightsPeriod();
  const [isInvalidating, setIsInvalidating] = useState(false);

  async function handleInvalidateCache() {
    if (isInvalidating) return;
    setIsInvalidating(true);
    try {
      await invalidateInsightsCache();
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/stats/"),
      );
    } finally {
      setIsInvalidating(false);
    }
  }

  const periodSelectValue = period === "all" ? "all" : String(period);

  return (
    <section className="px-6 md:px-12 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6 flex-1 min-w-0">
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-heading mb-2">
              Site Insights
            </h1>
            <p className="text-foreground/70">
              Analytics for the {insightsPeriodLabel(period)}.
              {period === "all"
                ? " Traffic and browser bar charts use the same stored history window."
                : " Bar charts below use all-time data."}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
            <span className="text-xs text-foreground/60 font-medium">
              Period
            </span>
            <Select
              value={periodSelectValue}
              onValueChange={(value) => {
                const opt = periodOptions.find((o) => o.value === value);
                if (opt) setPeriod(opt.period);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          {isInvalidating ? "Invalidating…" : "Invalidate cache"}
        </Button>
      </motion.div>

      <div className="mb-8">
        <StatCards />
      </div>

      <div className="mb-8">
        <VisitorsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrafficSourcesChart />
        <CountriesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DeviceTypesChart />
        <BrowsersChart />
      </div>

      <div className="mb-8">
        <WebVitalsChart />
      </div>
    </section>
  );
}
