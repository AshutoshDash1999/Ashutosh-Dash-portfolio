"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InsightCard } from "./insight-card";
import { toBreakdownItems, useBreakdown } from "./use-insights";

// Brand colors for known traffic sources
const sourceColors: Record<string, string> = {
  // Social Media
  whatsapp: "#25D366",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  x: "#000000",
  facebook: "#1877F2",
  instagram: "#E4405F",
  youtube: "#FF0000",
  tiktok: "#000000",
  reddit: "#FF4500",
  pinterest: "#BD081C",
  threads: "#000000",
  mastodon: "#6364FF",

  // Developer platforms
  github: "#181717",
  gitlab: "#FC6D26",
  bitbucket: "#0052CC",
  stackoverflow: "#F58025",
  hackernews: "#FF6600",
  devto: "#0A0A0A",
  medium: "#000000",
  hashnode: "#2962FF",

  // Search & Direct
  google: "#4285F4",
  bing: "#008373",
  duckduckgo: "#DE5833",
  $direct: "#6366F1",
  direct: "#6366F1",

  // Professional
  resume: "#10B981",
  portfolio: "#8B5CF6",

  // Messaging
  telegram: "#26A5E4",
  discord: "#5865F2",
  slack: "#4A154B",

  // Other
  producthunt: "#DA552F",
  dribbble: "#EA4C89",
  behance: "#1769FF",
};

const fallbackColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function getSourceColor(source: string, index: number): string {
  const normalizedSource = source.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const [key, color] of Object.entries(sourceColors)) {
    if (normalizedSource.includes(key) || key.includes(normalizedSource)) {
      return color;
    }
  }

  return fallbackColors[index % fallbackColors.length];
}

function truncateLabel(label: string, maxLength = 14): string {
  if (label.length <= maxLength) return label;
  return `${label.slice(0, maxLength)}...`;
}

const chartConfig = {
  value: {
    label: "Count",
  },
} satisfies ChartConfig;

type BreakdownBarChartProps = {
  endpoint: string;
  title: string;
  description: string;
  maxItems?: number;
  /** Use the traffic-source brand color map instead of chart tokens */
  brandColors?: boolean;
  labelFormatter?: (label: string) => string;
  delay?: number;
};

export function BreakdownBarChart({
  endpoint,
  title,
  description,
  maxItems = 8,
  brandColors = false,
  labelFormatter,
  delay = 0.2,
}: BreakdownBarChartProps) {
  const { data, isLoading, error } = useBreakdown(endpoint);

  const chartData = useMemo(() => {
    const items = toBreakdownItems(data)
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, maxItems);

    return items.map((item, index) => {
      const displayLabel = labelFormatter
        ? labelFormatter(item.label)
        : item.label;
      return {
        label: truncateLabel(displayLabel),
        fullLabel: displayLabel,
        value: item.value,
        fill: brandColors
          ? getSourceColor(item.label, index)
          : fallbackColors[index % fallbackColors.length],
      };
    });
  }, [data, maxItems, brandColors, labelFormatter]);

  return (
    <InsightCard
      title={title}
      description={description}
      isLoading={isLoading}
      hasError={Boolean(error)}
      isEmpty={!chartData.length}
      delay={delay}
    >
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={100}
            fontSize={12}
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const fullLabel = payload?.[0]?.payload?.fullLabel;
                  return typeof fullLabel === "string" ? fullLabel : "";
                }}
              />
            }
          />
          <Bar dataKey="value" radius={4}>
            {chartData.map((entry) => (
              <Cell key={entry.fullLabel} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </InsightCard>
  );
}
