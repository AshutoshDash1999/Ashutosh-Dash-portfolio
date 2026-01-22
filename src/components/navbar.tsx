"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { VERSION } from "@/lib/constants";
import data from "@/lib/data.json";
import { IconMenu, IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
    },
};

const themeIconVariants = {
    initial: { rotate: -90, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: 90, scale: 0, opacity: 0 },
};

const themeIconTransition = { duration: 0.15, ease: "easeOut" } as const;

export default function Navbar() {
    const { navbar } = data;
    const { setTheme, theme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const { trackEvent } = useTrackEvent();

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 50;
            setIsScrolled(window.scrollY > scrollThreshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavLinkClick = (label: string) => {
        trackEvent("nav_link_click", { section: label.toLowerCase() });
    };

    const handleThemeToggle = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        trackEvent("theme_toggle_click", { theme: newTheme });
    };

    const handleMobileMenuOpen = () => {
        trackEvent("mobile_menu_open");
    };

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 px-6 md:px-12 ${isScrolled
                ? "border-b-4 border-border bg-main"
                : "border-b-0 bg-background"
                }`}
        >

            <div className="flex items-center justify-between h-16 md:h-20 gap-4">
                {/* Logo */}
                <motion.div
                    className="text-xl md:text-2xl font-heading"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <div className="flex items-center">
                        <Image src={navbar.logo} alt="Ashutosh Dash Logo" width={100} height={100} priority />

                        <Badge variant={isScrolled ? "chart3" : "default"}>
                            {VERSION}
                        </Badge>
                    </div>
                </motion.div>

                {/* Desktop Navigation */}
                <motion.div
                    className="hidden md:flex items-center gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {navbar.links.map((link) => (
                        <motion.div
                            key={link.href}
                            variants={itemVariants}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <Button variant="neutral" asChild>
                                <a
                                    href={link.href}
                                    onClick={() => handleNavLinkClick(link.label)}
                                >
                                    {link.label}
                                </a>
                            </Button>
                        </motion.div>
                    ))}
                    <motion.div
                        variants={itemVariants}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Button
                            variant="neutral"
                            onClick={handleThemeToggle}
                            aria-label="Toggle dark mode"
                            className="relative overflow-hidden cursor-pointer size-10"
                        >
                            <AnimatePresence mode="sync" initial={false}>
                                {theme === "dark" ? (
                                    <motion.div
                                        key="sun"
                                        initial={themeIconVariants.initial}
                                        animate={themeIconVariants.animate}
                                        exit={themeIconVariants.exit}
                                        transition={themeIconTransition}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <IconSun className="size-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                                        animate={themeIconVariants.animate}
                                        exit={{ rotate: -90, scale: 0, opacity: 0 }}
                                        transition={themeIconTransition}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <IconMoon className="size-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Mobile Menu Button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="neutral"
                            size="icon"
                            className="md:hidden size-12"
                            aria-label="Open menu"
                            onClick={handleMobileMenuOpen}
                        >
                            <IconMenu className="size-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85vw] max-w-96">
                        <SheetHeader>
                            <SheetTitle className="text-xl">Menu</SheetTitle>
                        </SheetHeader>
                        <motion.div
                            className="flex flex-col gap-3 p-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {navbar.links.map((link) => (
                                <SheetClose key={link.href} asChild>
                                    <motion.div
                                        variants={itemVariants}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        <Button
                                            variant="neutral"
                                            size="lg"
                                            className="w-full justify-start text-base h-14 px-4"
                                            asChild
                                        >
                                            <a
                                                href={link.href}
                                                onClick={() => handleNavLinkClick(link.label)}
                                            >
                                                {link.label}
                                            </a>
                                        </Button>
                                    </motion.div>
                                </SheetClose>
                            ))}
                            <motion.div
                                variants={itemVariants}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <Button
                                    variant="neutral"
                                    size="lg"
                                    className="w-full justify-start relative overflow-hidden text-base h-14 px-4"
                                    onClick={handleThemeToggle}
                                    aria-label="Toggle dark mode"
                                >
                                    <AnimatePresence mode="sync" initial={false}>
                                        {theme === "dark" ? (
                                            <motion.div
                                                key="sun-mobile"
                                                initial={themeIconVariants.initial}
                                                animate={themeIconVariants.animate}
                                                exit={themeIconVariants.exit}
                                                transition={themeIconTransition}
                                                className="flex items-center"
                                            >
                                                <IconSun className="size-6 mr-3" />
                                                Light Mode
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="moon-mobile"
                                                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                                                animate={themeIconVariants.animate}
                                                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                                                transition={themeIconTransition}
                                                className="flex items-center"
                                            >
                                                <IconMoon className="size-6 mr-3" />
                                                Dark Mode
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </SheetContent>
                </Sheet>
            </div>

        </nav>
    );
}
