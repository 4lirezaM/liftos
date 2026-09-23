import { useEffect, useRef } from "react";

export default function InfiniteScrollSentinel({
  onIntersect,
  disabled = false,
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || disabled) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, disabled]);

  return <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />;
}
