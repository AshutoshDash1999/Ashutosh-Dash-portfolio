"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import data from "@/lib/data.json";
import { IconBrandGithub, IconFileText, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { ThemeProvider } from "./theme-provider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleContactClick = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const githubUrl =
    data.socialLinks.find((link) => link.platform === "GitHub")?.url ||
    "https://github.com";
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
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
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
