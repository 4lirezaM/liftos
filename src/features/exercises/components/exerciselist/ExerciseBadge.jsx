export default function ExerciseBadge({ children }) {
  return (
    <span
      className="
          inline-flex
          shrink-0
          items-center
          rounded-full
          border border-border
          px-2 py-1
          text-[10px]
          font-medium
          text-foreground/60
  
          sm:text-xs
        "
    >
      {children}
    </span>
  );
}
