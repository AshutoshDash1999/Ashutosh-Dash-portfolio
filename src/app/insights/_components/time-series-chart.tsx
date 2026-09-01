"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InsightCard } from "./insight-card";
import { useTimeSeries } from "./use-insights";

type TimeSeriesChartProps = {
  endpoint: string;
  title: string;
  description: string;
  label: string;
  color?: string;
  valueFormatter?: (value: number) => string;
  delay?: number;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TimeSeriesChart({
  endpoint,
  title,
  description,
  label,
  color = "var(--chart-1)",
  valueFormatter,
  delay = 0.2,
}: TimeSeriesChartProps) {
  const { data, isLoading, error } = useTimeSeries(endpoint);

  const chartConfig = useMemo(
    () => ({ value: { label, color } }) satisfies ChartConfig,
    [label, color],
  );

  const chartData = useMemo(
    () =>
      (data ?? []).map((point) => ({
        ...point,
        formattedDate: formatDate(point.date),
      })),
    [data],
  );

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
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={
                  valueFormatter
                    ? (value) => `${label}: ${valueFormatter(Number(value))}`
                    : undefined
                }
              />
            }
          />
          <Area
            dataKey="value"
            type="natural"
            fill="var(--color-value)"
            stroke="var(--color-value)"
            activeDot={{
              fill: "var(--chart-active-dot)",
            }}
          />
        </AreaChart>
      </ChartContainer>
    </InsightCard>
  );
}
