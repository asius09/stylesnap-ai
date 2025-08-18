"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

// Animation config
const TEXT_ANIMATION_INITIAL = { opacity: 0, y: 48, filter: "blur(32px)" };
const TEXT_ANIMATION_VISIBLE = { opacity: 1, y: 0, filter: "blur(0px)" };

const IMAGE_ANIMATION_BASE_DELAY = 0.35;
const IMAGE_ANIMATION_STAGGER = 0.22;

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
      <motion.h2
        id="feature-section-title"
        className="selection-primary focus-ring-primary text-text-color text-center text-3xl font-extrabold drop-shadow-lg outline-none md:text-4xl"
        tabIndex={0}
        itemProp="headline"
        initial={TEXT_ANIMATION_INITIAL}
        whileInView={TEXT_ANIMATION_VISIBLE}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true }}
        aria-label="One-Click Style Transformer: Turn Photos Into Art Instantly"
      >
        One-Click Style Transformer:{" "}
        <span className="text-primary">Turn Photos Into Art</span> Instantly
      </motion.h2>
      <motion.p
        className="text-text-color selection-primary focus-ring-primary mt-3 mb-6 max-w-2xl text-center text-base font-medium md:text-lg"
        initial={TEXT_ANIMATION_INITIAL}
        whileInView={TEXT_ANIMATION_VISIBLE}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
        viewport={{ once: true }}
        tabIndex={0}
        aria-label="Instantly apply trending AI styles like Ghibli, Pop Art, Disney, and Anime to your photos. No signup needed—just upload and transform with one click!"
        itemProp="description"
      >
        Instantly apply trending AI styles like{" "}
        <span className="text-primary font-semibold">Ghibli</span>,{" "}
        <span className="text-primary font-semibold">Pop Art</span>,{" "}
        <span className="text-primary font-semibold">Disney</span>, and{" "}
        <span className="text-primary font-semibold">Anime</span> to your
        photos. No signup needed—just upload and transform with one click!
      </motion.p>
      <motion.p
        className="text-text-color selection-primary focus-ring-primary mt-16 mb-3 w-full text-center text-base font-medium md:text-lg"
        aria-label="Feature Images"
        initial={TEXT_ANIMATION_INITIAL}
        whileInView={TEXT_ANIMATION_VISIBLE}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.26 }}
        viewport={{ once: true }}
        tabIndex={0}
      >
        Feature Images
      </motion.p>
      <div
        className="min-h-[300px] w-full columns-2 gap-4 space-y-4 lg:columns-4"
        role="list"
        aria-label="AI style examples"
        itemProp="hasPart"
      >
        <AnimatePresence>
          {featureImages.map((img, idx) => (
            <motion.figure
              key={img.label}
              className="bg-card selection-primary focus-ring-primary shadow-primary/20 mb-4 break-inside-avoid rounded-xl p-2 shadow-[0_0_0_1px_var(--tw-shadow-color)] backdrop-blur-md outline-none"
              aria-label={`Example: ${img.label} style - ${img.alt}`}
              aria-describedby={`feature-desc-${idx} feature-alt-${idx}`}
              itemScope
              itemType="https://schema.org/ImageObject"
              tabIndex={0}
              initial={{
                opacity: 0,
                y: 80,
                scale: 0.92,
                rotate: -8 + idx * 4,
                filter: "blur(48px)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1.5,
                  type: "spring",
                  bounce: 0.32,
                  delay:
                    IMAGE_ANIMATION_BASE_DELAY + idx * IMAGE_ANIMATION_STAGGER,
                  ease: "easeOut",
                },
              }}
              exit={{
                opacity: 0,
                y: 80,
                scale: 0.92,
                rotate: -8 + idx * 4,
                filter: "blur(48px)",
                transition: { duration: 0.32, ease: "easeIn" },
              }}
              viewport={{ once: true, amount: 0.2 }}
              layout
              role="listitem"
            >
              <motion.div
                className="selection-primary focus-ring-primary relative w-full overflow-hidden rounded-lg outline-none"
                style={{ aspectRatio: "4/5" }}
                initial={false}
                whileHover={{
                  scale: 1.045,
                  boxShadow: "0 8px 32px 0 rgba(80,80,180,0.13)",
                  zIndex: 2,
                  filter: "blur(0px)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                tabIndex={-1}
                aria-hidden="false"
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
              </motion.div>
              <figcaption
                id={`feature-desc-${idx}`}
                className="selection-primary focus-ring-primary text-text-color mt-2 block text-center text-sm font-semibold outline-none"
                itemProp="name"
              >
                {img.label}
              </figcaption>
              <meta itemProp="description" content={img.alt} />
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
