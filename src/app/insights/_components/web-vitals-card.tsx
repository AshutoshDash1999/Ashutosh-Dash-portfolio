"use client";

import { cn } from "@/lib/utils";
import { InsightCard } from "./insight-card";
import { useMultiSeries } from "./use-insights";

// Thresholds based on Google's Core Web Vitals
const vitalsConfig = {
  lcp: {
    name: "LCP",
    fullName: "Largest Contentful Paint",
    unit: "ms",
    good: 2500,
    needsImprovement: 4000,
    description: "Loading performance",
  },
  fcp: {
    name: "FCP",
    fullName: "First Contentful Paint",
    unit: "ms",
    good: 1800,
    needsImprovement: 3000,
    description: "First visual response",
  },
  cls: {
    name: "CLS",
    fullName: "Cumulative Layout Shift",
    unit: "",
    good: 0.1,
    needsImprovement: 0.25,
    description: "Visual stability",
  },
  inp: {
    name: "INP",
    fullName: "Interaction to Next Paint",
    unit: "ms",
    good: 200,
    needsImprovement: 500,
    description: "Interactivity",
  },
  ttfb: {
    name: "TTFB",
    fullName: "Time to First Byte",
    unit: "ms",
    good: 800,
    needsImprovement: 1800,
    description: "Server response",
  },
} as const;

type VitalConfig = (typeof vitalsConfig)[keyof typeof vitalsConfig];

function getScoreColor(value: number, config: VitalConfig): string {
  if (value <= config.good) return "bg-chart-2"; // Green
  if (value <= config.needsImprovement) return "bg-chart-3"; // Yellow
  return "bg-chart-4"; // Red
}

function getScoreLabel(value: number, config: VitalConfig): string {
  if (value <= config.good) return "Good";
  if (value <= config.needsImprovement) return "Needs Improvement";
  return "Poor";
}

function formatValue(value: number, unit: string): string {
  if (unit === "ms") {
    return value >= 1000
      ? `${(value / 1000).toFixed(2)}s`
      : `${Math.round(value)}ms`;
  }
  return value.toFixed(3);
}

export function WebVitalsCard({ delay = 0.2 }: { delay?: number }) {
  const { data, isLoading, error } = useMultiSeries("/api/graphs/web-vitals");

  const metrics = Object.entries(vitalsConfig).flatMap(([key, config]) => {
    const series = (data ?? []).find((s) =>
      s.label.toLowerCase().includes(key),
    );
    if (!series) return [];
    // Most recent day with a reading; days without samples come back as 0
    const latest = [...series.data].reverse().find((point) => point.value > 0);
    if (!latest) return [];
    return [{ key, ...config, value: latest.value }];
  });

  return (
    <InsightCard
      title="Web Vitals"
      description="Core Web Vitals, most recent daily reading"
      isLoading={isLoading}
      hasError={Boolean(error)}
      isEmpty={!metrics.length}
      skeleton="tiles"
      delay={delay}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="p-4 rounded-base border-2 border-border bg-secondary-background"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-heading">{metric.name}</span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-base border border-border text-main-foreground",
                  getScoreColor(metric.value, metric),
                )}
              >
                {getScoreLabel(metric.value, metric)}
              </span>
            </div>
            <div className="text-2xl font-heading mb-1">
              {formatValue(metric.value, metric.unit)}
            </div>
            <div className="text-xs text-foreground/60">
              {metric.description}
            </div>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}
