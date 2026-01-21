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
import { useEffect, useRef } from "react";
import { ThemeProvider } from "./theme-provider";

export default function AppProvider({
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
