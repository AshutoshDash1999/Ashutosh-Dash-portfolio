"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonVariant = "chart" | "donut" | "tiles";

type InsightCardProps = {
  title: string;
  description: string;
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  skeleton?: SkeletonVariant;
  delay?: number;
  children: ReactNode;
};

function SkeletonBody({ variant }: { variant: SkeletonVariant }) {
  if (variant === "donut") {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="size-50 rounded-full" />
      </div>
    );
  }
  if (variant === "tiles") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(["t0", "t1", "t2", "t3", "t4"] as const).map((id) => (
          <Skeleton key={id} className="h-24" />
        ))}
      </div>
    );
  }
  return <Skeleton className="h-70 w-full" />;
}

export function InsightCard({
  title,
  description,
  isLoading,
  hasError,
  isEmpty,
  skeleton = "chart",
  delay = 0.2,
  children,
}: InsightCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent>
          <SkeletonBody variant={skeleton} />
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <IconAlertTriangle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load {title.toLowerCase()} data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70 text-center py-8">
            No data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
