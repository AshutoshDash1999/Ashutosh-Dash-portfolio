import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, formatDuration, getAggValue } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("J19hs7DK");
    const seconds = getAggValue(insight); // e.g. 133.06
    return successResponse({
      value: seconds,
      formatted: seconds !== null ? formatDuration(seconds) : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
