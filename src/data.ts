import { ImageData } from "./types/style.types";

/**
 * Key features of StyleSnap AI, with concise subheadings for quick scanning.
 */
export const keyPoints = [
  {
    id: "no-signup-required",
    heading: "No Signup Required",
    subHeading: "Create art instantly—no account needed.",
  },
  {
    id: "hundreds-of-styles",
    heading: "100+ Art Styles",
    subHeading: "Pick from a wide range of styles.",
  },
  {
    id: "pro-quality-output",
    heading: "High-Quality JPG",
    subHeading: "Download crisp, clear images.",
  },
];

/**
 * Step-by-step guide, each step short and actionable.
 */
export const stepsContent = [
  {
    id: "upload-step",
    heading: "Step 1: Upload",
    detail: "Choose a photo to start.",
  },
  {
    id: "select-style-step",
    heading: "Step 2: Pick Style",
    detail: "Select your favorite art style.",
  },
  {
    id: "generate-step",
    heading: "Step 3: Generate",
    detail: "Let FluxPro AI create your art.",
  },
  {
    id: "download-step",
    heading: "Step 4: Download/Share",
    detail: "Save or share your new image.",
  },
];

/**
 * SEO-optimized style data for FluxPro (Replicate AI) model.
 */
export const stylesData: ImageData[] = [
  {
    id: "1980s-pop-art",
    title: "1980s Pop Art",
    imageUrl: "/1980s-pop-art.png",
    stylePrompt: `
      Create a vibrant 1980s pop art portrait inspired by Roy Lichtenstein and Andy Warhol. 
      Use bold primary colors, halftone dots, thick black outlines, and strong contrast. 
      Stylize facial features but keep them recognizable and energetic. 
      High-resolution, sharp, and visually striking.
      Negative Prompt: blurry, low quality, distorted, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "anime-art",
    title: "Anime Art",
    imageUrl: "/anime-art.png",
    stylePrompt: `
      Transform the photo into a polished anime illustration inspired by Makoto Shinkai. 
      Use clean lines, expressive eyes, smooth skin, and soft shading. 
      Add vibrant colors and cinematic lighting for a hand-drawn anime look. 
      Crisp, detailed, and appealing.
      Negative Prompt: blurry, low quality, distorted, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "disney-art",
    title: "Disney Art",
    imageUrl: "/disney-art.png",
    stylePrompt: `
      Convert the image to a classic Disney animation style. 
      Use soft features, bright warm colors, painterly shading, and expressive eyes. 
      Add a storybook background with gentle lighting and a magical feel. 
      High-resolution and family-friendly.
      Negative Prompt: blurry, low quality, distorted, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "ghibli-art",
    title: "Ghibli Art",
    imageUrl: "/ghibli-art.png",
    stylePrompt: `
      Render the photo in Studio Ghibli style, inspired by Spirited Away and Howl’s Moving Castle. 
      Use hand-painted backgrounds, soft pastel colors, and a warm glow. 
      Characters should have gentle expressions and clean outlines. 
      Dreamy, high-quality, and charming.
      Negative Prompt: blurry, low quality, distorted, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
];
