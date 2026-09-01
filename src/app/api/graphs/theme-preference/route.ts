import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseBreakdown } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("IW5EHX9I");
    // Returns [{label: "dark", value: 77}, {label: "light", value: 49}]
    return successResponse(parseBreakdown(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
