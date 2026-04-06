import posthog from "posthog-js";
import { getPostHogUiHost } from "@/lib/posthog-region";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (typeof posthogKey === "string" && posthogKey.length > 0) {
  posthog.init(posthogKey, {
    api_host: "/ph",
    ui_host: getPostHogUiHost(),
    defaults: "2025-11-30",
    capture_pageview: true,
    capture_pageleave: true,
    capture_dead_clicks: true,
    person_profiles: "never",
  });
}
