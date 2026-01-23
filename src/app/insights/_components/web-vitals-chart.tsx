"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVitals } from "@/lib/api/hooks";
import type { WebVitalsMetrics } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { IconAlertTriangle } from "@tabler/icons-react";
import { motion } from "motion/react";

// Thresholds based on Google's Core Web Vitals
const vitalsConfig = {
    lcp: {
        name: "LCP",
        fullName: "Largest Contentful Paint",
        unit: "ms",
        good: 2500,
        needsImprovement: 4000,
        description: "Loading performance",
    },
    fcp: {
        name: "FCP",
        fullName: "First Contentful Paint",
        unit: "ms",
        good: 1800,
        needsImprovement: 3000,
        description: "First visual response",
    },
    cls: {
        name: "CLS",
        fullName: "Cumulative Layout Shift",
        unit: "",
        good: 0.1,
        needsImprovement: 0.25,
        description: "Visual stability",
    },
    inp: {
        name: "INP",
        fullName: "Interaction to Next Paint",
        unit: "ms",
        good: 200,
        needsImprovement: 500,
        description: "Interactivity",
    },
} as const;

function getScoreColor(value: number, config: (typeof vitalsConfig)[keyof typeof vitalsConfig]): string {
    if (value <= config.good) return "bg-chart-2"; // Green
    if (value <= config.needsImprovement) return "bg-chart-3"; // Yellow
    return "bg-chart-4"; // Red
}

function getScoreLabel(value: number, config: (typeof vitalsConfig)[keyof typeof vitalsConfig]): string {
    if (value <= config.good) return "Good";
    if (value <= config.needsImprovement) return "Needs Improvement";
    return "Poor";
}

function formatValue(value: number, unit: string): string {
    if (unit === "ms") {
        return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
    }
    return value.toFixed(3);
}

function WebVitalsChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function WebVitalsChartError() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Web Vitals</CardTitle>
                <CardDescription>Core Web Vitals performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <IconAlertTriangle className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load web vitals data.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}

function WebVitalsChartEmpty() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Web Vitals</CardTitle>
                <CardDescription>Core Web Vitals performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/70 text-center py-8">
                    No web vitals data available yet
                </p>
            </CardContent>
        </Card>
    );
}

export function WebVitalsChart() {
    const { vitals, isVitalsLoading, vitalsError } = useVitals();

    if (isVitalsLoading) {
        return <WebVitalsChartSkeleton />;
    }

    if (vitalsError) {
        return <WebVitalsChartError />;
    }

    if (!vitals) {
        return <WebVitalsChartEmpty />;
    }

    const metrics = Object.entries(vitalsConfig).map(([key, config]) => {
        const metricData = vitals[key as keyof WebVitalsMetrics];
        return {
            key,
            ...config,
            value: metricData?.p75 ?? 0,
            count: metricData?.count ?? 0,
        };
    });

    // Filter out metrics with no data
    const activeMetrics = metrics.filter((m) => m.count > 0);

    if (activeMetrics.length === 0) {
        return <WebVitalsChartEmpty />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Web Vitals</CardTitle>
                    <CardDescription>Core Web Vitals performance (p75 values)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {activeMetrics.map((metric) => (
                            <div
                                key={metric.key}
                                className="p-4 rounded-base border-2 border-border bg-secondary-background"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-heading">{metric.name}</span>
                                    <span
                                        className={cn(
                                            "text-xs px-2 py-0.5 rounded-base border border-border text-main-foreground",
                                            getScoreColor(metric.value, metric)
                                        )}
                                    >
                                        {getScoreLabel(metric.value, metric)}
                                    </span>
                                </div>
                                <div className="text-2xl font-heading mb-1">
                                    {formatValue(metric.value, metric.unit)}
                                </div>
                                <div className="text-xs text-foreground/60">{metric.description}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
