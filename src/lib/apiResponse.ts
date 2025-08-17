import { NextResponse } from "next/server";

/**
 * Generic API response type, future-proofed for extensibility.
 */
export type ApiResponse<T = any, M = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
    // For future: add stack trace, error type, etc.
    type?: string;
    stack?: string;
    timestamp?: string;
  };
  meta?: M; // For pagination, extra info, etc.
  statusCode?: number;
  message?: string; // For top-level message (success/failure)
  timestamp?: string;
  requestId?: string;
  // For future: add traceId, debug, warnings, etc.
  [key: string]: any;
};

/**
 * Helper to generate a unique request ID (for tracing, debugging, etc.)
 */
function generateRequestId(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10)
  );
}

/**
 * Success response helper.
 * @param data - The response data.
 * @param status - HTTP status code (default 200).
 * @param meta - Optional metadata (pagination, etc.)
 * @param message - Optional top-level message.
 * @param extra - Any extra fields to include in the response.
 */
export function success<T, M = any>(
  data: T,
  status = 200,
  meta?: M,
  message?: string,
  extra?: Record<string, any>,
): NextResponse {
  const now = new Date().toISOString();
  const body: ApiResponse<T, M> = {
    success: true,
    data,
    meta,
    statusCode: status,
    message,
    timestamp: now,
    requestId: generateRequestId(),
    ...extra,
  };
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Failure response helper.
 * @param message - Error message.
 * @param status - HTTP status code (default 400).
 * @param code - Optional error code.
 * @param details - Optional error details.
 * @param errorType - Optional error type.
 * @param stack - Optional stack trace.
 * @param meta - Optional metadata.
 * @param extra - Any extra fields to include in the response.
 */
export function failure(
  message: string,
  status = 400,
  code?: string,
  details?: any,
  errorType?: string,
  stack?: string,
  meta?: any,
  extra?: Record<string, any>,
): NextResponse {
  const now = new Date().toISOString();
  const body: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
      type: errorType,
      stack,
      timestamp: now,
    },
    meta,
    statusCode: status,
    message,
    timestamp: now,
    requestId: generateRequestId(),
    ...extra,
  };
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
