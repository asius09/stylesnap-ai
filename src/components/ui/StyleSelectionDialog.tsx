"use client";
import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { StyleCard } from "./StyleCard";
import { ImageData } from "@/types/style.types";
import { stylesData } from "@/data";

export type StyleSelectionDialogProps = {
  isOpen?: boolean;
  onClose: () => void;
  selectedStyleId?: string;
  onSelect: (style: ImageData) => void;
  onReplace: (style: ImageData) => void;
  onRemove: () => void;
};

export type StyleSelectionDialogHandle = {
  openSelectionDialog: () => void;
};

export const StyleSelectionDialog = forwardRef<
  StyleSelectionDialogHandle,
  StyleSelectionDialogProps
>(
  (
    {
      isOpen: isOpenProp,
      onClose,
      selectedStyleId,
      onSelect,
      onReplace,
      onRemove,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      openSelectionDialog: () => setInternalOpen(true),
    }));

    // Prevent hydration issues: only render after mount
    useEffect(() => {
      setMounted(true);
    }, []);

    // Determine open state: controlled or uncontrolled
    const isOpen = typeof isOpenProp === "boolean" ? isOpenProp : internalOpen;

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
          handleClose();
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, onClose]);

    const handleSelect = (style: ImageData, isSelected: boolean) => {
      if (isSelected) {
        onReplace(style);
      } else {
        onSelect(style);
      }
      handleClose();
    };

    const handleClose = () => {
      setInternalOpen(false);
      onClose();
    };

    // Only render after mount to prevent hydration issues
    if (!mounted) return null;

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0.5, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0.5, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] flex h-full w-full items-end justify-center overflow-hidden bg-black/50 backdrop-blur-xs"
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
              className="border-primary/30 bg-background/80 text-text-color relative flex h-[90lvh] w-full items-start justify-center overflow-y-auto rounded-t-2xl rounded-b-none border pt-5 shadow-2xl backdrop-blur-xl md:max-w-6xl"
              role="document"
              aria-labelledby="style-dialog-title"
              aria-describedby="style-dialog-desc"
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
                className="hover:bg-primary/70 focus:ring-primary hover:text-text-color absolute top-4 right-4 z-50 cursor-pointer rounded-full bg-white/40 p-2 shadow-sm transition-colors focus:ring-2 focus:outline-none md:top-6 md:right-6"
                onClick={handleClose}
                tabIndex={0}
                aria-label="Close style selection dialog"
                type="button"
              >
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Dialog Content */}
              <div className="relative z-10 flex w-full flex-col items-center px-2 text-center">
                <h2
                  className="selection-primary focus:ring-primary focus-ring-primary text-text-color mb-8 text-xl font-bold drop-shadow sm:text-2xl"
                  id="style-dialog-title"
                  tabIndex={0}
                >
                  Pick a style
                </h2>

                {/* Grid of Styles */}
                <ul
                  className="mx-auto grid w-full grid-cols-2 place-content-center items-center justify-center gap-2 space-y-2 md:grid-cols-4 xl:grid-cols-5"
                  aria-label="Available styles"
                >
                  {stylesData.map((style, idx) => {
                    const isSelected = style.id === selectedStyleId;
                    return (
                      <li
                        className="selection-primary flex items-center justify-center"
                        key={style.id}
                      >
                        <StyleCard
                          style={{
                            id: style.id,
                            title: style.title,
                            imageUrl: style.imageUrl,
                          }}
                          onClick={() => handleSelect(style, isSelected)}
                          onDeselect={onRemove}
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
  },
);

StyleSelectionDialog.displayName = "StyleSelectionDialog";
