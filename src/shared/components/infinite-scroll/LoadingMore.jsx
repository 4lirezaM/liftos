export default function LoadingMore() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center px-4 py-4"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span
          aria-hidden="true"
          className="
              h-4 w-4
              animate-spin
              rounded-full
              border-2
              border-foreground/20
              border-t-primary
            "
        />

        <span>Loading more exercises...</span>
      </div>
    </div>
  );
}
