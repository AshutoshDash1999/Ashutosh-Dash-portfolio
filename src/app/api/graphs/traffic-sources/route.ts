import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseBreakdown } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("nJlQ6g5r");
    return successResponse(parseBreakdown(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
