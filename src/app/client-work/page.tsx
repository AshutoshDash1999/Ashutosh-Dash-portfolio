"use client";

import PageLayout from "@/components/layout/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import data from "@/lib/data.json";
import { IconExternalLink } from "@tabler/icons-react";
import { motion } from "motion/react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
};

type ClientWorkItem = {
    title: string;
    client: string;
    url: string;
    description: string;
    technologies: string[];
    year: string;
    category: string;
};

export default function ClientWorkPage() {
    const clientWork = (data as { clientWork?: ClientWorkItem[] }).clientWork ?? [];
    const { trackEvent } = useTrackEvent();

    const handleProjectClick = (title: string, url: string) => {
        trackEvent("client_work_click", { project: title, url });
    };

    return (
        <PageLayout>
            <section className="px-6 md:px-12 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-heading mb-4">
                        Client Work
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Selected projects and engagements with clients—web applications,
                        mobile apps, and internal tools.
                    </p>
                </motion.div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {clientWork.map((item) => (
                        <motion.div key={item.title} variants={cardVariants}>
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-secondary-background flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <CardTitle className="text-lg md:text-xl">
                                            {item.title}
                                        </CardTitle>
                                        <Badge variant="chart3">{item.category}</Badge>
                                    </div>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        {item.client} · {item.year}
                                    </CardDescription>
                                    <CardDescription className="text-base leading-relaxed mt-2">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        {item.technologies.map((tech) => (
                                            <Badge key={tech} variant="chart3">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full chart-1">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Visit ${item.title}`}
                                            onClick={() => handleProjectClick(item.title, item.url)}
                                        >
                                            <IconExternalLink className="size-5 mr-2" aria-hidden="true" />
                                            View Project
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </PageLayout>
    );
}
