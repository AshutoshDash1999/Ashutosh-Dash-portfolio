"use client";

import data from "@/lib/data.json";
import { IconFileText } from "@tabler/icons-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const CardGameSkeleton = () => (
    <div className="w-full h-full min-h-96 border-4 border-border rounded-lg bg-main p-6 flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4 flex-1">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-square" />
            ))}
        </div>
        <div className="flex justify-center">
            <Skeleton className="h-11 w-36" />
        </div>
    </div>
);

const CardGame = dynamic(() => import("./card-game"), {
    ssr: false,
    loading: () => <CardGameSkeleton />,
});

export default function Hero() {
    const { personal } = data;

    return (
        <section id="hero" className="px-6 md:px-12 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <motion.div
                    className="flex-1 space-y-4"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-heading"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    >
                        {personal.name}
                    </motion.h1>
                    <motion.h2
                        className="text-2xl md:text-3xl lg:text-4xl font-heading text-main inline-block"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        {personal.title}
                    </motion.h2>

                    <motion.p
                        className="text-lg md:text-xl text-foreground max-w-2xl"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    >
                        {personal.bio}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                    >
                        <Link
                            href="/Ashutosh_Dash_Frontend_Dev.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 transition-colors group"
                            aria-label="View resume"
                        >
                            <Button size={"xl"}>
                                <IconFileText className="size-5" />
                                <span className="text-base md:text-sm">See my work</span>
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="flex-1 w-full min-h-96 flex items-center justify-center"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                    <CardGame />
                </motion.div>
            </div>
        </section>
    );
}
