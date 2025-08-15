import React, { useRef, useEffect } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableEls = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter((el) => !el.hasAttribute("disabled"));

    if (focusableEls.length > 0) {
      (closeButtonRef.current || focusableEls[0]).focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    }

    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
          aria-modal="true"
          role="dialog"
          aria-label="Style selection dialog"
        >
          <motion.div
            ref={dialogRef}
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
            className="border-primary/30 bg-background/80 relative flex h-[90vh] w-full items-start justify-center overflow-y-auto rounded-t-2xl rounded-b-none border p-10 text-text-color shadow-2xl backdrop-blur-xl md:max-w-6xl"
            role="document"
            aria-labelledby="style-dialog-title"
            aria-describedby="style-dialog-desc"
            tabIndex={-1}
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
            <button
              ref={closeButtonRef}
              className="hover:bg-primary/70 focus:ring-primary absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-white/40 p-2 shadow-sm transition-colors hover:text-text-color focus:ring-2 focus:outline-none md:top-6 md:right-6"
              onClick={onClose}
              aria-label="Close style selection dialog"
              type="button"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Dialog Content */}
            <div className="relative z-10 flex w-full flex-col items-center text-center">
              <h2
                className="selection-primary focus:ring-primary focus-ring-primary mb-2 text-xl font-bold text-text-color drop-shadow sm:text-2xl"
                id="style-dialog-title"
                tabIndex={0}
              >
                Pick a style
              </h2>
              <p
                className="selection-primary focus-ring-primary mb-8 text-sm text-text-color/80 sm:text-base"
                id="style-dialog-desc"
                tabIndex={0}
              >
                Choose a style
              </p>

              {/* Grid of Styles */}
              <ul
                className="mx-auto grid w-full grid-cols-1 place-content-center items-center justify-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                aria-label="Available styles"
              >
                {stylesData.map((style, idx) => {
                  const isSelected = style.id === selectedStyleId;
                  return (
                    <li
                      className="flex items-center justify-center selection-primary"
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
                        selected={isSelected}
                        aria-pressed={isSelected}
                        aria-label={
                          isSelected
                            ? `${style.title}, selected`
                            : `${style.title}, select`
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
