export async function generateImage(body: {
  prompt: string;
  imageUrl: string;
  trialId: string;
}) {
  try {
    const { prompt, imageUrl, trialId } = body;
    console.log("[generateImage] Called with:", { prompt, imageUrl });
    const apiURL = "/api/image-generator";
    const apiConfig = {
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
    console.log("[generateImage] Fetching:", apiURL, apiConfig);
    const response = await fetch(apiURL, apiConfig);
    console.log("[generateImage] Response status:", response.status);
    const data = await response.json();
    console.log("[generateImage] Response data:", data);
    if (
      data &&
      data.statusCode === 200 &&
      data.status === "successful" &&
      data.imageUrl
    ) {
      const resultUrl = data.imageUrl.startsWith("/")
        ? data.imageUrl
        : `/${data.imageUrl}`;
      console.log("[generateImage] Returning imageUrl:", resultUrl);
      return resultUrl;
    } else {
      console.warn(
        "[generateImage] Unexpected response format or error:",
        data,
      );
    }
  } catch (error: unknown) {
    console.error("[generateImage] Error occurred:", error);
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("An unknown error occurred while generating the image.");
    }
  }
}
