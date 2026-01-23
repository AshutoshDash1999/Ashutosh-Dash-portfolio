"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import type {
    BrowserStats,
    DeviceTypeStats,
    EngagementStats,
    TrafficSource,
    VisitorsByCountry,
    WebVitalsMetrics,
} from "@/lib/api/types";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
    BrowsersChart,
    CountriesChart,
    DeviceTypesChart,
    StatCards,
    type StatsData,
    TrafficSourcesChart,
    VisitorsChart,
    WebVitalsChart,
} from "./_components";

interface DeviceDistribution {
    deviceTypes: DeviceTypeStats[];
    browsers: BrowserStats[];
}

export default function InsightsPage() {
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [trafficSources, setTrafficSources] = useState<TrafficSource[] | null>(
        null
    );
    const [countries, setCountries] = useState<VisitorsByCountry[] | null>(null);
    const [deviceDistribution, setDeviceDistribution] =
        useState<DeviceDistribution | null>(null);
    const [webVitals, setWebVitals] = useState<WebVitalsMetrics | null>(null);
    const [engagement, setEngagement] = useState<EngagementStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                pageviewsRes,
                visitorsRes,
                sessionRes,
                countriesRes,
                devicesRes,
                trafficRes,
                vitalsRes,
                engagementRes,
            ] = await Promise.all([
                fetch("/api/stats/pageviews"),
                fetch("/api/stats/visitors"),
                fetch("/api/stats/session"),
                fetch("/api/stats/visitors/countries"),
                fetch("/api/stats/devices"),
                fetch("/api/stats/traffic"),
                fetch("/api/stats/vitals"),
                fetch("/api/stats/engagement"),
            ]);

            const [
                pageviewsData,
                visitorsData,
                sessionData,
                countriesData,
                devicesData,
                trafficData,
                vitalsData,
                engagementData,
            ] = await Promise.all([
                pageviewsRes.json(),
                visitorsRes.json(),
                sessionRes.json(),
                countriesRes.json(),
                devicesRes.json(),
                trafficRes.json(),
                vitalsRes.json(),
                engagementRes.json(),
            ]);

            // Build stats data for stat cards
            const stats: StatsData = {
                totalPageviews: pageviewsData.success
                    ? pageviewsData.data.totalPageviews
                    : 0,
                uniqueVisitors: visitorsData.success
                    ? visitorsData.data.uniqueVisitors
                    : 0,
                avgSessionDuration: sessionData.success
                    ? sessionData.data.avgSessionDuration
                    : 0,
                totalSessions: engagementData.success
                    ? engagementData.data.totalSessions
                    : 0,
                newVisitors: engagementData.success
                    ? engagementData.data.newVisitors
                    : 0,
                returningVisitors: engagementData.success
                    ? engagementData.data.returningVisitors
                    : 0,
            };

            setStatsData(stats);

            // Set countries data
            if (countriesData.success) {
                setCountries(countriesData.data.visitorsByCountry);
            }

            // Set device distribution
            if (devicesData.success) {
                setDeviceDistribution({
                    deviceTypes: devicesData.data.deviceTypes,
                    browsers: devicesData.data.browsers,
                });
            }

            // Set traffic sources
            if (trafficData.success) {
                setTrafficSources(trafficData.data.trafficSources);
            }

            // Set web vitals
            if (vitalsData.success) {
                setWebVitals(vitalsData.data);
            }

            // Set engagement
            if (engagementData.success) {
                setEngagement(engagementData.data);
            }
        } catch (error) {
            console.error("Failed to fetch insights data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

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
                    <StatCards data={statsData} isLoading={isLoading} />
                </div>

                {/* Visitors Chart - Full Width */}
                <div className="mb-8">
                    <VisitorsChart />
                </div>

                {/* Row 1: Traffic Sources | Countries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <TrafficSourcesChart data={trafficSources} isLoading={isLoading} />
                    <CountriesChart data={countries} isLoading={isLoading} />
                </div>

                {/* Row 2: Device Types | Browsers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <DeviceTypesChart
                        data={deviceDistribution?.deviceTypes ?? null}
                        isLoading={isLoading}
                    />
                    <BrowsersChart
                        data={deviceDistribution?.browsers ?? null}
                        isLoading={isLoading}
                    />
                </div>

                {/* Web Vitals - Full Width */}
                <div className="mb-8">
                    <WebVitalsChart data={webVitals} isLoading={isLoading} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
