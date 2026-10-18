import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";

const ANIMATION_DURATION = 300;
const modalStack = [];

const SlideUpModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  mode = "default",
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const modalId = useRef(Symbol("slide-up-modal")).current;
  const isNested = mode === "nested";

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);

      const firstFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      return () => cancelAnimationFrame(firstFrame);
    }

    setIsVisible(false);

    const timeout = setTimeout(() => {
      setIsMounted(false);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    modalStack.push(modalId);

    return () => {
      const index = modalStack.lastIndexOf(modalId);

      if (index !== -1) {
        modalStack.splice(index, 1);
      }
    };
  }, [isMounted, modalId]);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      const activeModalId = modalStack[modalStack.length - 1];

      if (activeModalId !== modalId) return;

      event.preventDefault();
      event.stopPropagation();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, modalId, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return;

    if (isNested) return;

    onClose();
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      role="presentation"
      className={[
        "fixed inset-0 z-overlay flex items-end justify-center",
        "bg-black/40 backdrop-blur-sm dark:bg-black/60",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={[
          "flex h-[75vh] w-full flex-col",
          "rounded-t-3xl border border-border bg-background shadow-2xl",
          "transition-transform duration-300 ease-out",
          "sm:h-[80vh] sm:w-[90%]",
          "md:h-[85vh] md:w-[80%]",
          "lg:w-[70%] lg:max-w-4xl",
          isVisible ? "translate-y-0" : "translate-y-full",
          className,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3 sm:px-6 sm:pt-4">
          {isNested ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to previous modal"
              className={[
                "group inline-flex items-center gap-2",
                "text-sm font-medium text-foreground/60",
                "transition-colors duration-200 hover:text-primary-500",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",
              ].join(" ")}
            >
              <span className="flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-all duration-300 group-hover:-translate-x-1 group-hover:border-primary-500/40">
                <ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {!isNested && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={[
                "rounded-full p-2 text-foreground/60",
                "transition-colors hover:bg-foreground/10",
                "hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary",
              ].join(" ")}
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
            "scrollbar-custom sm:px-6 sm:pb-6",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("portal-root") || document.body
  );
};

export default SlideUpModal;
