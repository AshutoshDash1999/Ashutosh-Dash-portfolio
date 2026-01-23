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
import type { TrafficSource } from "@/lib/api/types";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

interface TrafficSourcesChartProps {
    data: TrafficSource[] | null;
    isLoading: boolean;
}

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
    "$direct": "#6366F1",
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

// Fallback colors for unknown sources
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

    // Check for exact match or partial match
    for (const [key, color] of Object.entries(sourceColors)) {
        if (normalizedSource.includes(key) || key.includes(normalizedSource)) {
            return color;
        }
    }

    // Fallback to chart colors
    return fallbackColors[index % fallbackColors.length];
}

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
} satisfies ChartConfig;

function TrafficSourcesChartSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    );
}

function truncateSource(source: string, maxLength = 12): string {
    if (source.length <= maxLength) return source;
    return `${source.slice(0, maxLength)}...`;
}

export function TrafficSourcesChart({
    data,
    isLoading,
}: TrafficSourcesChartProps) {
    if (isLoading || !data) {
        return <TrafficSourcesChartSkeleton />;
    }

    const chartData = data.slice(0, 8).map((item, index) => ({
        source: truncateSource(item.source),
        fullSource: item.source,
        visitors: item.visitors,
        fill: getSourceColor(item.source, index),
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full"
        >
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your visitors come from</CardDescription>
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
                                dataKey="source"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={80}
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
                                            if (payload?.[0]?.payload?.fullSource) {
                                                return payload[0].payload.fullSource;
                                            }
                                            return "";
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="visitors" radius={4}>
                                {chartData.map((entry) => (
                                    <Cell key={entry.source} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}
