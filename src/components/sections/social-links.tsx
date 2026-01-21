"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import data from "@/lib/data.json";
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandX,
    IconMail
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";


const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: IconBrandGithub,
    linkedin: IconBrandLinkedin,
    twitter: IconBrandX,
    mail: IconMail,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as const,
        },
    },
};

const cardContainerVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
};

export default function SocialLinks() {
    const { socialLinks } = data;
    const { trackEvent } = useTrackEvent();

    const handleSocialLinkClick = (platform: string, url: string) => {
        trackEvent("social_link_click", { platform: platform.toLowerCase(), url });
    };

    return (
        <section id="contact" className="bg-chart-3 border-y-4 border-border px-6 md:px-12 py-16 md:py-24 ">

            <motion.div
                className="max-w-4xl mx-auto"
                initial={cardContainerVariants.initial}
                whileInView={cardContainerVariants.whileInView}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Card className="hover:shadow-lg transition-shadow duration-300 bg-secondary-background">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl md:text-3xl leading-tight">
                            {data.freelance.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <p className="text-base md:text-lg text-foreground leading-relaxed">{data.freelance.description}</p>
                        <motion.div
                            className="flex flex-col md:flex-row justify-center gap-3 md:gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {socialLinks.map((link) => {
                                const Icon = iconMap[link.icon.toLowerCase()] || IconMail;
                                return (
                                    <motion.div key={link.platform} variants={itemVariants}>
                                        <Button variant="default" size="xl" asChild className="w-full md:w-44 h-14 md:h-12">
                                            <Link
                                                href={link.url}
                                                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                                                rel={
                                                    link.url.startsWith("mailto:")
                                                        ? undefined
                                                        : "noopener noreferrer"
                                                }
                                                aria-label={`Contact via ${link.platform}${link.url.startsWith("mailto:") ? "" : " (opens in new tab)"}`}
                                                onClick={() => handleSocialLinkClick(link.platform, link.url)}
                                            >
                                                <Icon className="size-6 md:size-5" aria-hidden="true" />
                                                <span className="text-base md:text-sm">{link.platform}</span>
                                            </Link>
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>


        </section>
    );
}
