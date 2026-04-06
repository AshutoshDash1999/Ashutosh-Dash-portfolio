"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { usePageviewsOverTime, useVisitorsOverTime } from "@/lib/api/hooks";
import type { InsightsPeriod } from "@/lib/api/stats-days";
import { useInsightsPeriod } from "./insights-period-context";

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

function formatDate(dateStr: string, period: InsightsPeriod): string {
  const date = new Date(dateStr);
  if (period === "all") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  }
  if (period === 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
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
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

function VisitorsChartError() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors & Pageviews</CardTitle>
        <CardDescription>
          Daily traffic trends for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <IconAlertTriangle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load visitors data.</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function VisitorsChartEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors & Pageviews</CardTitle>
        <CardDescription>
          Daily traffic trends for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/70 text-center py-8">
          No visitors data available yet
        </p>
      </CardContent>
    </Card>
  );
}

export function VisitorsChart() {
  const { period } = useInsightsPeriod();

  const { visitorsOverTime, isVisitorsOverTimeLoading, visitorsOverTimeError } =
    useVisitorsOverTime(period);

  const { pageviewsByDay, isPageviewsOverTimeLoading, pageviewsOverTimeError } =
    usePageviewsOverTime(period);

  const isLoading = isVisitorsOverTimeLoading || isPageviewsOverTimeLoading;
  const hasError = visitorsOverTimeError || pageviewsOverTimeError;

  const chartData = useMemo(() => {
    if (!visitorsOverTime && !pageviewsByDay) return [];

    const visitorsMap = new Map(
      visitorsOverTime?.map((v) => [v.date, v.visitors]) ?? [],
    );
    const pageviewsMap = new Map(
      pageviewsByDay?.map((p) => [p.date, p.count]) ?? [],
    );

    const allDates = [
      ...new Set([...visitorsMap.keys(), ...pageviewsMap.keys()]),
    ].sort();

    return allDates.map((date) => ({
      date,
      formattedDate: formatDate(date, period),
      visitors: visitorsMap.get(date) ?? 0,
      pageviews: pageviewsMap.get(date) ?? 0,
    }));
  }, [visitorsOverTime, pageviewsByDay, period]);

  if (isLoading) {
    return <VisitorsChartSkeleton />;
  }

  if (hasError) {
    return <VisitorsChartError />;
  }

  if (!chartData.length) {
    return <VisitorsChartEmpty />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Visitors & Pageviews</CardTitle>
          <CardDescription>
            Daily traffic trends for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
