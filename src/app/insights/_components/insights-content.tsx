"use client";

import { Button } from "@/components/ui/button";
import { invalidateInsightsCache } from "@/app/insights/actions";
import { IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { mutate } from "swr";
import {
    BrowsersChart,
    CountriesChart,
    DeviceTypesChart,
    StatCards,
    TrafficSourcesChart,
    VisitorsChart,
    WebVitalsChart,
} from "./index";

export function InsightsContent() {
    const [isInvalidating, setIsInvalidating] = useState(false);

    async function handleInvalidateCache() {
        if (isInvalidating) return;
        setIsInvalidating(true);
        try {
            await invalidateInsightsCache();
            await mutate(
                (key) =>
                    typeof key === "string" && key.startsWith("/api/stats/")
            );
        } finally {
            setIsInvalidating(false);
        }
    }

    return (
        <section className="px-6 md:px-12 py-12 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading mb-2">
                        Site Insights
                    </h1>
                    <p className="text-foreground/70">
                        Analytics and visitor statistics for the last 30 days
                    </p>
                </div>
                <Button
                    variant="neutral"
                    size="sm"
                    onClick={handleInvalidateCache}
                    disabled={isInvalidating}
                    className="w-fit shrink-0"
                >
                    <IconRefresh
                        className={isInvalidating ? "animate-spin" : undefined}
                        aria-hidden
                    />
                    {isInvalidating ? "Invalidating…" : "Invalidate cache"}
                </Button>
            </motion.div>

            <div className="mb-8">
                <StatCards />
            </div>

            <div className="mb-8">
                <VisitorsChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TrafficSourcesChart />
                <CountriesChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DeviceTypesChart />
                <BrowsersChart />
            </div>

            <div className="mb-8">
                <WebVitalsChart />
            </div>
        </section>
    );
}
