"use client";
import { motion } from "motion/react";
import { SocialIcon } from "./SocialIcon";

export function SocialShare() {
  return (
    <motion.div
      id="social-share-links"
      className="mt-3 flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <p
        id="cta-text"
        className="selection-primary text-base font-semibold text-text-color"
      >
        Share On :-
      </p>
      <div className="selection-primary flex w-full items-center justify-center gap-4">
        <SocialIcon name="instagram" />
        <SocialIcon name="discord" />
        <SocialIcon name="reddit" />
        <SocialIcon name="x" />
        <SocialIcon name="whatsapp" />
      </div>
    </motion.div>
  );
}
