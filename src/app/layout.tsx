import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer, ToastProvider } from "@/components/Toast";
import { MessageDialogProvider } from "@/components/MessageDialog";
import { PaywallProvider } from "@/components/pay/Paywall";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ---
// Enhanced Metadata for StyleSnap AI
// See @README.md and @page.tsx for app description and SEO focus
// ---

export const metadata: Metadata = {
  title: "Ghibli Art AI Photo Generator | StyleSnap AI",
  description:
    "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!",
  openGraph: {
    title: "Ghibli Art AI Photo Generator | StyleSnap AI",
    description:
      "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!",
    url: "https://stylesnap-ai.vercel.app/",
    siteName: "StyleSnap AI",
    images: [
      {
        url: "https://stylesnap-ai.vercel.app/app.png",
        width: 1200,
        height: 630,
        alt: "Ghibli Art AI Photo Generator - StyleSnap AI",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghibli Art AI Photo Generator | StyleSnap AI",
    description:
      "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!",
    images: ["https://stylesnap-ai.vercel.app/app.png"],
    site: "@StyleSnapAI",
    creator: "@StyleSnapAI",
  },
  metadataBase: new URL("https://stylesnap-ai.vercel.app/"),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  applicationName: "StyleSnap AI",
  generator: "Next.js",
  keywords: [
    // Brand and name related
    "StyleSnap AI",
    "Snaptyle",
    "Style Snap",
    "Snaptyle AI",
    "StyleSnapAI",
    "Snaptyle Art",
    "Snaptyle Generator",
    "Snaptyle Photo",
    "Snaptyle Style",
    "Snaptyle Anime",
    "Snaptyle Ghibli",
    "Snaptyle AI Generator",
    "Snaptyle AI Art",
    "Snaptyle AI Photo",
    "Snaptyle AI Style",
    "Snaptyle AI Editor",
    "Snaptyle AI Download",
    "Snaptyle AI Instagram",
    "Snaptyle AI Twitter",
    "Snaptyle AI Facebook",
    "Snaptyle AI Social Media",
    // Ghibli and Studio Ghibli
    "Ghibli Art",
    "Ghibli Style",
    "Ghibli AI",
    "Ghibli AI Generator",
    "Ghibli Art Generator",
    "Ghibli Style Transfer",
    "Ghibli Photo",
    "Ghibli Art Online",
    "Ghibli Art Free",
    "Ghibli Art Download",
    "Ghibli Art Instagram",
    "Ghibli Art Twitter",
    "Ghibli Art LinkedIn",
    "Ghibli Art WhatsApp",
    "Ghibli Art Facebook",
    "Ghibli Art Social Media",
    "Studio Ghibli",
    "Studio Ghibli Style",
    "Studio Ghibli Art",
    "Studio Ghibli AI",
    // General AI and photo
    "AI Photo Generator",
    "AI Art",
    "AI Image Generator",
    "AI Ghibli",
    "AI Ghibli Art",
    "AI Ghibli Photo",
    "AI Anime",
    "AI Anime Art",
    "AI Anime Generator",
    "AI Style Transfer",
    "AI Style Generator",
    "AI Art Generator",
    "AI Photo Editor",
    "AI Portrait Generator",
    "AI Portrait",
    "AI Drawing",
    "AI Illustration",
    "AI Cartoon",
    "AI Cartoon Generator",
    "AI Anime Portrait",
    "AI Anime Selfie",
    "AI Anime Filter",
    "AI Anime Style",
    "AI Anime Photo",
    "AI Anime Face",
    "AI Anime Maker",
    "AI Anime Avatar",
    "AI Anime Character",
    "AI Anime Selfie Generator",
    "AI Anime Art Generator",
    "AI Anime Image",
    "AI Anime Transformation",
    "AI Anime Conversion",
    "AI Anime Edit",
    "AI Anime Download",
    // Trending anime styles
    "Anime Style",
    "Anime Art",
    "Anime Photo",
    "Anime Generator",
    "Anime Filter",
    "Anime Portrait",
    "Anime Avatar",
    "Anime Character",
    "Anime Drawing",
    "Anime Illustration",
    "Anime Selfie",
    "Anime Face",
    "Anime Maker",
    "Anime Image",
    "Anime Transformation",
    "Anime Conversion",
    "Anime Edit",
    "Anime Download",
    "Anime Online",
    "Anime Free",
    "Anime Instagram",
    "Anime Twitter",
    "Anime Facebook",
    "Anime Social Media",
    // Trending anime and cartoon styles
    "One Piece Style",
    "Naruto Style",
    "Demon Slayer Style",
    "Jujutsu Kaisen Style",
    "Attack on Titan Style",
    "Chainsaw Man Style",
    "Spy x Family Style",
    "My Hero Academia Style",
    "Dragon Ball Style",
    "Sailor Moon Style",
    "Pokémon Style",
    "Bleach Style",
    "Death Note Style",
    "Mob Psycho 100 Style",
    "Tokyo Revengers Style",
    "Blue Lock Style",
    "Haikyuu Style",
    "JoJo Style",
    "JoJo's Bizarre Adventure Style",
    "Violet Evergarden Style",
    "Your Name Style",
    "Weathering With You Style",
    "Kimi no Na wa Style",
    "Suzume Style",
    "Howl's Moving Castle Style",
    "Totoro Style",
    "Princess Mononoke Style",
    "Spirited Away Style",
    "Kiki's Delivery Service Style",
    "Ponyo Style",
    "Castle in the Sky Style",
    "Akira Style",
    "Cyberpunk Anime Style",
    "Manga Style",
    "Manga Art",
    "Manga Generator",
    "Manga Photo",
    "Manga Portrait",
    "Manga Avatar",
    "Manga Character",
    "Manga Drawing",
    "Manga Illustration",
    "Cartoon Style",
    "Cartoon Art",
    "Cartoon Generator",
    "Cartoon Photo",
    "Cartoon Portrait",
    "Cartoon Avatar",
    "Cartoon Character",
    "Cartoon Drawing",
    "Cartoon Illustration",
    // General style and photo editing
    "Style Transfer",
    "Photo to Art",
    "Photo to Anime",
    "Photo to Cartoon",
    "Photo to Ghibli",
    "Photo to Drawing",
    "Photo to Illustration",
    "Photo to Painting",
    "Photo to Portrait",
    "Photo to Manga",
    "Photo to Avatar",
    "Photo Editor",
    "Photo Art Generator",
    "Photo Style Generator",
    "Photo Style Transfer",
    "Photo Style AI",
    "Photo Style Online",
    "Photo Style Free",
    "Photo Style Download",
    "Photo Style Instagram",
    "Photo Style Twitter",
    "Photo Style Facebook",
    "Photo Style Social Media",
    // Miscellaneous
    "Trending Anime Style",
    "Trending AI Art",
    "Trending AI Style",
    "Trending Anime Generator",
    "Trending Ghibli Style",
    "Trending Anime Art",
    "Trending Anime Photo",
    "Trending Anime Portrait",
    "Trending Anime Avatar",
    "Trending Anime Character",
    "Trending Anime Drawing",
    "Trending Anime Illustration",
    "Trending Anime Selfie",
    "Trending Anime Face",
    "Trending Anime Maker",
    "Trending Anime Image",
    "Trending Anime Transformation",
    "Trending Anime Conversion",
    "Trending Anime Edit",
    "Trending Anime Download",
    "Trending Anime Online",
    "Trending Anime Free",
    "Trending Anime Instagram",
    "Trending Anime Twitter",
    "Trending Anime Facebook",
    "Trending Anime Social Media",
  ],
  authors: [
    {
      name: "StyleSnap AI",
      url: "https://stylesnap-ai.vercel.app/",
    },
  ],
  category: "technology",
  themeColor: "#f7f5f2",
  colorScheme: "light",
  referrer: "origin-when-cross-origin",
  creator: "StyleSnap AI",
  publisher: "StyleSnap AI",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  alternates: {
    canonical: "https://stylesnap-ai.vercel.app/",
  },
  // You can add more meta tags as needed for SEO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and app icon */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        {/* Social preview meta tags for all major platforms */}
        {/* Open Graph (Facebook, LinkedIn, WhatsApp, etc.) */}
        <meta
          property="og:title"
          content="Ghibli Art AI Photo Generator | StyleSnap AI"
        />
        <meta
          property="og:description"
          content="Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!"
        />
        <meta property="og:url" content="https://stylesnap-ai.vercel.app/" />
        <meta property="og:site_name" content="StyleSnap AI" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:image"
          content="https://stylesnap-ai.vercel.app/app.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta
          property="og:image:alt"
          content="Ghibli Art AI Photo Generator - StyleSnap AI"
        />
        {/* Twitter/X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Ghibli Art AI Photo Generator | StyleSnap AI"
        />
        <meta
          name="twitter:description"
          content="Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!"
        />
        <meta
          name="twitter:image"
          content="https://stylesnap-ai.vercel.app/app.png"
        />
        <meta name="twitter:site" content="@StyleSnapAI" />
        <meta name="twitter:creator" content="@StyleSnapAI" />
        {/* Instagram uses og:image and og:description */}
        {/* LinkedIn uses og:image, og:title, og:description */}
        {/* WhatsApp uses og:image, og:description */}
        {/* Fallback for other platforms */}
        <meta name="image" content="https://stylesnap-ai.vercel.app/app.png" />
        {/* Additional SEO and app meta tags */}
        <meta name="application-name" content="StyleSnap AI" />
        <meta name="generator" content="Next.js" />
        <meta
          name="keywords"
          content="Ghibli Art, AI Photo Generator, Style Transfer, AI Art, Anime Photo, Ghibli Style, Photo to Art, AI Ghibli, StyleSnap AI, Ghibli AI, Anime AI, Photo Editor, AI Image Generator, Ghibli Photo, Ghibli AI Generator, Ghibli Art Generator, Ghibli Style Transfer, AI Ghibli Art, AI Ghibli Photo, Ghibli Art Online, Ghibli Art Free, Ghibli Art Download, Ghibli Art Instagram, Ghibli Art Twitter, Ghibli Art LinkedIn, Ghibli Art WhatsApp, Ghibli Art Facebook, Ghibli Art Social Media"
        />
        <meta name="author" content="StyleSnap AI" />
        <meta name="category" content="technology" />
        <meta name="theme-color" content="#f7f5f2" />
        <meta name="color-scheme" content="dark" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="creator" content="StyleSnap AI" />
        <meta name="publisher" content="StyleSnap AI" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" href="https://stylesnap-ai.vercel.app/" />
        {/* Robots and Googlebot */}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* You can add more meta tags or structured data here if needed */}
      </head>
      <body className="overscroll-none antialiased">
        <ToastProvider>
          <ToastContainer />
          <PaywallProvider>
            <MessageDialogProvider>
              {children}
              <SpeedInsights />
            </MessageDialogProvider>
          </PaywallProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
