import { NextResponse } from "next/server";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: { message: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function successResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true as const, data });
}

export function errorResponse(
  error: unknown,
  status = 500,
): NextResponse<ApiError> {
  const message =
    error instanceof Error
      ? error.message
      : "Unexpected error while fetching insight data";
  return NextResponse.json(
    { success: false as const, error: { message } },
    { status },
  );
}
