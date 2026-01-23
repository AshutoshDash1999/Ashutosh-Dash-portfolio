"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    IconClock,
    IconEye,
    IconUserCheck,
    IconUserPlus,
    IconUsers,
    IconUserScan,
} from "@tabler/icons-react";
import { motion } from "motion/react";

export interface StatsData {
    totalPageviews: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    totalSessions: number;
    newVisitors: number;
    returningVisitors: number;
}

interface StatCardsProps {
    data: StatsData | null;
    isLoading: boolean;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
}

const statCards = [
    {
        key: "totalPageviews",
        label: "Total Pageviews",
        icon: IconEye,
        color: "bg-chart-1",
        format: (value: number) => formatNumber(value),
        tooltip:
            "Total page views in the last 30 days. Calculated by counting all $pageview events tracked by PostHog.",
    },
    {
        key: "uniqueVisitors",
        label: "Unique Visitors",
        icon: IconUsers,
        color: "bg-chart-2",
        format: (value: number) => formatNumber(value),
        tooltip:
            "Distinct users in the last 30 days. Calculated using COUNT(DISTINCT distinct_id) from pageview events.",
    },
    {
        key: "totalSessions",
        label: "Total Sessions",
        icon: IconUserScan,
        color: "bg-chart-5",
        format: (value: number) => formatNumber(value),
        tooltip:
            "Total browsing sessions. Calculated using COUNT(DISTINCT $session_id) from pageview events.",
    },
    {
        key: "avgSessionDuration",
        label: "Avg. Session",
        icon: IconClock,
        color: "bg-chart-3",
        format: (value: number) => formatDuration(value),
        tooltip:
            "Average time per session. Calculated as AVG(last_timestamp - first_timestamp) for each session.",
    },
    {
        key: "newVisitors",
        label: "New Visitors",
        icon: IconUserPlus,
        color: "bg-chart-4",
        format: (value: number) => formatNumber(value),
        tooltip:
            "First-time visitors. Calculated by counting users whose first visit date matches their earliest event in the period.",
    },
    {
        key: "returningVisitors",
        label: "Returning",
        icon: IconUserCheck,
        color: "bg-chart-6",
        format: (value: number) => formatNumber(value),
        tooltip:
            "Repeat visitors. Calculated by counting users whose first visit date is before their earliest event in the period.",
    },
] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

function StatCardSkeleton() {
    return (
        <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="size-12 shrink-0" />
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-7 w-16" />
                </div>
            </CardContent>
        </Card>
    );
}

export function StatCards({ data, isLoading }: StatCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <TooltipProvider delayDuration={300}>
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    const value = data[stat.key as keyof StatsData];
                    const formattedValue =
                        typeof value === "number" ? stat.format(value) : String(value);

                    return (
                        <motion.div key={stat.key} variants={cardVariants}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Card className="p-0 h-full bg-secondary-background cursor-help">
                                        <CardContent className="flex items-center gap-3 p-4">
                                            <div
                                                className={cn(
                                                    "size-11 shrink-0 rounded-base border-2 border-border flex items-center justify-center",
                                                    stat.color
                                                )}
                                            >
                                                <Icon className="size-5 text-main-foreground" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="text-xs text-foreground/70 truncate">
                                                    {stat.label}
                                                </span>
                                                <span className="text-lg font-heading truncate">
                                                    {formattedValue}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-[250px] text-sm">
                                    {stat.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        </motion.div>
                    );
                })}
            </motion.div>
        </TooltipProvider>
    );
}
