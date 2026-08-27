import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseTimeSeries } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("9TXTGjj9");
    return successResponse(parseTimeSeries(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
