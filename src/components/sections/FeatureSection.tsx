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
      className="flex w-full max-w-7xl flex-col items-center justify-center px-6"
      aria-labelledby="feature-section-title"
      role="region"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      <h2
        id="feature-section-title"
        className="selection-primary focus-ring-primary text-text-color text-center text-3xl font-extrabold drop-shadow-lg outline-none md:text-4xl"
        tabIndex={0}
        itemProp="headline"
      >
        One-Click Style Transformer:{" "}
        <span className="text-primary">Turn Photos Into Art</span> Instantly
      </h2>
      <p className="text-text-color mt-3 mb-6 max-w-2xl text-center text-base font-medium md:text-lg">
        Instantly apply trending AI styles like{" "}
        <span className="text-primary font-semibold">Ghibli</span>,{" "}
        <span className="text-primary font-semibold">Pop Art</span>,{" "}
        <span className="text-primary font-semibold">Disney</span>, and{" "}
        <span className="text-primary font-semibold">Anime</span> to your
        photos. No signup needed—just upload and transform with one click!
      </p>
      <p
        className="text-text-color mt-16 mb-3 w-full text-center text-base font-medium md:text-lg"
        aria-label="Feature Images"
      >
        Feature Images
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
            className="bg-card selection-primary focus-ring-primary shadow-primary/20 mb-4 break-inside-avoid rounded-xl p-2 shadow-[0_0_0_1px_var(--tw-shadow-color)] outline-none"
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
