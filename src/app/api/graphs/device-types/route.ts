import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseBreakdown } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("TfRMfHMe");
    // Returns [{label: "Desktop", value: 378}, {label: "Mobile", value: 136}]
    return successResponse(parseBreakdown(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
