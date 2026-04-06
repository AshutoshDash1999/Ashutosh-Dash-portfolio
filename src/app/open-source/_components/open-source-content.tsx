"use client";

import { IconExternalLink } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useContext } from "react";
import { FirstLoadContext } from "@/components/layout/first-load-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export type OpenSourceContribution = {
  repo: string;
  org: string;
  url: string;
  description: string;
  technologies: string[];
  issueUrl: string;
};

export function OpenSourceContent({
  contributions,
}: {
  contributions: OpenSourceContribution[];
}) {
  const { trackEvent } = useTrackEvent();
  const firstLoadComplete = useContext(FirstLoadContext);

  const handleRepoClick = (repo: string, url: string) => {
    trackEvent("open_source_click", { repo, url });
  };

  const handleIssueClick = (repo: string, url: string) => {
    trackEvent("open_source_issue_click", { repo, url });
  };

  return (
    <>
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-heading mb-4">
          Open Source Contributions
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Projects and communities I&apos;ve contributed to—bug fixes,
          documentation, and component improvements.
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={firstLoadComplete ? "visible" : "hidden"}
      >
        {contributions.map((item) => (
          <motion.div key={item.repo} variants={cardVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-secondary-background flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {item.repo}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors flex items-center gap-2"
                    aria-label={`View ${item.org} on GitHub`}
                  >
                    {item.org}{" "}
                    <IconExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                </CardDescription>
                <CardDescription className="text-base leading-relaxed mt-2 line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="chart3">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                {item.issueUrl && (
                  <Button
                    asChild
                    variant="neutral"
                    className="flex-1 bg-chart-2"
                  >
                    <Link
                      href={item.issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View contribution for ${item.repo}`}
                      onClick={() => handleIssueClick(item.repo, item.issueUrl)}
                    >
                      Issue / PR
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
