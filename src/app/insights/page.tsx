"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import { motion } from "motion/react";
import {
    BrowsersChart,
    CountriesChart,
    DeviceTypesChart,
    StatCards,
    TrafficSourcesChart,
    VisitorsChart,
    WebVitalsChart,
} from "./_components";

export default function InsightsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="px-6 md:px-12 py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-heading mb-2">
                        Site Insights
                    </h1>
                    <p className="text-foreground/70">
                        Analytics and visitor statistics for the last 30 days
                    </p>
                </motion.div>

                {/* Stat Cards */}
                <div className="mb-8">
                    <StatCards />
                </div>

                {/* Visitors Chart - Full Width */}
                <div className="mb-8">
                    <VisitorsChart />
                </div>

                {/* Row 1: Traffic Sources | Countries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <TrafficSourcesChart />
                    <CountriesChart />
                </div>

                {/* Row 2: Device Types | Browsers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <DeviceTypesChart />
                    <BrowsersChart />
                </div>

                {/* Web Vitals - Full Width */}
                <div className="mb-8">
                    <WebVitalsChart />
                </div>
            </section>

            <Footer />
        </main>
    );
}
