import AppProvider from "@/components/providers/app-provider";
import { WebVitals } from "@/components/web-vitals";
import data from "@/lib/data.json";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

const { personal, socialLinks } = data;
const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ashutoshdash.in";
const coverImageUrl = `${siteUrl}/cover.webp`;
const keywords = [
    "Ashutosh Dash",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Web Developer",
    "UI Developer",
    "React Specialist",
    "Next.js Specialist",
    "Frontend Engineer",
    ...data.techSkills.map((skill) => skill.name),
];

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${personal.name} - ${personal.title}`,
        template: `%s | ${personal.name}`,
    },
    description: personal.bio,
    keywords: keywords.join(", "),
    authors: [{ name: personal.name }],
    creator: personal.name,
    publisher: personal.name,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        title: `${personal.name} - ${personal.title}`,
        description: personal.bio,
        siteName: personal.name,
        images: [
            {
                url: coverImageUrl,
                width: 1200,
                height: 630,
                alt: `${personal.name} - ${personal.title}`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${personal.name} - ${personal.title}`,
        description: personal.bio,
        images: [coverImageUrl],
        creator: socialLinks.find((link) => link.platform === "Twitter")?.url,
    },
    alternates: {
        canonical: siteUrl,
    },
    category: "Portfolio",
    icons: {
        icon: "/favicon.ico",
        apple: [
            { url: "/logo.png", sizes: "180x180", type: "image/png" },
        ],
    },
    other: {
        "contact:email": "dashashutosh1999@gmail.com",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: personal.name,
        jobTitle: personal.title,
        description: personal.bio,
        url: siteUrl,
        image: coverImageUrl,
        sameAs: socialLinks
            .filter((link) => link.platform !== "Email")
            .map((link) => link.url),
        email: socialLinks
            .find((link) => link.platform === "Email")
            ?.url.replace("mailto:", ""),
        knowsAbout: data.techSkills.map((skill) => skill.name),
        alumniOf: data.experience.map((exp) => exp.company),
    };

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${dmSans.variable} antialiased`}>
                <WebVitals />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
}
