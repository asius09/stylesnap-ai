import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer, ToastProvider } from "@/components/Toast";
import { MessageDialogProvider } from "@/components/MessageDialog";
import { PaywallProvider } from "@/components/pay/Paywall";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { KEYWORDS } from "../../meta";
export const metadata: Metadata = {
  title: "Stylesnap AI | Ghibli Art AI Photo Generator",
  description:
    "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!",
  openGraph: {
    title: "Stylesnap AI | Ghibli Art AI Photo Generator",
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
      {
        url: "https://stylesnap-ai.vercel.app/icon-192.png",
        width: 192,
        height: 192,
        alt: "StyleSnap AI App Icon 192x192",
        type: "image/png",
      },
      {
        url: "https://stylesnap-ai.vercel.app/icon-512.png",
        width: 512,
        height: 512,
        alt: "StyleSnap AI App Icon 512x512",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stylesnap AI | Ghibli Art AI Photo Generator",
    description:
      "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!",
    images: [
      "https://stylesnap-ai.vercel.app/app.png",
      "https://stylesnap-ai.vercel.app/icon-192.png",
      "https://stylesnap-ai.vercel.app/icon-512.png",
    ],
    site: "@StyleSnapAI",
    creator: "@StyleSnapAI",
  },
  metadataBase: new URL("https://stylesnap-ai.vercel.app/"),
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logo.svg",
    apple: [
      { url: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // PWA maskable icon
    other: [{ url: "/icon-192.png", rel: "mask-icon", color: "#000000" }],
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
  keywords: KEYWORDS,
  authors: [
    {
      name: "StyleSnap AI",
      url: "https://stylesnap-ai.vercel.app/",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <PaywallProvider>
            <MessageDialogProvider>
              <ToastContainer />
              {children}
              <SpeedInsights />
            </MessageDialogProvider>
          </PaywallProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
