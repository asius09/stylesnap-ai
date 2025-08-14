import { ImageData } from "./types/style.types";

export const keyPoints = [
  {
    id: "no-signup-required",
    heading: "No signup required",
    subHeading: "just upload & generate",
  },
  {
    id: "100s-presets-style",
    heading: "100s presets style",
    subHeading: "One click style convert",
  },
  {
    id: "high-quality-jpg",
    heading: "High Quality JPG",
    subHeading: "High quality every time",
  },
];

export const stepsContent = [
  {
    id: "upload-step",
    heading: "Upload Image",
    detail: "Upload any image from your device.",
  },
  {
    id: "select-style-step",
    heading: "Pick Style",
    detail: "Select a style to apply.",
  },
  {
    id: "generate-step",
    heading: "Generate",
    detail: "Create your new image.",
  },
  {
    id: "download-step",
    heading: "Download & Share",
    detail: "Save or share instantly.",
  },
];

export const stylesData: ImageData[] = [
  {
    id: "1980s-pop-art",
    title: "1980s Pop Art",
    imageUrl: "/1980s-pop-art.png",
    stylePrompt:
      "Convert this image into a striking 1980s pop art portrait, inspired by Roy Lichtenstein and Andy Warhol. Use bold primary colors, halftone dot shading, thick black outlines, and strong graphic contrast. Keep facial features stylized but recognizable, with a playful, energetic feel.",
  },
  {
    id: "anime-art",
    title: "Anime Art",
    imageUrl: "/anime-art.png",
    stylePrompt:
      "Transform this image into a polished anime illustration in the style of Makoto Shinkai. Use clean sharp linework, large expressive eyes with detailed irises, smooth skin tones, and soft gradient shading. Add vibrant colors and cinematic lighting for a high-quality, hand-drawn anime feel.",
  },
  {
    id: "disney-art",
    title: "Disney Art",
    imageUrl: "/disney-art.png",
    stylePrompt:
      "Convert this image into a classic Disney animation style, inspired by the 1990s Disney renaissance. Use soft rounded features, bright yet warm colors, subtle painterly shading, and expressive eyes. Give the background a storybook-like charm with gentle lighting and a magical atmosphere.",
  },
  {
    id: "ghibli-art",
    title: "Ghibli Art",
    imageUrl: "/ghibli-art.png",
    stylePrompt:
      "Transform this image into a Studio Ghibli-style illustration, inspired by films like Spirited Away and Howl’s Moving Castle. Use hand-painted backgrounds with lush natural details, soft pastel colors, and a warm nostalgic glow. Characters should have gentle expressions, clean outlines, and natural proportions.",
  },
];
