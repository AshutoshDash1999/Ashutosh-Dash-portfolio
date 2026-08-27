import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, getAggValue } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("eTtWHLer");
    return successResponse({ value: getAggValue(insight) });
  } catch (error) {
    return errorResponse(error);
  }
}
