"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IconFileAnalyticsFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-analytics-acknowledged";

export function AnalyticsBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const acknowledged = localStorage.getItem(STORAGE_KEY);
        if (!acknowledged) setShow(true);
    }, []);

    const handleOk = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <Alert
            className="fixed bottom-10 left-0 right-0 z-50 md:left-1/2 md:max-w-2xl md:-translate-x-1/2 bg-chart-3 items-center [&>svg]:size-6"
            variant="default"
        >
            <IconFileAnalyticsFilled aria-hidden />
            <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-muted-foreground text-sm">
                    Just a heads up - this site uses a bit of third-party analytics
                    to see how it's used. Nothing fancy.
                </span>
                <Button
                    size="sm"
                    className="shrink-0 font-normal"
                    onClick={handleOk}
                >
                    Ok
                </Button>
            </AlertDescription>
        </Alert>
    );
}
