"use client";

import {
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconCardsFilled,
  IconDeviceGamepad2,
  IconPuzzle,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTrackEvent } from "@/hooks/useTrackEvent";

type GameState = "idle" | "playing" | "won";

type TechIconType = React.ComponentType<{
  className?: string;
  size?: number;
}>;

// Tile value = final solved position (0-7); 8 = blank. Index = current position.
const BLANK = 8;
const GRID_SIZE = 3;
const SOLVED: number[] = [0, 1, 2, 3, 4, 5, 6, 7, BLANK];

const TILE_ICONS: TechIconType[] = [
  IconBrandReact,
  IconBrandNextjs,
  IconBrandTypescript,
  IconBrandTailwind,
  IconBrandNodejs,
  IconBrandJavascript,
  IconBrandReact,
  IconBrandNextjs,
];
// 9th icon, shown in the idle preview grid's flip-card faces
const IDLE_ICON: TechIconType = IconBrandTypescript;

const TILE_COLORS = ["var(--chart-2)", "var(--chart-10)"];
const CARD_BACK_COLOR = "var(--chart-10)";

// Idle flip sequence: which cell indices (0-8, 3x3) flip together each tick.
const idleFlipSequence: number[][] = [
  [0, 4, 8],
  [2, 3, 7],
  [1, 5, 6],
];

const isSolved = (tiles: number[]) =>
  tiles.every((tile, idx) => tile === SOLVED[idx]);

const getAdjacentIndices = (index: number): number[] => {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const adjacent: number[] = [];
  if (row > 0) adjacent.push(index - GRID_SIZE);
  if (row < GRID_SIZE - 1) adjacent.push(index + GRID_SIZE);
  if (col > 0) adjacent.push(index - 1);
  if (col < GRID_SIZE - 1) adjacent.push(index + 1);
  return adjacent;
};

// Shuffle via random legal slides from solved state — guarantees solvability.
const shuffleTiles = (): number[] => {
  let tiles = [...SOLVED];
  let blankIndex = tiles.indexOf(BLANK);
  let lastMove = -1;

  for (let i = 0; i < 150; i++) {
    const candidates = getAdjacentIndices(blankIndex).filter(
      (idx) => idx !== lastMove,
    );
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    tiles = tiles.map((tile, idx) => {
      if (idx === next) return BLANK;
      if (idx === blankIndex) return tiles[next];
      return tile;
    });
    lastMove = blankIndex;
    blankIndex = next;
  }

  return isSolved(tiles) ? shuffleTiles() : tiles;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export type SlidePuzzleProps = {
  entranceReady?: boolean;
};

export default function SlidePuzzle({
  entranceReady = true,
}: SlidePuzzleProps) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [tiles, setTiles] = useState<number[]>(SOLVED);
  const [animationKey, setAnimationKey] = useState(0);
  const [idleFlipped, setIdleFlipped] = useState<boolean[]>(
    Array(9).fill(false),
  );
  const { trackEvent } = useTrackEvent();

  const idleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const idleIndexRef = useRef<number>(0);
  const previousSequenceIndicesRef = useRef<number[]>([]);

  const startGame = useCallback(() => {
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current);
      idleIntervalRef.current = null;
    }
    setTiles(shuffleTiles());
    setGameState("playing");
    setAnimationKey((prev) => prev + 1);
  }, []);

  const handleStartGame = () => {
    startGame();
    trackEvent("puzzle_start_click");
  };

  const handleRestartGame = () => {
    startGame();
    trackEvent("puzzle_restart_click");
  };

  const handlePlayAgain = () => {
    startGame();
    trackEvent("puzzle_play_again_click");
  };

  const handleTileTap = (index: number) => {
    if (gameState !== "playing") return;
    const blankIndex = tiles.indexOf(BLANK);
    if (!getAdjacentIndices(blankIndex).includes(index)) return;

    const next = [...tiles];
    [next[index], next[blankIndex]] = [next[blankIndex], next[index]];
    setTiles(next);
  };

  useEffect(() => {
    if (gameState === "playing" && isSolved(tiles)) {
      setGameState("won");
    }
  }, [tiles, gameState]);

  // Idle mode: auto-flip cards like the memory game, same hardcoded-sequence approach.
  useEffect(() => {
    if (gameState !== "idle") return;

    idleIntervalRef.current = setInterval(() => {
      const sequenceIndex = idleIndexRef.current % idleFlipSequence.length;
      const cellIndices = idleFlipSequence[sequenceIndex];
      const previousIndices = previousSequenceIndicesRef.current;

      setIdleFlipped((prev) =>
        prev.map((flipped, idx) => {
          if (previousIndices.includes(idx)) return false;
          if (cellIndices.includes(idx)) return true;
          return flipped;
        }),
      );

      previousSequenceIndicesRef.current = cellIndices;
      idleIndexRef.current += 1;
    }, 1000);

    return () => {
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
        idleIntervalRef.current = null;
      }
    };
  }, [gameState]);

  return (
    <div className="w-full h-full min-h-96 border-4 border-border rounded-lg bg-main p-6 flex flex-col gap-4 overflow-hidden">
      {gameState === "idle" ? (
        <motion.div
          className="grid grid-cols-3 gap-4 flex-1 touch-manipulation"
          variants={containerVariants}
          initial="hidden"
          animate={entranceReady ? "visible" : "hidden"}
        >
          {idleFlipped.map((isFlipped, index) => {
            const tileColor = TILE_COLORS[index % 2 === 0 ? 0 : 1];
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed 9-cell idle grid, no reordering
                key={index}
                className="relative w-full h-full min-h-14 perspective-[1000px]"
                variants={tileVariants}
              >
                <motion.div
                  className="relative w-full h-full rounded-lg border-2 border-border shadow-shadow transform-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="absolute inset-0 rounded-base flex items-center justify-center backface-hidden transform-[rotateY(180deg)]"
                    style={{ backgroundColor: tileColor }}
                  >
                    <IDLE_ICON className="size-8 md:size-10 text-secondary-background" />
                  </div>
                  <div
                    className="absolute inset-0 rounded-base flex items-center justify-center backface-hidden"
                    style={{ backgroundColor: CARD_BACK_COLOR }}
                  >
                    <IconCardsFilled className="size-8 md:size-10 text-secondary-background" />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          key={animationKey}
          className="grid grid-cols-3 gap-4 flex-1 touch-manipulation"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tiles.map((tile, index) => {
            const tileColor = TILE_COLORS[index % 2 === 0 ? 0 : 1];

            if (tile === BLANK) {
              return (
                <div
                  key="blank"
                  className="rounded-lg border-2 border-dashed border-border/40"
                />
              );
            }

            const Icon = TILE_ICONS[tile];
            const blankIndex = tiles.indexOf(BLANK);
            const isMovable =
              gameState === "playing" &&
              getAdjacentIndices(blankIndex).includes(index);

            return (
              <motion.button
                key={tile}
                type="button"
                disabled={!isMovable}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                onClick={() => handleTileTap(index)}
                variants={tileVariants}
                className="relative w-full h-full min-h-14 rounded-lg border-2 border-border shadow-shadow flex items-center justify-center enabled:cursor-pointer disabled:cursor-default enabled:active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ backgroundColor: tileColor }}
                aria-label={
                  isMovable ? `Move tile ${tile + 1}` : `Tile ${tile + 1}`
                }
              >
                <Icon className="size-8 md:size-10 text-secondary-background" />
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <div className="flex justify-center gap-4">
        {gameState === "idle" && (
          <Button
            onClick={handleStartGame}
            size="lg"
            className="bg-chart-2"
            aria-label="Start the sliding puzzle game"
          >
            <IconDeviceGamepad2 className="size-5" aria-hidden="true" />
            Start Puzzle
          </Button>
        )}
        {gameState === "playing" && (
          <Button
            onClick={handleRestartGame}
            size="lg"
            variant="neutral"
            className="bg-chart-4 text-secondary-background"
            aria-label="Restart the sliding puzzle game"
          >
            <IconPuzzle className="size-5" aria-hidden="true" />
            Restart Puzzle
          </Button>
        )}
        {gameState === "won" && (
          <Button
            onClick={handlePlayAgain}
            size="lg"
            className="bg-chart-3"
            aria-label="Play the sliding puzzle again"
          >
            <IconRotateClockwise className="mr-2 size-5" aria-hidden="true" />
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
}
