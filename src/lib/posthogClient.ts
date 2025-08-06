import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "production" &&
    POSTHOG_KEY
  ) {
    posthog.init(POSTHOG_KEY, {
      api_host: "https://app.posthog.com",
      loaded: (posthog) => {
        if (process.env.NODE_ENV !== "production") posthog.opt_out_capturing();
      },
      capture_pageview: false, // We'll capture manually
    });
  }
}

export function capturePageView() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    posthog.capture("$pageview");
  }
}

export const posthogClient = posthog;
