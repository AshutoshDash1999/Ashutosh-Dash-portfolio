import { NextResponse } from "next/server";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
  data: T,
  options?: { status?: number }
): NextResponse<ApiSuccessResponse<T>> {
  const { status = 200 } = options ?? {};

  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  return NextResponse.json(response, { status });
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  code: string,
  message: string,
  status = 500
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  return NextResponse.json(response, { status });
}

// Common error responses
export const errors = {
  unauthorized: () =>
    errorResponse("UNAUTHORIZED", "Authentication required", 401),

  forbidden: () =>
    errorResponse("FORBIDDEN", "Access denied", 403),

  notFound: (resource = "Resource") =>
    errorResponse("NOT_FOUND", `${resource} not found`, 404),

  badRequest: (message = "Invalid request") =>
    errorResponse("BAD_REQUEST", message, 400),

  methodNotAllowed: (allowed: string[]) =>
    errorResponse(
      "METHOD_NOT_ALLOWED",
      `Method not allowed. Allowed methods: ${allowed.join(", ")}`,
      405
    ),

  internalError: (message = "An unexpected error occurred") =>
    errorResponse("INTERNAL_ERROR", message, 500),

  serviceUnavailable: (service = "Service") =>
    errorResponse("SERVICE_UNAVAILABLE", `${service} is temporarily unavailable`, 503),

  posthogError: (message: string) =>
    errorResponse("POSTHOG_ERROR", message, 502),
} as const;
