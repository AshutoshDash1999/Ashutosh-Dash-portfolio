"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InsightCard } from "./insight-card";
import { useMultiSeries } from "./use-insights";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const MAX_SERIES = 6;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function UtmOverTimeChart({ delay = 0.2 }: { delay?: number }) {
  const { data, isLoading, error } = useMultiSeries(
    "/api/graphs/campaign-sources-over-time",
  );

  const { chartData, seriesKeys, chartConfig } = useMemo(() => {
    // Keep the top series by total volume, in fixed color order
    const series = (data ?? [])
      .map((s) => ({
        ...s,
        total: s.data.reduce((sum, point) => sum + point.value, 0),
      }))
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, MAX_SERIES);

    const allDates = [
      ...new Set(series.flatMap((s) => s.data.map((point) => point.date))),
    ].sort();

    const rows = allDates.map((date) => {
      const row: Record<string, string | number> = {
        date,
        formattedDate: formatDate(date),
      };
      for (const s of series) {
        row[s.label] = s.data.find((point) => point.date === date)?.value ?? 0;
      }
      return row;
    });

    const config: ChartConfig = Object.fromEntries(
      series.map((s, index) => [
        s.label,
        { label: s.label, color: chartColors[index % chartColors.length] },
      ]),
    );

    return {
      chartData: rows,
      seriesKeys: series.map((s) => s.label),
      chartConfig: config,
    };
  }, [data]);

  return (
    <InsightCard
      title="UTM Sources Over Time"
      description="Daily visits by UTM source"
      isLoading={isLoading}
      hasError={Boolean(error)}
      isEmpty={!chartData.length || !seriesKeys.length}
      delay={delay}
    >
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <LineChart
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
          {seriesKeys.map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={chartColors[index % chartColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </InsightCard>
  );
}
