"use client";

import { AppHeader } from "@/components/AppHeader";
import { useTrialId } from "@/hooks/useTrialId";
import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/Footer";
import { KeyPoints } from "@/components/sections/KeyPoints";
import { StepsSection } from "@/components/sections/StepsSection";
import { ButtonCTASection } from "@/components/sections/ButtonCTASection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import Head from "next/head";

export default function UploadPage() {
  const { trialId, freeUsed } = useTrialId();

  // SEO meta data - Focus on Ghibli Art as trending topic
  const title =
    "Ghibli Art AI Photo Generator - Instantly Turn Photos Into Ghibli Art | StyleSnap AI";
  const description =
    "Transform your photos into magical Ghibli-style artwork instantly with StyleSnap AI. No signup required. Try the trending Ghibli art photo style transfer, upload your photo, and download high-quality Ghibli-inspired images for free!";
  const url = "https://stylesnap.ai/";
  const image = "https://stylesnap.ai/ghibli-art.png"; // Use Ghibli art OG image

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="StyleSnap AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={url} />
        {/* Schema.org JSON-LD for SEO with Ghibli Art focus */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StyleSnap AI",
              url: url,
              description: description,
              image: image,
              about: {
                "@type": "Thing",
                name: "Ghibli Art",
                description:
                  "Ghibli art style photo generator, trending AI art transformation.",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${url}?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </Head>
      <main
        id="upload-page"
        className="from-background via-primary/20 to-background relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* Global glossy overlay */}
        <div
          aria-hidden="true"
          className="background-glossy-effect pointer-events-none absolute inset-0 z-[1]"
        />
        <AppHeader freeUsed={!!freeUsed} />

        {/* Hero Section */}
        <HeroSection />

        {/* Key Points */}
        <KeyPoints />

        {/* Steps */}
        <StepsSection />

        {/* Start Creating Now Button */}
        <ButtonCTASection />

        {/* Feature Section */}
        <FeatureSection />

        <Footer />
      </main>
    </>
  );
}
