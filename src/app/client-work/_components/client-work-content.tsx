"use client";

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
import { IconExternalLink } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";

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

export type ClientWorkItem = {
    title: string;
    description: string;
    technologies: string[];
    url: string;
};

export function ClientWorkContent({ clientWork }: { clientWork: ClientWorkItem[] }) {
    const { trackEvent } = useTrackEvent();

    const handleProjectClick = (title: string, url: string) => {
        trackEvent("client_work_click", { project: title, url });
    };

    return (
        <>
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
                    <motion.div key={item.url} variants={cardVariants}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-secondary-background flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg md:text-xl">
                                    {item.title}
                                </CardTitle>
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
                                    <Link
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit ${item.title}`}
                                        onClick={() => handleProjectClick(item.title, item.url)}
                                    >
                                        <IconExternalLink className="size-5 mr-2" aria-hidden="true" />
                                        View Project
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
}
