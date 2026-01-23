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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageviewsByDay, VisitorsByDay } from "@/lib/api/types";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type DateRange = "7" | "30" | "90";

const dateRangeOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
] as const;

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

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  visitors: number;
  pageviews: number;
}

function formatDate(dateStr: string, range: DateRange): string {
  const date = new Date(dateStr);
  if (range === "7") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  if (range === "90") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function VisitorsChartSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

export function VisitorsChart() {
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (days: DateRange) => {
    setIsLoading(true);
    try {
      const [visitorsRes, pageviewsRes] = await Promise.all([
        fetch(`/api/stats/visitors/over-time?days=${days}`),
        fetch(`/api/stats/pages/views?days=${days}`),
      ]);

      const visitorsData = await visitorsRes.json();
      const pageviewsData = await pageviewsRes.json();

      if (visitorsData.success && pageviewsData.success) {
        const visitorsMap = new Map<string, number>(
          visitorsData.data.visitorsOverTime.map((v: VisitorsByDay) => [
            v.date,
            v.visitors,
          ])
        );
        const pageviewsMap = new Map<string, number>(
          pageviewsData.data.pageviewsByDay.map((p: PageviewsByDay) => [
            p.date,
            p.count,
          ])
        );

        // Get all unique dates and sort them
        const allDates = [
          ...new Set([...visitorsMap.keys(), ...pageviewsMap.keys()]),
        ].sort();

        const combined: ChartDataPoint[] = allDates.map((date) => ({
          date,
          formattedDate: formatDate(date, days),
          visitors: visitorsMap.get(date) ?? 0,
          pageviews: pageviewsMap.get(date) ?? 0,
        }));

        setChartData(combined);
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange, fetchData]);

  if (isLoading && chartData.length === 0) {
    return <VisitorsChartSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Visitors & Pageviews</CardTitle>
            <CardDescription>
              Daily traffic trends over the selected period
            </CardDescription>
          </div>
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as DateRange)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={40}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="pageviews"
                type="monotone"
                fill="url(#fillPageviews)"
                stroke="var(--chart-2)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="visitors"
                type="monotone"
                fill="url(#fillVisitors)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
