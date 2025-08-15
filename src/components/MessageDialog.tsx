import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface MessageDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  id?: string;
  dialogLabelId?: string;
  dialogDescriptionId?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    id?: string;
    "aria-label"?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    id?: string;
    "aria-label"?: string;
  };
}

function assertNonEmptyString(
  value: unknown,
  name: string,
): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`MessageDialog: "${name}" must be a non-empty string.`);
  }
}

function assertFunction(
  value: unknown,
  name: string,
): asserts value is (...args: unknown[]) => unknown {
  if (typeof value !== "function") {
    throw new Error(`MessageDialog: "${name}" must be a function.`);
  }
}

export const MessageDialog: React.FC<MessageDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  id,
  dialogLabelId,
  dialogDescriptionId,
  primaryAction,
  secondaryAction,
  ...rest
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
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

  if (!isOpen) return null;

  // Validate required props
  try {
    assertFunction(onClose, "onClose");
    assertNonEmptyString(title, "title");
    assertNonEmptyString(description, "description");
    if (!primaryAction)
      throw new Error('MessageDialog: "primaryAction" is required.');
    assertNonEmptyString(primaryAction.label, "primaryAction.label");
    assertFunction(primaryAction.onClick, "primaryAction.onClick");
    if (secondaryAction) {
      assertNonEmptyString(secondaryAction.label, "secondaryAction.label");
      assertFunction(secondaryAction.onClick, "secondaryAction.onClick");
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("MessageDialog validation error:", error);
    }
    return null;
  }

  // Accessibility: generate ids if not provided
  const dialogId = id || "message-dialog";
  const labelId = dialogLabelId || `${dialogId}-label`;
  const descId = dialogDescriptionId || `${dialogId}-desc`;

  // Wrap action handlers to close dialog after action
  const handlePrimaryAction = () => {
    try {
      primaryAction.onClick();
    } finally {
      onClose();
    }
  };

  const handleSecondaryAction = secondaryAction
    ? () => {
        try {
          secondaryAction.onClick();
        } finally {
          onClose();
        }
      }
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-hidden bg-black/50 px-4 backdrop-blur-sm md:px-0"
      id={`${dialogId}-backdrop`}
      aria-labelledby={labelId}
      aria-describedby={descId}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      ref={dialogRef}
      {...rest}
    >
      <div
        className="border-primary/30 bg-background/80 before:bg-primary/10 relative w-full max-w-md overflow-hidden rounded-xl border p-7 text-text-color shadow-2xl backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-2xl before:backdrop-blur-xl"
        id={dialogId}
        role="document"
        aria-labelledby={labelId}
        aria-describedby={descId}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          className="hover:bg-primary/70 focus-ring-primary bg-background/60 absolute top-2 right-2 z-10 cursor-pointer rounded-full p-1.5 shadow-sm transition-colors hover:text-text-color md:top-3 md:right-3"
          onClick={onClose}
          aria-label="Close dialog"
          type="button"
          id={`${dialogId}-close-btn`}
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {/* Dialog Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2
            className="selection-primary focus-ring-primary mb-2 text-base font-bold text-text-color drop-shadow sm:text-xl"
            id={labelId}
            tabIndex={0}
          >
            {title}
          </h2>
          <p
            className="selection-primary focus-ring-primary mb-7 text-xs text-text-color/80 sm:text-base"
            id={descId}
            tabIndex={0}
          >
            {description}
          </p>

          <div className="flex w-full flex-col items-center gap-3 md:flex-row">
            <Button
              variant="gradient"
              size="md"
              className="focus-ring-primary selection-primary w-full max-w-xs"
              onClick={handlePrimaryAction}
              id={primaryAction.id || `${dialogId}-primary-btn`}
              aria-label={primaryAction["aria-label"] || primaryAction.label}
            >
              {primaryAction.label}
            </Button>
            {secondaryAction && (
              <Button
                variant="outline"
                size="md"
                className="focus-ring-primary selection-primary w-full max-w-xs"
                onClick={handleSecondaryAction}
                id={secondaryAction.id || `${dialogId}-secondary-btn`}
                aria-label={
                  secondaryAction["aria-label"] || secondaryAction.label
                }
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
