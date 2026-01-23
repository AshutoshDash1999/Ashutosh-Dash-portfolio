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
import { useCountries } from "@/lib/api/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { Cell, Label, Pie, PieChart } from "recharts";

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

function CountriesChartSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-44" />
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <Skeleton className="size-[200px] rounded-full" />
            </CardContent>
        </Card>
    );
}

function CountriesChartError() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Visitors by geographic location</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <IconAlertTriangle className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load countries data.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}

function CountriesChartEmpty() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Visitors by geographic location</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/70 text-center py-8">
                    No countries data available yet
                </p>
            </CardContent>
        </Card>
    );
}

export function CountriesChart() {
    const { visitorsByCountry, isCountriesLoading, countriesError } = useCountries();

    if (isCountriesLoading) {
        return <CountriesChartSkeleton />;
    }

    if (countriesError) {
        return <CountriesChartError />;
    }

    if (!visitorsByCountry?.length) {
        return <CountriesChartEmpty />;
    }

    // Take top 6 countries and group the rest as "Others"
    const topCountries = visitorsByCountry.slice(0, 6);
    const othersCount = visitorsByCountry.slice(6).reduce((sum, item) => sum + item.visitors, 0);

    const chartData = [
        ...topCountries.map((item, index) => ({
            name: item.country,
            value: item.visitors,
            fill: chartColors[index % chartColors.length],
        })),
        ...(othersCount > 0
            ? [
                {
                    name: "Others",
                    value: othersCount,
                    fill: chartColors[7],
                },
            ]
            : []),
    ];

    const totalVisitors = visitorsByCountry.reduce((sum, item) => sum + item.visitors, 0);

    const chartConfig: ChartConfig = chartData.reduce(
        (config, item, index) => ({
            ...config,
            [item.name]: {
                label: item.name,
                color: chartColors[index % chartColors.length],
            },
        }),
        {} as ChartConfig
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full"
        >
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Top Countries</CardTitle>
                    <CardDescription>Visitors by geographic location</CardDescription>
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
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 20}
                                                        className="fill-foreground/70 text-sm"
                                                    >
                                                        Visitors
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
                        {chartData.slice(0, 6).map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div
                                    className="size-3 rounded-sm border border-border"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <span className="text-sm truncate max-w-[100px]">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
