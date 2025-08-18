export interface ImageStyle {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  stylePrompt: string;
}

/**
 * Key features of StyleSnap AI, with concise subheadings for quick scanning.
 */
export const keyPoints = [
  {
    id: "no-signup-required",
    heading: "No Signup Required",
    subHeading: "Create art instantly.",
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
 * Prompts are engineered for precise style transfer: only the visual style changes,
 * all original subjects, composition, and details are strictly preserved.
 */
export const stylesData: ImageStyle[] = [
  {
    id: "1980s-pop-art",
    title: "1980s Pop Art",
    category: "Pop Art",
    imageUrl: "/1980s-pop-art.png",
    stylePrompt: `
      Change the entire image to the style of 1980s pop art, inspired by Roy Lichtenstein and Andy Warhol. 
      Use bold primary colors, halftone dots, thick black outlines, and strong contrast. 
      Maintain the original composition, camera angle, framing, and all subjects and background exactly as in the input image. 
      Preserve all facial features, body positions, and background elements—do not add, remove, or alter any content except for the style. 
      The result should be high-resolution, sharp, and visually striking in pop art style.
      Negative Prompt: do not add or remove objects, do not change facial features, do not alter the background, no blurry, low quality, distortion, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "anime-art",
    title: "Anime Art",
    category: "Anime",
    imageUrl: "/anime-art.png",
    stylePrompt: `
      Change the image to a polished anime illustration in the style of Makoto Shinkai. 
      Use clean lines, expressive eyes, smooth skin, soft shading, and vibrant colors with cinematic lighting. 
      Keep the original composition, camera angle, framing, and all people, objects, and background elements exactly as in the input. 
      Do not change facial features, body proportions, or the scene layout—only apply the anime style. 
      The result should be crisp, detailed, and visually appealing, with a hand-drawn anime look.
      Negative Prompt: do not add or remove elements, do not change the background, no blurry, low quality, distortion, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "disney-art",
    title: "Disney Art",
    category: "Disney",
    imageUrl: "/disney-art.png",
    stylePrompt: `
      Change the image to classic Disney animation style, using soft features, bright warm colors, painterly shading, and expressive eyes. 
      Maintain the original composition, camera angle, framing, all subjects, and background exactly as in the input image. 
      Do not alter facial features, body positions, or the background—only convert the style to Disney animation. 
      Add a gentle, magical feel with subtle storybook lighting, but keep all original elements in place.
      Negative Prompt: do not add or remove objects, do not change the background, no blurry, low quality, distortion, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "ghibli-art",
    title: "Ghibli Art",
    category: "Ghibli",
    imageUrl: "/ghibli-art.png",
    stylePrompt: `
      Change the image to Studio Ghibli style, inspired by Spirited Away and Howl’s Moving Castle. 
      Use hand-painted backgrounds, soft pastel colors, a warm glow, and gentle expressions with clean outlines. 
      Strictly preserve the original composition, camera angle, framing, all people, objects, and background details—do not add, remove, or change anything except the artistic style. 
      The result should be dreamy, high-quality, and charming, with all original elements intact.
      Negative Prompt: do not add or remove elements, do not change the background, no blurry, low quality, distortion, extra limbs, watermark, text, signature, logo, duplicate, mutation.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "pop-surrealism",
    title: "Pop Surrealism",
    category: "Pop Surrealism",
    imageUrl: "/pop-surrealism.png",
    stylePrompt: `
      Change the image to pop surrealism style, blending whimsical characters, neon accents, and playful absurdity. 
      Keep the original composition, camera angle, framing, all subjects, and background exactly as in the input—do not add or remove any elements. 
      Only the artistic style should change to pop surrealism, with vibrant, imaginative, and emotionally surreal qualities.
      Negative Prompt: do not change the layout, do not add or remove objects, no blurry, low quality, blurry textures, watermark.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "hyperreal-robots",
    title: "Hyperreal Futuristic Robots",
    category: "Futuristic & Sci-Fi",
    imageUrl: "/retro-robots.png",
    stylePrompt: `
      Change the image to a hyper-realistic futuristic robot style, with intricate mechanical details, advanced technology, and lifelike metallic textures. 
      Use dramatic lighting, sharp focus, and a cinematic atmosphere. 
      Maintain the original composition, camera angle, framing, all subjects, and background—do not add, remove, or change any elements except for converting them to a hyperreal robot style. 
      The result should feel cutting-edge, visually stunning, and realistic, with all original positions and features preserved.
      Negative Prompt: do not add or remove objects, do not change the background, no cartoonish, low quality, blurry, watermark, text, logo, extra limbs, distortion.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    id: "textured-portrait",
    title: "Textured Illustrated Portrait",
    category: "Mixed Media / Collage",
    imageUrl: "/textured-portrait.png",
    stylePrompt: `
      Change the image to a stylized portrait with layered textures, hand-drawn strokes, and a collage feel using vintage paper or fabric textures. 
      Keep the original composition, camera angle, framing, all facial features, and background elements exactly as in the input—do not add, remove, or change any content except for the artistic style. 
      The result should be warm, tactile, and artistic, with all original details preserved.
      Negative Prompt: do not change the layout, do not add or remove objects, no flat color, low detail, glitch, watermark.
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
];
