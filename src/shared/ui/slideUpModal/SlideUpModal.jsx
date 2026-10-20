import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";

const ANIMATION_DURATION = 300;
const SWIPE_THRESHOLD = 8;
const modalStack = [];

const SlideUpModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  mode = "default",
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [phase, setPhase] = useState(isOpen ? "entering" : "closed");
  const [isExpanded, setIsExpanded] = useState(false);

  const modalId = useRef(Symbol("modal")).current;
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const isOpenRef = useRef(isOpen);
  const expandedRef = useRef(false);
  const lastChildrenRef = useRef(children);

  const isNested = mode === "nested";

  isOpenRef.current = isOpen;
  expandedRef.current = isExpanded;

  // Preserve children until the exit animation finishes.
  if (isOpen) {
    lastChildrenRef.current = children;
  }

  const renderedChildren = isOpen ? children : lastChildrenRef.current;

  // Control opening and closing.
  useLayoutEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setPhase("entering");
      setIsExpanded(false);
    } else if (isMounted) {
      setPhase("exiting");
    }
  }, [isOpen, isMounted]);

  // Lock background scrolling.
  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  // Keep track of nested modals.
  useEffect(() => {
    if (!isMounted) return;

    modalStack.push(modalId);

    return () => {
      const index = modalStack.lastIndexOf(modalId);
      if (index !== -1) modalStack.splice(index, 1);
    };
  }, [isMounted, modalId]);

  // Close the topmost modal with Escape.
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (modalStack.at(-1) !== modalId) return;
      if (!isOpenRef.current) return;

      event.preventDefault();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, modalId, onClose]);

  // Expand/collapse with wheel, touch, or scrollbar scrolling.
  useEffect(() => {
    if (!isMounted || isNested) return;

    const content = contentRef.current;
    if (!content) return;

    let startY = null;
    let startScrollTop = 0;
    let gesture = null;

    const expand = () => {
      expandedRef.current = true;
      setIsExpanded(true);
    };

    const collapse = () => {
      expandedRef.current = false;
      setIsExpanded(false);
    };

    const handleWheel = (event) => {
      const expanded = expandedRef.current;
      const atTop = content.scrollTop <= 0;

      if (!expanded && event.deltaY > 0) {
        event.preventDefault();
        content.scrollTop = 0;
        expand();
      } else if (expanded && event.deltaY < 0 && atTop) {
        event.preventDefault();
        collapse();
      }
    };

    const handleScroll = () => {
      if (!expandedRef.current && content.scrollTop > 0) {
        content.scrollTop = 0;
        expand();
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;

      startY = event.touches[0].clientY;
      startScrollTop = content.scrollTop;
      gesture = null;
    };

    const handleTouchMove = (event) => {
      if (startY === null || event.touches.length !== 1) return;

      const deltaY = event.touches[0].clientY - startY;

      if (gesture) {
        event.preventDefault();
        return;
      }

      if (!expandedRef.current && deltaY < -SWIPE_THRESHOLD) {
        gesture = "expand";
        event.preventDefault();
        content.scrollTop = 0;
        expand();
      } else if (
        expandedRef.current &&
        startScrollTop <= 0 &&
        content.scrollTop <= 0 &&
        deltaY > SWIPE_THRESHOLD
      ) {
        gesture = "collapse";
        event.preventDefault();
        collapse();
      }
    };

    const handleTouchEnd = () => {
      startY = null;
      startScrollTop = 0;
      gesture = null;
    };

    content.addEventListener("wheel", handleWheel, { passive: false });
    content.addEventListener("scroll", handleScroll, { passive: true });
    content.addEventListener("touchstart", handleTouchStart, { passive: true });
    content.addEventListener("touchmove", handleTouchMove, { passive: false });
    content.addEventListener("touchend", handleTouchEnd);
    content.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      content.removeEventListener("wheel", handleWheel);
      content.removeEventListener("scroll", handleScroll);
      content.removeEventListener("touchstart", handleTouchStart);
      content.removeEventListener("touchmove", handleTouchMove);
      content.removeEventListener("touchend", handleTouchEnd);
      content.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMounted, isNested]);

  const handleAnimationEnd = (event) => {
    if (event.target !== panelRef.current) return;

    if (phase === "entering") {
      setPhase("open");
    }

    if (phase === "exiting" && !isOpenRef.current) {
      setIsExpanded(false);
      setIsMounted(false);
      setPhase("closed");
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return;
    if (isNested || !isOpenRef.current) return;

    onClose();
  };

  if (!isMounted) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes slideUpEnter {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes slideUpExit {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }

        @keyframes backdropEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes backdropExit {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>

      <div
        role="presentation"
        onClick={handleBackdropClick}
        className="fixed inset-0 z-overlay flex items-end justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        style={{
          animation:
            phase === "entering"
              ? `backdropEnter ${ANIMATION_DURATION}ms ease-out both`
              : phase === "exiting"
              ? `backdropExit ${ANIMATION_DURATION}ms ease-in both`
              : "none",
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          onAnimationEnd={handleAnimationEnd}
          className={[
            "flex w-full flex-col border border-border bg-background shadow-2xl",
            "sm:w-[94%] md:w-[92%] lg:w-[90%] lg:max-w-[1440px] xl:w-[88%]",
            className,
          ].join(" ")}
          style={{
            height: isExpanded ? "100dvh" : "88dvh",
            borderTopLeftRadius: isExpanded ? 0 : "1.5rem",
            borderTopRightRadius: isExpanded ? 0 : "1.5rem",
            transition: "height 300ms ease, border-radius 300ms ease",
            animation:
              phase === "entering"
                ? `slideUpEnter ${ANIMATION_DURATION}ms ease-out both`
                : phase === "exiting"
                ? `slideUpExit ${ANIMATION_DURATION}ms ease-in both`
                : "none",
          }}
        >
          <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3 sm:px-6 sm:pt-4">
            {isNested ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to previous modal"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-primary-500"
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
                className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            ref={contentRef}
            className="min-h-0 flex-1  overflow-y-auto overscroll-contain px-4 pb-4 scrollbar-custom sm:px-6 sm:pb-6"
          >
            {renderedChildren}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal-root") || document.body
  );
};

export default SlideUpModal;
