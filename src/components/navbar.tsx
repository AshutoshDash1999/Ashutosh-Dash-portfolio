"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import data from "@/lib/data.json";
import { useState } from "react";

export default function Navbar() {
  const { navbar } = data;
  const [isDark, setIsDark] = useState(false);

  // Placeholder function for dark mode toggle
  const handleDarkModeToggle = () => {
    setIsDark(!isDark);
    // Dark mode functionality will be implemented later
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="text-xl md:text-2xl font-heading">
            {navbar.logo}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navbar.links.map((link) => (
              <Button
                key={link.href}
                variant="neutral"
                asChild
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
            <Button
              variant="neutral"
              size="icon"
              onClick={handleDarkModeToggle}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>

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
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                {navbar.links.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Button
                      variant="neutral"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  </SheetClose>
                ))}
                <Button
                  variant="neutral"
                  className="w-full justify-start"
                  onClick={handleDarkModeToggle}
                  aria-label="Toggle dark mode"
                >
                  {isDark ? (
                    <>
                      <Sun className="size-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="size-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
