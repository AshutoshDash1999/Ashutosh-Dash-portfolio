"use client";

import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useState } from "react";

const LOADING_DURATION_MS = 1200;

export function LoadingScreen({
    userName,
    onComplete,
}: {
    userName: string;
    onComplete: () => void;
}) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const handleComplete = useCallback(() => {
        if (isComplete) return;
        setIsComplete(true);
        onComplete();
    }, [onComplete, isComplete]);

    useEffect(() => {
        const start = performance.now();
        let rafId: number;

        const tick = (now: number) => {
            const elapsed = now - start;
            const p = Math.min(100, (elapsed / LOADING_DURATION_MS) * 100);
            setProgress(p);
            if (p >= 100) {
                handleComplete();
                return;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [handleComplete]);

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 p-4"
            aria-live="polite"
            aria-label="Loading"
        >
            <div className="w-full max-w-md overflow-hidden rounded-xl border-4 border-black bg-chart-3 shadow-[6px_6px_0_0_black]">
                <div className="flex items-center gap-2 border-b-4 border-black bg-chart-8 px-3 py-2">
                    <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-black" aria-hidden />
                        <span className="h-3 w-3 rounded-full bg-black" aria-hidden />
                        <span className="h-3 w-3 rounded-full bg-black" aria-hidden />
                    </div>
                </div>

                <div className="p-6">
                    <p className="mb-4 text-xl font-bold leading-7 text-black md:text-2xl md:leading-8">
                        {userName}
                    </p>

                    <Progress
                        value={progress}
                        className="h-6 border-4 border-black rounded-full bg-black **:data-[slot=progress-indicator]:bg-chart-2 **:data-[slot=progress-indicator]:rounded-l-full **:data-[slot=progress-indicator]:border-0"
                    />
                </div>
            </div>
        </div>
    );
}
