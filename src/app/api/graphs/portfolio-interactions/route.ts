import type { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { fetchInsight, parseMultiSeries } from "@/lib/posthog";

export async function GET(): Promise<NextResponse> {
  try {
    const insight = await fetchInsight("AiM5hskS");
    // Returns [{label: "Project Demo", data: [...]}, {label: "Resume", data: [...]}, ...]
    return successResponse(parseMultiSeries(insight));
  } catch (error) {
    return errorResponse(error);
  }
}
