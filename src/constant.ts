// Table name constants
export const USER_TRIALS_TABLE_NAME = "user_trials";
export const TRIAL_ID_LOCAL_STORAGE_KEY = "trialId";
export const DAILY_QUOTA_TABLE_NAME = "daily_quota";
export const REPLICATE_IMAGE_MODEL = "black-forest-labs/flux-kontext-pro";
// Add other table constants here as needed in the future
/**
 * ---- Status Types ----
 */
export enum ResponseStatus {
  SUCCESSFUL = "successful",
  FAILED = "failed",
  NEED_PAYMENT = "NEED PAYMENT",
  NOT_FOUND = "NOT FOUND",
  FREE_LIMIT_REACHED = "FREE LIMIT REACHED",
}

/**
 * ---- Error/Response Messages ----
 */
export enum ErrorMessage {
  MISSING_TRIAL_ID = "Missing trial ID",
  MISSING_PROMPT_OR_IMAGE_URL = "Missing prompt or image_url in request body",
  USER_NOT_FOUND = "User not found",
  INVALID_IMAGE_URL_FORMAT = "Invalid image_url format",
  FREE_TRIAL_ENDED = "Free trial ended",
  FAILED_FETCH_DAILY_QUOTA = "Failed to fetch daily quota",
  DAILY_QUOTA_NOT_FOUND = "Daily quota data not found",
  FREE_LIMIT_REACHED = "Today's free image quota has been reached. You can still generate images for ₹9 each.",
  UNKNOWN_REPLICATE = "Unknown error from Replicate",
  HIGHLIGHT_MODEL = "The model failed due to a highlight (hgihet light) error. Please try a different image or prompt.",
  FAILED_FETCH_IMAGE = "Failed to fetch generated image from Replicate output URL",
  FAILED_UPDATE_DAILY_QUOTA = "Failed to update daily free quota",
  UNKNOWN = "Unknown error",
}
