export async function generateImage(body: {
  prompt: string;
  imageUrl: string;
  trialId: string;
}) {
  try {
    const { prompt, imageUrl, trialId } = body;
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
    const response = await fetch(apiURL, apiConfig);
    const data = await response.json();
    if (data && data.success && data.data?.imageUrl) {
      const resultUrl = data.data.imageUrl.startsWith("/")
        ? data.data.imageUrl
        : `/${data.data.imageUrl}`;
      return resultUrl;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("An unknown error occurred while generating the image.");
    }
  }
}
