import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { StyleCard } from "./StyleCard";
import { ImageData } from "@/types/style.types";
import { stylesData } from "@/data";

export type StyleSelectionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedStyleId?: string;
  onSelect: (style: ImageData) => void;
  onReplace: (style: ImageData) => void;
};

export function StyleSelectionDialog({
  isOpen,
  onClose,
  selectedStyleId,
  onSelect,
  onReplace,
}: StyleSelectionDialogProps) {
  // Always use styles from @data.ts (stylesData) and @style.types.ts (ImageData)
  const handleSelect = (style: ImageData, isSelected: boolean) => {
    if (isSelected) {
      onReplace(style);
    } else {
      onSelect(style);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex h-full w-full items-end justify-center overflow-hidden bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 64, opacity: 0, filter: "blur(10px)", scale: 1 }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{
              y: 64,
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.96,
              transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
            }}
            transition={{
              type: "tween",
              duration: 0.38,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="border-primary/30 bg-background/80 relative flex h-[90vh] w-full items-start justify-center overflow-y-auto rounded-t-2xl rounded-b-none border p-10 text-white shadow-2xl backdrop-blur-xl md:max-w-6xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glossy overlay effect */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 100%)",
                WebkitMaskImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
                maskImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
                borderRadius: "1rem",
              }}
            />
            {/* Close Button */}
            <motion.button
              className="hover:bg-primary/70 absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-white/40 p-2 shadow-sm transition-colors hover:text-white md:top-6 md:right-6"
              onClick={onClose}
              aria-label="Close"
              type="button"
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.7,
                opacity: 0,
                transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
                duration: 0.22,
              }}
              style={{ willChange: "transform, opacity" }}
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>

            {/* Dialog Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="selection:bg-primary/50 mb-2 text-xl font-bold text-white drop-shadow selection:text-white sm:text-2xl">
                Select Your Style
              </h2>
              <p className="selection:bg-primary/40 mb-8 text-sm text-white/80 selection:text-white sm:text-base">
                Choose a style to apply to your photo. You can replace your
                current selection at any time.
              </p>

              {/* Grid of Styles */}
              <div className="mx-auto grid w-full grid-cols-1 place-content-center items-center justify-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {stylesData.map((style, idx) => {
                  const isSelected = style.id === selectedStyleId;
                  return (
                    <div
                      className="flex items-center justify-center"
                      key={style.id}
                    >
                      <StyleCard
                        style={{
                          id: style.id,
                          title: style.title,
                          imageUrl: style.imageUrl,
                        }}
                        onClick={() => handleSelect(style, isSelected)}
                        index={idx}
                        disabled={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
