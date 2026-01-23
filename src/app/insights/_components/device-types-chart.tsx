"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeviceTypeStats } from "@/lib/api/types";
import { motion } from "motion/react";
import { Cell, Label, Pie, PieChart } from "recharts";

interface DeviceTypesChartProps {
  data: DeviceTypeStats[] | null;
  isLoading: boolean;
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function DeviceTypesChartSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Skeleton className="size-[200px] rounded-full" />
      </CardContent>
    </Card>
  );
}

export function DeviceTypesChart({ data, isLoading }: DeviceTypesChartProps) {
  if (isLoading || !data) {
    return <DeviceTypesChartSkeleton />;
  }

  const chartData = data.map((item, index) => ({
    name: item.deviceType,
    value: item.count,
    percentage: item.percentage,
    fill: chartColors[index % chartColors.length],
  }));

  const totalDevices = data.reduce((sum, item) => sum + item.count, 0);

  const chartConfig: ChartConfig = data.reduce(
    (config, item, index) => ({
      ...config,
      [item.deviceType]: {
        label: item.deviceType,
        color: chartColors[index % chartColors.length],
      },
    }),
    {} as ChartConfig
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Device Types</CardTitle>
          <CardDescription>Visitors by device category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[250px]"
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
                            {totalDevices.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-foreground/70 text-sm"
                          >
                            Total
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
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="size-3 rounded-sm border border-border"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">
                  {item.name} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
