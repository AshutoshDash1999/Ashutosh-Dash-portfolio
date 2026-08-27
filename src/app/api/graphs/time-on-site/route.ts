import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseTimeSeries } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("jggzDJNz");
    // value is in seconds - format on the frontend as needed
    return successResponse(parseTimeSeries(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
