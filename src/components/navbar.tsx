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
import data from "@/lib/data.json";
import { Menu, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { navbar } = data;
  const { setTheme, theme } = useTheme();

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

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="text-xl md:text-2xl font-heading"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {navbar.logo}
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
                  <a href={link.href}>{link.label}</a>
                </Button>
              </motion.div>
            ))}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Button
                variant="neutral"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle dark mode"
                className="relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Sun className="size-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -90, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Moon className="size-5" />
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
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <motion.div
                className="flex flex-col gap-4 p-4"
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
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={link.href}>{link.label}</a>
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
                    className="w-full justify-start"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="Toggle dark mode"
                  >
                    <AnimatePresence mode="wait">
                      {theme === "dark" ? (
                        <motion.div
                          key="sun-mobile"
                          initial={{ rotate: -90, scale: 0, opacity: 0 }}
                          animate={{ rotate: 0, scale: 1, opacity: 1 }}
                          exit={{ rotate: 90, scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex items-center"
                        >
                          <Sun className="size-5 mr-2" />
                          Light Mode
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon-mobile"
                          initial={{ rotate: 90, scale: 0, opacity: 0 }}
                          animate={{ rotate: 0, scale: 1, opacity: 1 }}
                          exit={{ rotate: -90, scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex items-center"
                        >
                          <Moon className="size-5 mr-2" />
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
      </div>
    </nav>
  );
}
