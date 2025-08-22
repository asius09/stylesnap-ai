import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer, ToastProvider } from "@/components/Toast";
import { MessageDialogProvider } from "@/components/MessageDialog";
import { PaywallProvider } from "@/components/pay/Paywall";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { KEYWORDS } from "../../meta";

// See: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
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
  keywords: KEYWORDS,
  authors: [
    {
      name: "StyleSnap AI",
      url: "https://stylesnap-ai.vercel.app/",
    },
  ],
  category: "technology",
  referrer: "origin-when-cross-origin",
  creator: "StyleSnap AI",
  publisher: "StyleSnap AI",
  alternates: {
    canonical: "https://stylesnap-ai.vercel.app/",
  },
};

// See: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
