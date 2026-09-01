import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, getFormulaValue } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("yKRv8ei6");
    const raw = getFormulaValue(insight); // e.g. 0.2888
    return successResponse({
      value: raw,
      formatted: raw !== null ? `${(raw * 100).toFixed(1)}%` : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
