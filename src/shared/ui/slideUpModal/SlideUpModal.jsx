import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ANIMATION_DURATION = 300;

const SlideUpModal = ({ isOpen, onClose, children, className = "" }) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  // Handle mount / unmount and animations
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const animationFrame = requestAnimationFrame(() => {
        const secondAnimationFrame = requestAnimationFrame(() => {
          setIsVisible(true);
        });

        return () => {
          cancelAnimationFrame(secondAnimationFrame);
        };
      });

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }

    setIsVisible(false);

    const timeout = setTimeout(() => {
      setIsMounted(false);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMounted]);

  // Close with Escape
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      className={`
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/40
        backdrop-blur-sm
        dark:bg-black/60
        transition-opacity
        duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`
          flex
          h-[75vh]
          w-full
          flex-col
          rounded-t-3xl
          border
          border-border
          bg-background
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          sm:h-[80vh]
          sm:w-[90%]
          md:h-[85vh]
          md:w-[80%]
          lg:w-[70%]
          lg:max-w-4xl
          ${isVisible ? "translate-y-0" : "translate-y-full"}
          ${className}
        `}
      >
        {/* Header */}
        <div
          className="
            flex
            shrink-0
            justify-end
            px-4
            pt-3
            sm:px-6
            sm:pt-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              cursor-pointer
              rounded-full
              p-2
              text-foreground/60
              transition-colors
              hover:bg-foreground/10
              hover:text-foreground
              focus:outline-none
              focus:ring-2
              focus:ring-primary
              focus:ring-offset-1
              focus:ring-offset-background
            "
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            pb-4
            scrollbar-custom
            sm:px-6
            sm:pb-6
          "
        >
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("portal-root") || document.body
  );
};

export default SlideUpModal;
