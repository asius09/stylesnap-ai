import React from "react";
import Image from "next/image";

const featureImages = [
  {
    src: "/1980s-pop-art.png",
    alt: "Pop Art AI photo example",
    label: "Pop Art",
    bg: undefined,
  },
  {
    src: "/ghibli-art.png",
    alt: "Ghibli style AI photo",
    label: "Ghibli",
    bg: "#e0f7fa",
  },
  {
    src: "/disney-art.png",
    alt: "Disney cartoon AI photo",
    label: "Disney",
    bg: "#f5f5f5",
  },
  {
    src: "/anime-art.png",
    alt: "Anime style AI photo",
    label: "Anime",
    bg: "#f0eaff",
  },
];

export const FeatureSection = () => {
  return (
    <section
      id="feature-section"
      className="mx-auto my-10 flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6"
      aria-labelledby="feature-section-title"
      role="region"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      <h2
        id="feature-section-title"
        className="selection-primary focus-ring-primary text-text-color mb-2 text-center text-2xl font-bold drop-shadow-lg outline-none md:text-3xl"
        tabIndex={0}
        itemProp="headline"
      >
        Try AI Art Styles Instantly
      </h2>
      <p
        className="selection-primary focus-ring-primary text-text-color/60 mb-8 max-w-2xl text-center text-base outline-none md:text-lg"
        tabIndex={0}
        itemProp="description"
      >
        Upload a photo and see it transformed in seconds. No signup needed.
      </p>
      <div
        className="min-h-[300px] w-full columns-2 gap-4 space-y-4 lg:columns-4"
        role="list"
        aria-label="AI style examples"
        itemProp="hasPart"
      >
        {featureImages.map((img, idx) => (
          <article
            key={img.label}
            className="bg-card selection-primary focus-ring-primary shdaow-primary/50 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg outline-none"
            tabIndex={0}
            role="listitem"
            aria-label={img.label}
            aria-describedby={`feature-desc-${idx}`}
            itemScope
            itemType="https://schema.org/ImageObject"
          >
            <div
              className="selection-primary focus-ring-primary relative w-full overflow-hidden rounded-lg outline-none"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="selection-primary focus-ring-primary h-full w-full object-cover outline-none"
                style={{
                  aspectRatio: "4/5",
                  ...(img.bg ? { background: img.bg } : {}),
                }}
                tabIndex={-1}
                aria-hidden="false"
                itemProp="contentUrl"
                priority={idx === 0}
              />
            </div>
            <span
              id={`feature-desc-${idx}`}
              className="selection-primary focus-ring-primary text-text-color mt-2 block text-center text-sm font-semibold outline-none"
              itemProp="name"
            >
              {img.label}
            </span>
            <meta itemProp="description" content={img.alt} />
          </article>
        ))}
      </div>
    </section>
  );
};
