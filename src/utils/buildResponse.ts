import { ResponseStatus } from "@/constant";
import { ImageGeneratorApiResponse } from "@/types/api.type";
import { NextResponse } from "next/server";

/**
 * Helper to build a NextResponse with a consistent API response structure
 *
 * NOTE: This function is a good candidate to move to a helper folder, e.g. `src/utils/api/buildResponse.ts`
 */
export function buildResponse(
  status: ResponseStatus,
  statusCode: number,
  error?: string,
  imageUrl?: string,
) {
  const res: ImageGeneratorApiResponse = {
    status,
    statusCode,
    ...(error ? { error } : {}),
    ...(imageUrl ? { imageUrl } : {}),
  };
  return NextResponse.json(res, { status: statusCode });
}
