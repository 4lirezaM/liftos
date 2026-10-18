import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";

// Animation duration in milliseconds.
const ANIMATION_DURATION = 300;

const SWIPE_THRESHOLD = 8;
const SCROLL_THRESHOLD = 0;
const modalStack = [];

const SlideUpModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  mode = "default",
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isExpanded, setIsExpanded] = useState(false);

  const modalId = useRef(Symbol("slide-up-modal")).current;

  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);

  const panelAnimationRef = useRef(null);
  const backdropAnimationRef = useRef(null);
  const animationRunRef = useRef(0);

  const isExpandedRef = useRef(isExpanded);
  const isOpenRef = useRef(isOpen);

  // Keep refs synchronized for native event listeners.
  isExpandedRef.current = isExpanded;
  isOpenRef.current = isOpen;

  const isNested = mode === "nested";

  // Keep the component mounted when opening.
  // When closing, mounting is controlled by the exit animation.
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsExpanded(false);
    }
  }, [isOpen]);

  // Run entrance and exit animations without CSS transitions.
  useLayoutEffect(() => {
    if (!isMounted) return;

    const panel = panelRef.current;
    const backdrop = backdropRef.current;

    if (!panel || !backdrop) return;

    const runId = ++animationRunRef.current;

    const cancelCurrentAnimations = () => {
      panelAnimationRef.current?.cancel();
      backdropAnimationRef.current?.cancel();

      panelAnimationRef.current = null;
      backdropAnimationRef.current = null;
    };

    if (isOpen) {
      // Entrance always starts below the visible screen.
      cancelCurrentAnimations();

      panel.style.transform = "translateY(100%)";
      backdrop.style.opacity = "0";

      // Ensure the browser registers the starting styles.
      void panel.offsetHeight;

      const panelAnimation = panel.animate(
        [{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }],
        {
          duration: ANIMATION_DURATION,
          easing: "ease-out",
          fill: "forwards",
        }
      );

      const backdropAnimation = backdrop.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        {
          duration: ANIMATION_DURATION,
          easing: "ease-out",
          fill: "forwards",
        }
      );

      panelAnimationRef.current = panelAnimation;
      backdropAnimationRef.current = backdropAnimation;

      panelAnimation.onfinish = () => {
        if (animationRunRef.current !== runId) return;
        if (!isOpenRef.current) return;

        // Preserve the final state in the element's inline styles.
        panel.style.transform = "translateY(0%)";
        backdrop.style.opacity = "1";

        panelAnimation.cancel();
        backdropAnimation.cancel();

        panelAnimationRef.current = null;
        backdropAnimationRef.current = null;
      };

      return;
    }

    // Read the current visual position before cancelling a previous animation.
    const currentTransform = getComputedStyle(panel).transform;
    const currentOpacity = getComputedStyle(backdrop).opacity;

    cancelCurrentAnimations();

    // Preserve the current visual position so exit begins without a jump.
    panel.style.transform =
      currentTransform === "none" ? "translateY(0%)" : currentTransform;

    backdrop.style.opacity = currentOpacity;

    const panelAnimation = panel.animate(
      [{ transform: panel.style.transform }, { transform: "translateY(100%)" }],
      {
        duration: ANIMATION_DURATION,
        easing: "ease-in",
        fill: "forwards",
      }
    );

    const backdropAnimation = backdrop.animate(
      [{ opacity: Number(currentOpacity) }, { opacity: 0 }],
      {
        duration: ANIMATION_DURATION,
        easing: "ease-in",
        fill: "forwards",
      }
    );

    panelAnimationRef.current = panelAnimation;
    backdropAnimationRef.current = backdropAnimation;

    panelAnimation.onfinish = () => {
      // Ignore callbacks from an obsolete animation.
      if (animationRunRef.current !== runId) return;
      if (isOpenRef.current) return;

      // Remove the modal only after the panel has moved completely offscreen.
      setIsExpanded(false);
      setIsMounted(false);
    };
  }, [isMounted, isOpen]);

  // Cancel outstanding animations if the component is genuinely unmounted.
  useEffect(() => {
    return () => {
      animationRunRef.current += 1;

      panelAnimationRef.current?.cancel();
      backdropAnimationRef.current?.cancel();

      panelAnimationRef.current = null;
      backdropAnimationRef.current = null;
    };
  }, []);

  // Prevent background scrolling while the modal exists.
  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  // Maintain modal stacking order.
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

  // Close only the topmost modal using Escape.
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (modalStack[modalStack.length - 1] !== modalId) return;
      if (!isOpenRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, modalId, onClose]);

  // Handle wheel, touch and scrollbar-driven scrolling.
  useEffect(() => {
    if (!isMounted) return;

    const content = contentRef.current;

    if (!content) return;

    let touchStartY = null;
    let touchStartScrollTop = 0;
    let touchAction = null;

    const handleWheel = (event) => {
      if (isNested) return;

      const expanded = isExpandedRef.current;
      const atTop = content.scrollTop <= SCROLL_THRESHOLD;

      // First downward wheel movement expands the modal.
      // Prevent the same movement from scrolling the content.
      if (!expanded && event.deltaY > 0) {
        event.preventDefault();

        content.scrollTop = 0;
        setIsExpanded(true);

        return;
      }

      // Scroll normally once expanded.
      // Collapse only when scrolling upward at the top of the content.
      if (expanded && event.deltaY < 0 && atTop) {
        event.preventDefault();
        setIsExpanded(false);
      }
    };

    const handleScroll = () => {
      if (isNested || isExpandedRef.current) return;

      // Detect scrollbar dragging or track clicks.
      // If the collapsed content begins scrolling, stop it and expand first.
      if (content.scrollTop > SCROLL_THRESHOLD) {
        content.scrollTop = 0;
        setIsExpanded(true);
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;

      touchStartY = event.touches[0].clientY;
      touchStartScrollTop = content.scrollTop;
      touchAction = null;
    };

    const handleTouchMove = (event) => {
      if (isNested || touchStartY === null) return;
      if (event.touches.length !== 1) return;

      const currentY = event.touches[0].clientY;
      const deltaY = currentY - touchStartY;

      // Once a gesture starts expanding or collapsing the modal,
      // prevent the same gesture from scrolling the content.
      if (touchAction !== null) {
        event.preventDefault();
        return;
      }

      // Swiping upward expands the collapsed modal.
      if (!isExpandedRef.current && deltaY < -SWIPE_THRESHOLD) {
        touchAction = "expand";

        event.preventDefault();
        content.scrollTop = 0;

        setIsExpanded(true);

        return;
      }

      // Swiping downward at the top collapses the expanded modal.
      if (
        isExpandedRef.current &&
        touchStartScrollTop <= SCROLL_THRESHOLD &&
        content.scrollTop <= SCROLL_THRESHOLD &&
        deltaY > SWIPE_THRESHOLD
      ) {
        touchAction = "collapse";

        event.preventDefault();
        setIsExpanded(false);
      }
    };

    const handleTouchEnd = () => {
      touchStartY = null;
      touchStartScrollTop = 0;
      touchAction = null;
    };

    // Native non-passive listeners let us prevent the initial gesture
    // from scrolling the list at the same time as expanding the modal.
    content.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    content.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    content.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    content.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    content.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    content.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    });

    return () => {
      content.removeEventListener("wheel", handleWheel);
      content.removeEventListener("scroll", handleScroll);
      content.removeEventListener("touchstart", handleTouchStart);
      content.removeEventListener("touchmove", handleTouchMove);
      content.removeEventListener("touchend", handleTouchEnd);
      content.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMounted, isNested]);

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return;
    if (isNested || !isOpenRef.current) return;

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
        opacity: 0,
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
          transform: "translateY(100%)",
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

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className={[
            "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4",
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
