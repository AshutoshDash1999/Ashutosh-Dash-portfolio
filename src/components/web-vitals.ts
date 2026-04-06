"use client";

import { useReportWebVitals } from "next/web-vitals";
import { usePostHog } from "posthog-js/react";

const WEB_VITAL_NAMES = new Set(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]);

/**
 * Sends Core Web Vitals as `$web_vitals` with `$web_vitals_<METRIC>_value` properties
 * so HogQL in `vitalsQueries` matches PostHog's web analytics shape.
 */
export function WebVitals() {
  const posthog = usePostHog();

  useReportWebVitals((metric) => {
    if (!posthog || !WEB_VITAL_NAMES.has(metric.name)) return;
    posthog.capture("$web_vitals", {
      [`$web_vitals_${metric.name}_value`]: metric.value,
    });
  });

  return null;
}
