"use client";

import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InsightCard } from "./insight-card";
import { toBreakdownItems, useBreakdown } from "./use-insights";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

type BreakdownDonutChartProps = {
  endpoint: string;
  title: string;
  description: string;
  centerLabel: string;
  maxItems?: number;
  labelFormatter?: (label: string) => string;
  delay?: number;
};

export function BreakdownDonutChart({
  endpoint,
  title,
  description,
  centerLabel,
  maxItems = 6,
  labelFormatter,
  delay = 0.2,
}: BreakdownDonutChartProps) {
  const { data, isLoading, error } = useBreakdown(endpoint);

  const { chartData, total } = useMemo(() => {
    const items = toBreakdownItems(data)
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const top = items.slice(0, maxItems);
    const othersCount = items
      .slice(maxItems)
      .reduce((sum, item) => sum + item.value, 0);

    const entries = [
      ...top.map((item, index) => ({
        name: labelFormatter ? labelFormatter(item.label) : item.label,
        value: item.value,
        fill: chartColors[index % chartColors.length],
      })),
      ...(othersCount > 0
        ? [{ name: "Others", value: othersCount, fill: chartColors[7] }]
        : []),
    ];

    return {
      chartData: entries,
      total: items.reduce((sum, item) => sum + item.value, 0),
    };
  }, [data, maxItems, labelFormatter]);

  const chartConfig: ChartConfig = useMemo(
    () =>
      Object.fromEntries(
        chartData.map((item) => [
          item.name,
          { label: item.name, color: item.fill },
        ]),
      ),
    [chartData],
  );

  return (
    <InsightCard
      title={title}
      description={description}
      isLoading={isLoading}
      hasError={Boolean(error)}
      isEmpty={!chartData.length}
      skeleton="donut"
      delay={delay}
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-62.5"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            strokeWidth={3}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-heading"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-foreground/70 text-sm"
                      >
                        {centerLabel}
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="size-3 rounded-sm border border-border"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-sm truncate max-w-25">{item.name}</span>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}
