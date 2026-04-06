/**
 * PostHog cloud region and API hosts.
 * Set NEXT_PUBLIC_POSTHOG_REGION=us|eu so client, proxy, and server stay aligned.
 * Optional: POSTHOG_API_HOST / NEXT_PUBLIC_POSTHOG_UI_HOST for full URL overrides.
 */

export type PostHogCloudRegion = "us" | "eu";

export function getPostHogCloudRegion(): PostHogCloudRegion {
  const raw =
    process.env.POSTHOG_REGION ?? process.env.NEXT_PUBLIC_POSTHOG_REGION ?? "";
  return raw.toLowerCase() === "eu" ? "eu" : "us";
}

export function getPostHogApiOrigin(): string {
  const override = process.env.POSTHOG_API_HOST;
  if (override) {
    return override.replace(/\/$/, "");
  }
  return getPostHogCloudRegion() === "eu"
    ? "https://eu.posthog.com"
    : "https://us.posthog.com";
}

/** App UI link (toolbar, etc.); defaults to same origin as API. */
export function getPostHogUiHost(): string {
  const override = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST;
  if (override) {
    return override.replace(/\/$/, "");
  }
  return getPostHogApiOrigin();
}

export function getPostHogIngestHostname(): string {
  return getPostHogCloudRegion() === "eu"
    ? "eu.i.posthog.com"
    : "us.i.posthog.com";
}

export function getPostHogAssetsHostname(): string {
  return getPostHogCloudRegion() === "eu"
    ? "eu-assets.i.posthog.com"
    : "us-assets.i.posthog.com";
}
