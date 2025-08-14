import { ResponseStatus } from "@/constant";

/**
 * API response interface for image generation endpoint
 */
export interface ImageGeneratorApiResponse {
  status: ResponseStatus;
  imageUrl?: string;
  error?: string;
  statusCode: number;
}
