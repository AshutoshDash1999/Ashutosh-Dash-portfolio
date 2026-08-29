import posthog, { type CaptureResult } from "posthog-js";
import { getPostHogUiHost } from "@/lib/posthog-region";

// Browser extensions inject content scripts that reject promises inside the
// page. These signatures never come from the site, so they must not open issues.
const EXTENSION_REJECTION_SIGNATURES = ["Object Not Found Matching Id"];

// Drops browser-extension noise before it reaches error tracking: synthetic
// unhandled rejections with no stack frames, plus known extension signatures.
function dropExtensionNoise(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== "$exception") {
    return event;
  }
  const exceptions = event.properties?.$exception_list;
  if (!Array.isArray(exceptions)) {
    return event;
  }
  const isNoise = exceptions.some((exception) => {
    const frames = exception?.stacktrace?.frames;
    const hasNoFrames = !Array.isArray(frames) || frames.length === 0;
    const isSynthetic = exception?.mechanism?.synthetic === true;
    const value = typeof exception?.value === "string" ? exception.value : "";
    const matchesSignature = EXTENSION_REJECTION_SIGNATURES.some((signature) =>
      value.includes(signature),
    );
    return matchesSignature || (isSynthetic && hasNoFrames);
  });
  return isNoise ? null : event;
}

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
    before_send: dropExtensionNoise,
  });
}
