"use client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { IconBrandGithub, IconFileText, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import { ThemeProvider } from "./theme-provider";

function AppProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { trackEvent } = useTrackEvent();
    const searchParams = useSearchParams();
    const utmTrackedRef = useRef(false);

    // Track UTM source once per mount
    useEffect(() => {
        if (utmTrackedRef.current) return;

        const utmSource = searchParams.get("utm_source");

        if (utmSource) {
            trackEvent("utm_source_detected", { utm_source: utmSource });
            utmTrackedRef.current = true;
        }
    }, [searchParams, trackEvent]);

    const handleContactClick = () => {
        trackEvent("context_menu_contact_click");
        const element = document.getElementById("contact");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSourceCodeClick = () => {
        trackEvent("context_menu_source_code_click");
    };

    const handleResumeClick = () => {
        trackEvent("context_menu_resume_click");
    };

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ContextMenu>
                <ContextMenuTrigger>{children}</ContextMenuTrigger>

                <ContextMenuContent className="">
                    <ContextMenuItem onClick={handleContactClick}>
                        <IconMail className="mr-2 size-4" />
                        Contact Me?
                        <ContextMenuShortcut></ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem asChild>
                        <Link
                            href={
                                "https://github.com/AshutoshDash1999/Ashutosh-Dash-portfolio"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleSourceCodeClick}
                        >
                            <IconBrandGithub className="mr-2 size-4" />
                            View Source Code
                            <ContextMenuShortcut></ContextMenuShortcut>
                        </Link>
                    </ContextMenuItem>
                    <ContextMenuItem asChild>
                        <Link
                            href="/Ashutosh_Dash_Frontend_Dev.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleResumeClick}
                        >
                            <IconFileText className="mr-2 size-4" />
                            View Resume
                            <ContextMenuShortcut></ContextMenuShortcut>
                        </Link>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </ThemeProvider>
    );
}

const AppProviderSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar Skeleton */}
            <nav className="sticky top-0 z-50 px-6 md:px-12 bg-background">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-10" />
                        <Skeleton className="w-10 h-6 rounded-full" />
                    </div>
                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="w-20 h-10" />
                        ))}
                        <Skeleton className="size-10" />
                    </div>
                    {/* Mobile Menu Button */}
                    <Skeleton className="md:hidden size-12" />
                </div>
            </nav>

            {/* Hero Section Skeleton */}
            <section className="px-6 md:px-12 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Text Content */}
                    <div className="flex-1 space-y-4 w-full">
                        <Skeleton className="h-12 md:h-16 w-3/4" />
                        <Skeleton className="h-8 md:h-10 w-1/2" />
                        <div className="space-y-2 pt-2">
                            <Skeleton className="h-5 w-full max-w-2xl" />
                            <Skeleton className="h-5 w-5/6 max-w-xl" />
                            <Skeleton className="h-5 w-4/6 max-w-lg" />
                        </div>
                        <Skeleton className="h-12 w-36 mt-4" />
                    </div>
                    {/* Card Game Area */}
                    <div className="flex-1 w-full min-h-96 border-4 border-border rounded-lg bg-main/20 p-6 flex flex-col gap-4">
                        <div className="grid grid-cols-4 gap-4 flex-1">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Skeleton key={i} className="w-full aspect-square" />
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Skeleton className="h-11 w-36" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Skills Section Skeleton */}
            <section className="py-12 overflow-hidden">
                <div className="flex gap-4 animate-pulse">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-28 shrink-0" />
                    ))}
                </div>
            </section>

            {/* Experience Section Skeleton */}
            <section className="px-6 md:px-12 py-16">
                <Skeleton className="h-10 w-48 mx-auto mb-8" />
                <div className="space-y-6 max-w-4xl mx-auto">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border-4 border-border rounded-lg p-6 bg-secondary-background">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                <Skeleton className="h-5 w-36" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Section Skeleton */}
            <section className="px-6 md:px-12 py-16">
                <Skeleton className="h-10 w-40 mx-auto mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border-4 border-border rounded-lg overflow-hidden bg-secondary-background">
                            <Skeleton className="w-full aspect-video" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex gap-2 pt-2">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <Skeleton key={j} className="h-6 w-16 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Skeleton */}
            <footer className="px-6 md:px-12 py-8 border-t-4 border-border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="size-10" />
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

const SuspensedAppProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Suspense fallback={<AppProviderSkeleton />}>
            <AppProvider>{children}</AppProvider>
        </Suspense>
    );
};

export default SuspensedAppProvider;
