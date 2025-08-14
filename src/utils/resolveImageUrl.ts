import { ErrorMessage } from "@/constant";
import { readFile } from "fs/promises";
import { join } from "path";
export async function resolveImageUrl(image_url: string): Promise<string> {
  if (image_url.startsWith("/")) {
    // Local file path, read and encode as base64
    const filePath = join(process.cwd(), "public", image_url);
    const data = (await readFile(filePath)).toString("base64");
    return `data:application/octet-stream;base64,${data}`;
  } else if (
    image_url.startsWith("http://") ||
    image_url.startsWith("https://")
  ) {
    // Remote URL, use as is
    return image_url;
  } else {
    throw new Error(ErrorMessage.INVALID_IMAGE_URL_FORMAT);
  }
}
