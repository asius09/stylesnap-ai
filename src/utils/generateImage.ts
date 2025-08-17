/**
 * Generate an image using the API and handle errors according to backend status codes.
 * Throws an error object with { message, status, code } for the caller to handle UI (paywall, limit, etc).
 * The returned imageUrl is the direct Replicate AI image URL (do not modify).
 *
 * Error handling is mapped to backend logic in @route.ts:
 * - 201: Created, image generated successfully
 * - 400: Bad request (missing/invalid input)
 * - 403: Free trial ended, payment required, free limit reached, paid credits exhausted
 * - 404: Not found (user/trial/quota)
 * - 451: Replicate payment required (not app user)
 * - 500: Internal/model/Replicate/general error (our server)
 * - 520: Replicate/external API error (unknown error, not payment/model)
 * - 522: Replicate/external model error (e.g. highlight/model error)
 *
 * Error codes: NEED_PAYMENT, FREE_LIMIT_REACHED, PAID_CREDITS_EXHAUSTED, MISSING_TRIAL_ID, MISSING_PROMPT_OR_IMAGE_URL, USER_NOT_FOUND, DAILY_QUOTA_NOT_FOUND, FAILED_FETCH_DAILY_QUOTA, REPLICATE_ERROR, REPLICATE_PAYMENT_REQUIRED, MODEL_ERROR, IMAGE_GENERATOR_ERROR, etc.
 */

type ApiSuccessResponse = {
  success: true;
  data: {
    imageUrl: string;
    [key: string]: unknown;
  };
  message?: string;
  code?: string;
  [key: string]: unknown;
};

type ApiErrorResponse = {
  success?: false;
  code?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export async function generateImage(body: {
  prompt: string;
  imageUrl: string;
  trialId: string;
}): Promise<string> {
  const { prompt, imageUrl, trialId } = body;
  const apiURL = "/api/image-generator";
  const apiConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
      prompt: prompt,
      trialId: trialId,
    }),
  };

  // Log the request
  console.log(
    "%c[generateImage] Request:",
    "color: #1976d2; font-weight: bold;",
    { prompt, imageUrl, trialId },
  );
  console.log(
    "%c[generateImage] API Config:",
    "color: #1976d2; font-weight: bold;",
    apiConfig,
  );

  let response: Response;
  let data: ApiResponse;

  try {
    response = await fetch(apiURL, apiConfig);
    console.log(
      "%c[generateImage] Raw Response:",
      "color: #388e3c; font-weight: bold;",
      response,
    );
  } catch (networkError) {
    console.error(
      "%c[generateImage] Network Error:",
      "color: #d32f2f; font-weight: bold;",
      networkError,
    );
    throw {
      message:
        networkError &&
        typeof networkError === "object" &&
        "message" in networkError
          ? `Network error while generating image: ${(networkError as { message?: string }).message}`
          : "Network error while generating image. Please check your connection.",
      status: 0,
      code: "NETWORK_ERROR",
      networkError,
    };
  }

  try {
    data = (await response.json()) as ApiResponse;
    console.log(
      "%c[generateImage] Parsed Response Data:",
      "color: #388e3c; font-weight: bold;",
      data,
    );
  } catch (parseError) {
    let errorMsg = "Failed to parse server response.";
    if (
      parseError &&
      typeof parseError === "object" &&
      "message" in parseError &&
      typeof (parseError as { message?: string }).message === "string"
    ) {
      errorMsg = `Failed to parse server response: ${(parseError as { message: string }).message}`;
    }
    console.error(
      "%c[generateImage] Parse Error:",
      "color: #d32f2f; font-weight: bold;",
      parseError,
    );
    throw {
      message: errorMsg,
      status: response?.status ?? 0,
      code: "INVALID_RESPONSE",
      parseError,
    };
  }

  // Handle success (201)
  if (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as ApiSuccessResponse).success === true &&
    "data" in data &&
    (data as ApiSuccessResponse).data &&
    typeof (data as ApiSuccessResponse).data === "object" &&
    "imageUrl" in (data as ApiSuccessResponse).data &&
    typeof (data as ApiSuccessResponse).data.imageUrl === "string"
  ) {
    if (response.status === 201) {
      console.log(
        "%c[generateImage] Success! Image URL:",
        "color: #388e3c; font-weight: bold;",
        (data as ApiSuccessResponse).data.imageUrl,
      );
      return (data as ApiSuccessResponse).data.imageUrl;
    }
  }

  // Error handling based on backend status codes and error codes from @route.ts
  let errorMessage = "Failed to generate image. Please try again.";
  let errorCode = "UNKNOWN_ERROR";

  // Prefer backend error message/code if available
  if (typeof data === "object" && data !== null) {
    if ("code" in data && typeof data.code === "string") errorCode = data.code;
    if ("message" in data && typeof data.message === "string")
      errorMessage = data.message;
    else if ("error" in data && typeof data.error === "string")
      errorMessage = data.error;
  }

  // Log error code and message before mapping
  console.warn(
    "%c[generateImage] Error Code/Message from backend:",
    "color: #fbc02d; font-weight: bold;",
    { errorCode, errorMessage, status: response.status },
  );

  // Map backend error codes/status to user-friendly messages
  switch (errorCode) {
    case "MISSING_TRIAL_ID":
      errorMessage = "Missing trial ID. Please refresh and try again.";
      break;
    case "MISSING_PROMPT_OR_IMAGE_URL":
      errorMessage =
        "Missing prompt or image. Please provide both and try again.";
      break;
    case "USER_NOT_FOUND":
      errorMessage = "User not found. Please refresh and try again.";
      break;
    case "DAILY_QUOTA_NOT_FOUND":
      errorMessage = "Daily quota not found. Please try again later.";
      break;
    case "FAILED_FETCH_DAILY_QUOTA":
      errorMessage = "Failed to fetch daily quota. Please try again later.";
      break;
    case "FREE_LIMIT_REACHED":
      errorMessage =
        "You have reached your free image generation limit for today. Please upgrade to continue.";
      break;
    case "NEED_PAYMENT":
      errorMessage =
        "Your free trial has ended. Please proceed to payment to generate more images.";
      break;
    case "PAID_CREDITS_EXHAUSTED":
      errorMessage =
        "You have used all your paid credits. Please purchase more credits to continue.";
      break;
    // Don't show Replicate payment/internal errors to frontend users
    case "REPLICATE_PAYMENT_REQUIRED":
      errorMessage =
        "There was a problem with the AI image generation service. Please try again later or contact support if the issue persists.";
      break;
    case "REPLICATE_ERROR":
      errorMessage =
        "There was a problem with the AI image generation service. Please try again later or contact support if the issue persists.";
      break;
      break;
    case "MODEL_ERROR":
      errorMessage =
        "The AI model could not generate your image. Please try a different image or prompt.";
      break;
    case "IMAGE_GENERATOR_ERROR":
      errorMessage =
        "An error occurred while generating the image. Please try again.";
      break;
    default:
      // Fallback to status code if no backend code
      switch (response.status) {
        case 400:
          errorMessage =
            "Invalid request. Please check your input and try again.";
          errorCode = "BAD_REQUEST";
          break;
        case 403:
          errorMessage =
            "You are not allowed to generate more images. Please upgrade or try again later.";
          errorCode = "FORBIDDEN";
          break;
        case 404:
          errorMessage = "Resource not found. Please refresh and try again.";
          errorCode = "NOT_FOUND";
          break;
        case 451:
          errorMessage =
            "Replicate API payment required. Please check your Replicate account or contact support.";
          errorCode = "REPLICATE_PAYMENT_REQUIRED";
          break;
        case 500:
          errorMessage = "A server error occurred. Please try again later.";
          errorCode = "SERVER_ERROR";
          break;
        case 520:
          errorMessage =
            "Upstream error from Replicate or external API. Please try again in a moment.";
          errorCode = "UPSTREAM_ERROR";
          break;
        case 522:
          errorMessage =
            "The AI model could not generate your image. Please try a different image or prompt.";
          errorCode = "MODEL_ERROR";
          break;
      }
  }

  // Log the final error that will be thrown
  console.error(
    "%c[generateImage] Throwing Error:",
    "color: #d32f2f; font-weight: bold;",
    {
      message: errorMessage,
      status: response.status,
      code: errorCode,
      data,
    },
  );

  throw {
    message: errorMessage,
    status: response.status,
    code: errorCode,
  };
}
