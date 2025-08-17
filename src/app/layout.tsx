import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer, ToastProvider } from "@/components/Toast";
import { MessageDialogProvider } from "@/components/MessageDialog";
import { PaywallProvider } from "@/components/pay/Paywall";

// ---
// Metadata for StyleSnap AI
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
    url: "https://stylesnap.ai/",
    siteName: "StyleSnap AI",
    images: [
      {
        url: "https://stylesnap.ai/ghibli-art.png",
        width: 1200,
        height: 630,
        alt: "Ghibli Art AI Photo Generator - StyleSnap AI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghibli Art AI Photo Generator | StyleSnap AI",
    description:
      "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!",
    images: ["https://stylesnap.ai/ghibli-art.png"],
    site: "@StyleSnapAI",
  },
  metadataBase: new URL("https://stylesnap.ai/"),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
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
        {/* You can add more meta tags or structured data here if needed */}
      </head>
      <body className="overscroll-none antialiased">
        <ToastProvider>
          <ToastContainer />
          <PaywallProvider>
            <MessageDialogProvider>{children}</MessageDialogProvider>
          </PaywallProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
