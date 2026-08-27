import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseMultiSeries } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("icTPhjhH");
    // FCP/LCP/TTFB/INP values are in ms; CLS is unitless
    return successResponse(parseMultiSeries(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
