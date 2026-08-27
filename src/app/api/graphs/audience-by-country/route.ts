import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseBreakdown } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("ZAeSBsUK");
    // Returns [{label: "IN", value: 244}, {label: "US", value: 106}, ...]
    return successResponse(parseBreakdown(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
