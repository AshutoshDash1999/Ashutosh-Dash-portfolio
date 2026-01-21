"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import data from "@/lib/data.json";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

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

export default function Reviews() {
    const { reviews } = data;
    const [selectedReview, setSelectedReview] = useState<number | null>(null);
    const { trackEvent } = useTrackEvent();

    const handleReviewCardClick = (index: number, clientName: string) => {
        setSelectedReview(index);
        trackEvent("review_card_click", { client_name: clientName });
    };

    const handleLinkedInClick = (e: React.MouseEvent, clientName: string, url: string) => {
        e.stopPropagation();
        trackEvent("review_linkedin_click", { client_name: clientName, url });
    };

    const handleDialogLinkedInClick = (clientName: string, url: string) => {
        trackEvent("review_linkedin_click", { client_name: clientName, url });
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
                            onClick={() => handleReviewCardClick(index, review.clientName)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3 md:gap-2 justify-between">
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg md:text-xl">
                                            {review.clientName}
                                        </CardTitle>
                                        <div className="text-base md:text-sm text-foreground">{review.role}</div>
                                    </div>
                                    <Link
                                        href={review?.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`View ${review.clientName}'s LinkedIn profile`}
                                        onClick={(e) => handleLinkedInClick(e, review.clientName, review.linkedin)}
                                    >
                                        <Button size="icon" className="cursor-pointer size-12 md:size-10 shrink-0" aria-label={`LinkedIn profile of ${review.clientName}`}>
                                            <IconBrandLinkedin className="size-5 md:size-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="text-base md:text-base text-foreground italic line-clamp-4 leading-relaxed">
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
                    <DialogContent className="max-w-2xl mx-4 md:mx-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-3 md:gap-2 justify-between">
                                <div className="min-w-0 flex-1">
                                    <DialogTitle className="text-lg md:text-xl">
                                        {reviews[selectedReview].clientName}
                                    </DialogTitle>
                                    <DialogDescription className="text-base md:text-sm">
                                        {reviews[selectedReview].role}
                                    </DialogDescription>
                                </div>
                                <Link
                                    href={reviews[selectedReview].linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View ${reviews[selectedReview].clientName}'s LinkedIn profile`}
                                    onClick={() => handleDialogLinkedInClick(reviews[selectedReview].clientName, reviews[selectedReview].linkedin)}
                                >
                                    <Button size="icon" className="cursor-pointer size-12 md:size-10 shrink-0" aria-label={`LinkedIn profile of ${reviews[selectedReview].clientName}`}>
                                        <IconBrandLinkedin className="size-5 md:size-4" />
                                    </Button>
                                </Link>
                            </div>
                        </DialogHeader>
                        <p className="text-base md:text-base text-foreground italic leading-relaxed">
                            "{reviews[selectedReview].review}"
                        </p>
                    </DialogContent>
                )}
            </Dialog>
        </section>
    );
}
