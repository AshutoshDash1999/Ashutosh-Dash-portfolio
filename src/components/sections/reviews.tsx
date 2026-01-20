"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import data from "@/lib/data.json";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Reviews() {
    const { reviews } = data;
    const [selectedReview, setSelectedReview] = useState<number | null>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
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
        <section id="reviews" className="px-6 md:px-12 py-16 md:py-24">
            <motion.h2
                className="text-3xl md:text-4xl font-heading mb-8 md:mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
            >
                Reviews
            </motion.h2>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {reviews.map((review, index) => (
                    <motion.div key={index} variants={cardVariants}>
                        <Card
                            className="h-full hover:shadow-lg transition-shadow duration-300 bg-secondary-background cursor-pointer"
                            onClick={() => setSelectedReview(index)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-2 justify-between">
                                    <div>
                                        <CardTitle className="text-xl">
                                            {review.clientName}
                                        </CardTitle>
                                        <div className="text-sm text-foreground">{review.role}</div>
                                    </div>
                                    <Link href={review?.linkedin} target="_blank">
                                        <Button size="icon" className="cursor-pointer">
                                            <IconBrandLinkedin />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="text-foreground italic line-clamp-4">
                                    "{review.review}"
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <Dialog
                open={selectedReview !== null}
                onOpenChange={(open) => !open && setSelectedReview(null)}
            >
                {selectedReview !== null && (
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <div className="flex items-center gap-2 justify-between">
                                <div>
                                    <DialogTitle>
                                        {reviews[selectedReview].clientName}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {reviews[selectedReview].role}
                                    </DialogDescription>
                                </div>
                                <Link href={reviews[selectedReview].linkedin} target="_blank">
                                    <Button size="icon" className="cursor-pointer">
                                        <IconBrandLinkedin />
                                    </Button>
                                </Link>
                            </div>
                        </DialogHeader>
                        <p className="text-foreground italic leading-relaxed">
                            "{reviews[selectedReview].review}"
                        </p>
                    </DialogContent>
                )}
            </Dialog>
        </section>
    );
}
