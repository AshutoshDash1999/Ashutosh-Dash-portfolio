"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InsightCard } from "./insight-card";
import { useTimeSeries } from "./use-insights";

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  pageviews: {
    label: "Pageviews",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TrafficTrendChart({ delay = 0.2 }: { delay?: number }) {
  const visitors = useTimeSeries("/api/graphs/audience-over-time");
  const pageviews = useTimeSeries("/api/graphs/views-over-time");

  const chartData = useMemo(() => {
    const visitorsMap = new Map(
      visitors.data?.map((p) => [p.date, p.value]) ?? [],
    );
    const pageviewsMap = new Map(
      pageviews.data?.map((p) => [p.date, p.value]) ?? [],
    );
    const allDates = [
      ...new Set([...visitorsMap.keys(), ...pageviewsMap.keys()]),
    ].sort();

    return allDates.map((date) => ({
      date,
      formattedDate: formatDate(date),
      visitors: visitorsMap.get(date) ?? 0,
      pageviews: pageviewsMap.get(date) ?? 0,
    }));
  }, [visitors.data, pageviews.data]);

  return (
    <InsightCard
      title="Visitors & Pageviews"
      description="Daily traffic trend"
      isLoading={visitors.isLoading || pageviews.isLoading}
      hasError={Boolean(visitors.error || pageviews.error)}
      isEmpty={!chartData.length}
      delay={delay}
    >
      <ChartContainer config={chartConfig} className="h-75 w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="pageviews"
            type="natural"
            fill="var(--color-pageviews)"
            stroke="var(--color-pageviews)"
            activeDot={{
              fill: "var(--chart-active-dot)",
            }}
            stackId="a"
          />
          <Area
            dataKey="visitors"
            type="natural"
            fill="var(--color-visitors)"
            stroke="var(--color-visitors)"
            activeDot={{
              fill: "var(--chart-active-dot)",
            }}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </InsightCard>
  );
}
