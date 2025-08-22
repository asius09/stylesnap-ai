/**
 * Uploads an image file to the /api/upload endpoint.
 * @param file - The File object to upload.
 * @returns An object with { path, url, expiresIn } or throws on error.
 */
export async function uploadImage(
  file: File,
): Promise<{ path: string; url: string; expiresIn: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.message || "Failed to upload image");
  }
  return {
    path: data.data?.path,
    url: data.data?.url,
    expiresIn: data.data?.expiresIn ?? 180,
  };
}

/**
 * Removes an image by file name using the /api/upload endpoint.
 * @param fileName - The name of the file to remove.
 * @returns true if deleted, throws on error.
 */
export async function removeImage(fileName: string): Promise<boolean> {
  const response = await fetch("/api/upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.message || "Failed to delete image");
  }

  return !!data.data?.deleted;
}
