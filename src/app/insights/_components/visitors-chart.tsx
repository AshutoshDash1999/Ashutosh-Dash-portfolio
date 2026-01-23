"use client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageviewsOverTime, useVisitorsOverTime } from "@/lib/api/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

function formatDate(dateStr: string, range: DateRange): string {
    const date = new Date(dateStr);
    if (range === "7") {
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
                <Skeleton className="h-10 w-36" />
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
                <CardDescription>Daily traffic trends over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <IconAlertTriangle className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load visitors data.
                    </AlertDescription>
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
                <CardDescription>Daily traffic trends over the selected period</CardDescription>
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
    const [dateRange, setDateRange] = useState<DateRange>("30");
    const days = Number.parseInt(dateRange, 10);

    const {
        visitorsOverTime,
        isVisitorsOverTimeLoading,
        visitorsOverTimeError,
    } = useVisitorsOverTime(days);

    const {
        pageviewsByDay,
        isPageviewsOverTimeLoading,
        pageviewsOverTimeError,
    } = usePageviewsOverTime(days);

    const isLoading = isVisitorsOverTimeLoading || isPageviewsOverTimeLoading;
    const hasError = visitorsOverTimeError || pageviewsOverTimeError;

    const chartData = useMemo(() => {
        if (!visitorsOverTime && !pageviewsByDay) return [];

        const visitorsMap = new Map(
            visitorsOverTime?.map((v) => [v.date, v.visitors]) ?? []
        );
        const pageviewsMap = new Map(
            pageviewsByDay?.map((p) => [p.date, p.count]) ?? []
        );

        const allDates = [
            ...new Set([...visitorsMap.keys(), ...pageviewsMap.keys()]),
        ].sort();

        return allDates.map((date) => ({
            date,
            formattedDate: formatDate(date, dateRange),
            visitors: visitorsMap.get(date) ?? 0,
            pageviews: pageviewsMap.get(date) ?? 0,
        }));
    }, [visitorsOverTime, pageviewsByDay, dateRange]);

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
