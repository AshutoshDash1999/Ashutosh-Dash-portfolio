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
import { Skeleton } from "@/components/ui/skeleton";
import { useDevices } from "@/lib/api/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

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

function BrowsersChartSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-52" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    );
}

function BrowsersChartError() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Browser Distribution</CardTitle>
                <CardDescription>Most popular browsers among visitors</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <IconAlertTriangle className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load browser data.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}

function BrowsersChartEmpty() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Browser Distribution</CardTitle>
                <CardDescription>Most popular browsers among visitors</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/70 text-center py-8">
                    No browser data available yet
                </p>
            </CardContent>
        </Card>
    );
}

export function BrowsersChart() {
    const { browsers, isDevicesLoading, devicesError } = useDevices();

    if (isDevicesLoading) {
        return <BrowsersChartSkeleton />;
    }

    if (devicesError) {
        return <BrowsersChartError />;
    }

    if (!browsers?.length) {
        return <BrowsersChartEmpty />;
    }

    const chartData = browsers.slice(0, 6).map((item, index) => ({
        browser: item.browser,
        count: item.count,
        percentage: item.percentage,
        fill: chartColors[index % chartColors.length],
    }));

    const chartConfig: ChartConfig = {
        count: {
            label: "Pageviews",
        },
        ...chartData.reduce(
            (config, item) => ({
                ...config,
                [item.browser]: {
                    label: item.browser,
                    color: item.fill,
                },
            }),
            {} as ChartConfig
        ),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-full"
        >
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Browser Distribution</CardTitle>
                    <CardDescription>Most popular browsers among visitors</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[280px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="browser"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={90}
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
                                            const item = payload?.[0]?.payload;
                                            if (item) {
                                                return `${item.browser} (${item.percentage}%)`;
                                            }
                                            return "";
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="count" radius={4}>
                                {chartData.map((entry) => (
                                    <Cell key={entry.browser} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}
