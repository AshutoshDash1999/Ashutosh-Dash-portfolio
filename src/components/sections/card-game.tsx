"use client";

import { Button } from "@/components/ui/button";
import {
    IconBrandJavascript,
    IconBrandNextjs,
    IconBrandNodejs,
    IconBrandReact,
    IconBrandTailwind,
    IconBrandTypescript,
    IconCardsFilled,
    IconDeviceGamepad2,
    IconRefresh,
    IconRotateClockwise
} from "@tabler/icons-react";
import { motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type GameState = "idle" | "playing" | "ended";

type TechIconType = React.ComponentType<{
    className?: string;
    size?: number;
}>;

type Card = {
    id: string;
    techIcon: TechIconType;
    techKey: string;
    flipped: boolean;
    matched: boolean;
};

const TECH_STACK: { icon: TechIconType; key: string }[] = [
    { icon: IconBrandReact, key: "react" },
    { icon: IconBrandNextjs, key: "nextjs" },
    { icon: IconBrandTypescript, key: "typescript" },
    { icon: IconBrandJavascript, key: "javascript" },
    { icon: IconBrandNodejs, key: "nodejs" },
    { icon: IconBrandTailwind, key: "tailwind" },
];

const CARD_FRONT_COLOR = "var(--chart-2)";
const CARD_BACK_COLOR = "var(--chart-10)";

// Idle flip sequence: defines which card indices (0-based) flip at each second
// Pattern repeats cyclically (for 12 cards in 3x4 grid)
const idleFlipSequence: number[][] = [
    [0, 5, 10],   // Card 0 (row 0, col 0), Card 5 (row 1, col 1), Card 10 (row 2, col 2)
    [3, 4, 9],    // Card 3 (row 0, col 3), Card 4 (row 1, col 0), Card 9 (row 2, col 1)
    [1, 7, 11],   // Card 1 (row 0, col 1), Card 7 (row 1, col 3), Card 11 (row 2, col 3)
    [2, 6, 8],    // Card 2 (row 0, col 2), Card 6 (row 1, col 2), Card 8 (row 2, col 0)
];

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function CardGame() {
    const [gameState, setGameState] = useState<GameState>("idle");
    const [cards, setCards] = useState<Card[]>([]);
    const [firstCard, setFirstCard] = useState<Card | null>(null);
    const [secondCard, setSecondCard] = useState<Card | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    const idleIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const idleIndexRef = useRef<number>(0);
    const previousSequenceIndicesRef = useRef<number[]>([]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    const initializeCards = useCallback(() => {
        const pairs = [...TECH_STACK, ...TECH_STACK];
        const shuffled = shuffleArray(pairs);
        return shuffled.map((tech, idx) => ({
            id: `${idx}-${tech.key}`,
            techIcon: tech.icon,
            techKey: tech.key,
            flipped: false,
            matched: false,
        }));
    }, []);

    const startGame = () => {
        if (idleIntervalRef.current) {
            clearInterval(idleIntervalRef.current);
            idleIntervalRef.current = null;
        }
        const newCards = initializeCards();
        setCards(newCards);
        setFirstCard(null);
        setSecondCard(null);
        setGameState("playing");
        setIsFlipping(false);
        idleIndexRef.current = 0;
        setAnimationKey((prev) => prev + 1);
    };

    const restartGame = () => {
        startGame();
    };

    const handleCardClick = (card: Card) => {
        if (
            gameState !== "playing" ||
            card.flipped ||
            card.matched ||
            isFlipping
        )
            return;

        if (firstCard === null) {
            setCards((prev) =>
                prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
            );
            setFirstCard(card);
        } else if (secondCard === null && card.id !== firstCard.id) {
            setCards((prev) =>
                prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
            );
            setSecondCard(card);
            setIsFlipping(true);
        }
    };

    // Handle matching logic
    useEffect(() => {
        if (firstCard && secondCard && isFlipping) {
            const timer = setTimeout(() => {
                if (firstCard.techKey === secondCard.techKey) {
                    // Match found
                    setCards((prev) =>
                        prev.map((c) =>
                            c.techKey === firstCard.techKey
                                ? { ...c, matched: true }
                                : c
                        )
                    );
                } else {
                    // No match - flip back
                    setCards((prev) =>
                        prev.map((c) =>
                            c.id === firstCard.id || c.id === secondCard.id
                                ? { ...c, flipped: false }
                                : c
                        )
                    );
                }
                setFirstCard(null);
                setSecondCard(null);
                setIsFlipping(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [firstCard, secondCard, isFlipping]);

    // Check if game is won
    useEffect(() => {
        if (
            gameState === "playing" &&
            cards.length > 0 &&
            cards.every((card) => card.matched)
        ) {
            setGameState("ended");
        }
    }, [cards, gameState]);

    // Idle mode auto-flip with hardcoded sequence
    useEffect(() => {
        if (gameState === "idle" && cards.length > 0) {
            idleIntervalRef.current = setInterval(() => {
                const sequenceIndex = idleIndexRef.current % idleFlipSequence.length;
                const cardIndices = idleFlipSequence[sequenceIndex];
                const previousIndices = previousSequenceIndicesRef.current;

                setCards((prev) =>
                    prev.map((card, idx) => {
                        // First, flip back cards from previous sequence
                        if (previousIndices.includes(idx)) {
                            return { ...card, flipped: false };
                        }
                        // Then, flip new cards in current sequence
                        if (cardIndices.includes(idx)) {
                            return { ...card, flipped: true };
                        }
                        return card;
                    })
                );

                // Update previous sequence for next iteration
                previousSequenceIndicesRef.current = cardIndices;
                idleIndexRef.current += 1;
            }, 1000);
        }

        return () => {
            if (idleIntervalRef.current) {
                clearInterval(idleIntervalRef.current);
                idleIntervalRef.current = null;
            }
        };
    }, [gameState, cards.length]);

    // Initialize cards on mount
    useEffect(() => {
        if (cards.length === 0) {
            const initialCards = initializeCards();
            setCards(initialCards);
            setGameState("idle");
            setAnimationKey((prev) => prev + 1);
        }
    }, [cards.length, initializeCards]);

    return (
        <div className="w-full h-full min-h-96 border-4 border-border rounded-lg bg-main p-6 flex flex-col gap-4 overflow-hidden">
            {/* Game Grid */}
            <motion.div
                key={animationKey}
                className="grid grid-cols-4 gap-4 flex-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {cards.map((card) => {
                    const Icon = card.techIcon;
                    const isFlipped = card.flipped || card.matched;


                    return (
                        <motion.div
                            key={card.id}
                            className="relative cursor-pointer perspective-[1000px] hover:scale-105 transition-all duration-300"
                            onClick={() => handleCardClick(card)}
                            variants={cardVariants}
                        >
                            <motion.div
                                className="relative w-full h-full rounded-lg border-2 border-border shadow-shadow transform-3d "
                                animate={{
                                    rotateY: isFlipped ? 180 : 0,
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Card Front (Tech Icon) */}
                                <div
                                    className="absolute inset-0 rounded-base flex items-center justify-center backface-hidden transform-[rotateY(180deg)]"
                                    style={{
                                        backgroundColor: CARD_FRONT_COLOR,
                                    }}
                                >
                                    <Icon className="size-12 text-secondary-background" />
                                </div>

                                {/* Card Back (PlayCard Icon) */}
                                <div
                                    className="absolute inset-0 rounded-base flex items-center justify-center backface-hidden"
                                    style={{
                                        backgroundColor: CARD_BACK_COLOR,
                                    }}
                                >
                                    <IconCardsFilled className="size-12 text-secondary-background" />
                                </div>
                            </motion.div>

                            {/* Overlay for matched cards */}
                            {card.matched && (
                                <div className="absolute inset-0 rounded-base  bg-main/10 pointer-events-none" />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                {(gameState === "idle") && (
                    <Button onClick={startGame} size="lg" className="bg-chart-2">
                        <IconDeviceGamepad2 className=" size-5" />
                        Start Game
                    </Button>
                )}
                {gameState === "playing" && (
                    <Button onClick={restartGame} size="lg" variant="neutral" className="bg-chart-4 text-secondary-background">
                        <IconRefresh className=" size-5" />
                        Restart Game
                    </Button>
                )}
                {gameState === "ended" && (
                    <Button onClick={restartGame} size="lg" className="bg-chart-3">
                        <IconRotateClockwise className="mr-2 size-5" />
                        Play Again
                    </Button>
                )}
            </div>
        </div>
    );
}
