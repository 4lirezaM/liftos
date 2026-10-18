import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";

// Change animation duration here (milliseconds).
const ANIMATION_DURATION = 300;

const SWIPE_THRESHOLD = 40;
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
  const [isExpanded, setIsExpanded] = useState(false);

  const modalId = useRef(Symbol("slide-up-modal")).current;
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);
  const touchStartRef = useRef(null);

  const isNested = mode === "nested";

  // Keep the modal mounted while its exit animation is running.
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsVisible(false);
      setIsExpanded(false);
    }
  }, [isOpen]);

  // Run entrance and exit animations directly on the elements.
  useLayoutEffect(() => {
    if (!isMounted) return;

    const panel = panelRef.current;
    const backdrop = backdropRef.current;

    if (!panel || !backdrop) return;

    let panelAnimation;
    let backdropAnimation;

    const animationOptions = {
      duration: ANIMATION_DURATION,
      fill: "forwards",
    };

    if (isOpen) {
      // Entrance: slide up from the bottom.
      setIsVisible(false);

      panelAnimation = panel.animate(
        [{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }],
        {
          ...animationOptions,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }
      );

      backdropAnimation = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
        ...animationOptions,
        easing: "ease-out",
      });

      panelAnimation.onfinish = () => {
        setIsVisible(true);
      };
    } else {
      // Read the current visual position before switching to the hidden state.
      const currentTransform = getComputedStyle(panel).transform;
      const currentOpacity = Number(getComputedStyle(backdrop).opacity);

      // Exit: slide down, then unmount only after the animation finishes.
      setIsVisible(false);

      panelAnimation = panel.animate(
        [{ transform: currentTransform }, { transform: "translateY(100%)" }],
        {
          ...animationOptions,
          easing: "cubic-bezier(0.4, 0, 1, 1)",
        }
      );

      backdropAnimation = backdrop.animate(
        [{ opacity: currentOpacity }, { opacity: 0 }],
        {
          ...animationOptions,
          easing: "ease-in",
        }
      );

      panelAnimation.onfinish = () => {
        setIsMounted(false);
        setIsExpanded(false);
      };
    }

    // Cancel obsolete animations when the modal opens/closes again.
    return () => {
      panelAnimation?.cancel();
      backdropAnimation?.cancel();
    };
  }, [isMounted, isOpen]);

  // Prevent background scrolling while the modal is mounted.
  useEffect(() => {
    if (!isMounted) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMounted]);

  // Track modal order so Escape closes only the topmost modal.
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

  // Close the topmost modal with Escape.
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (modalStack[modalStack.length - 1] !== modalId) return;

      event.preventDefault();
      event.stopPropagation();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, modalId, onClose]);

  const handleWheel = (event) => {
    if (isNested) return;

    const content = contentRef.current;

    if (!content || content.scrollTop > 0) return;

    if (!isExpanded && event.deltaY > 0) {
      setIsExpanded(true);
    } else if (isExpanded && event.deltaY < 0) {
      setIsExpanded(false);
    }
  };

  const handleTouchStart = (event) => {
    const content = contentRef.current;

    if (!content) return;

    touchStartRef.current = {
      y: event.touches[0].clientY,
      scrollTop: content.scrollTop,
    };
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    const content = contentRef.current;

    touchStartRef.current = null;

    if (!start || !content || isNested) return;
    if (start.scrollTop > 0 || content.scrollTop > 0) return;

    const deltaY = event.changedTouches[0].clientY - start.y;

    if (!isExpanded && deltaY < -SWIPE_THRESHOLD) {
      setIsExpanded(true);
    } else if (isExpanded && deltaY > SWIPE_THRESHOLD) {
      setIsExpanded(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (!isOpen) return;
    if (event.target !== event.currentTarget) return;
    if (isNested) return;

    onClose();
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      ref={backdropRef}
      role="presentation"
      onClick={handleBackdropClick}
      className={[
        "fixed inset-0 z-overlay flex items-end justify-center",
        "bg-black/40 backdrop-blur-sm dark:bg-black/60",
      ].join(" ")}
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={[
          "flex w-full flex-col",
          isExpanded ? "h-dvh rounded-t-none" : "h-[88dvh] rounded-t-3xl",
          "border border-border bg-background shadow-2xl",
          "sm:w-[94%]",
          "md:w-[92%]",
          "lg:w-[90%] lg:max-w-[1440px]",
          "xl:w-[88%]",
          className,
        ].join(" ")}
        style={{
          // The Web Animations API controls transform.
          transform: isVisible ? "translateY(0%)" : "translateY(100%)",

          // Preserve smooth resizing when expanding/collapsing the panel.
          transition: [
            `height ${ANIMATION_DURATION}ms ease-in-out`,
            `border-radius ${ANIMATION_DURATION}ms ease-in-out`,
          ].join(", "),
        }}
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
          ref={contentRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
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
