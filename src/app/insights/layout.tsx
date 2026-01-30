import data from "@/lib/data.json";
import type { Metadata } from "next";

const { personal } = data;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ashutoshdash.in";
const coverImageUrl = `${siteUrl}/insights-cover.webp`;

export const metadata: Metadata = {
    title: `Site Insights | ${personal.name}`,
    description: `Analytics dashboard for ${personal.name}'s portfolio. View visitor statistics, traffic sources, device distribution, geographic data, and web vitals performance metrics.`,
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: `Site Insights | ${personal.name}`,
        description: `Analytics and visitor statistics for ${personal.name}'s portfolio website.`,
        url: `${siteUrl}/insights`,
        type: "website",
        images: [
            {
                url: coverImageUrl,
                width: 1200,
                height: 630,
                alt: `Site Insights | ${personal.name}`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: [coverImageUrl],
    },
};

export default function InsightsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
