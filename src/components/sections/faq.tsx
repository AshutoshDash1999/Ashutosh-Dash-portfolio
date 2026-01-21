"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import data from "@/lib/data.json";
import {
    IconAsterisk,
    IconHeadphones,
    IconSettings,
    IconStar,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    asterisk: IconAsterisk,
    headphones: IconHeadphones,
    settings: IconSettings,
    star: IconStar,
};

export default function FAQ() {
    const { faq } = data;

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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    return (
        <section
            id="faqs"
            className="px-6 md:px-12 py-16 md:py-24 bg-chart-4 border-y-4 border-border"
        >
            <motion.h2
                className="text-3xl md:text-4xl font-heading mb-8 md:mb-12"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
                Frequently asked questions
            </motion.h2>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {faq.infoPanels.map((panel, index) => {
                    const Icon = iconMap[panel.icon] || IconAsterisk;
                    const isOdd = index === 1 || index === 2;
                    return (
                        <motion.div key={index} variants={itemVariants}>
                            <Card
                                className={`h-full hover:shadow-lg transition-shadow duration-300 ${isOdd
                                    ? "bg-chart-3 text-main-foreground"
                                    : "bg-secondary-background"
                                    }`}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3 md:gap-3">
                                        <Icon className="size-12 md:size-16 shrink-0" />
                                        <CardTitle className="text-lg md:text-xl leading-tight">{panel.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p
                                        className={`text-base md:text-base leading-relaxed ${
                                            isOdd ? "text-main-foreground" : "text-foreground"
                                        }`}
                                    >
                                        {panel.content}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
