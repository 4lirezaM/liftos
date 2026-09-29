import { Search } from "lucide-react";
import { useState } from "react";

export default function ExerciseSearch({
  value,
  onChange,
  placeholder = "Search exercises...",
}) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value.length > 0;

  return (
    <div
      className={[
        "flex min-h-11 w-full items-center gap-3",
        "rounded-lg border bg-background px-3",
        "transition-colors",
        isFocused ? "border-primary" : "border-border",
      ].join(" ")}
    >
      <Search
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={[
          "min-w-0 flex-1 bg-transparent",
          "text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "outline-none",
        ].join(" ")}
      />

      {hasValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={[
            "flex size-7 shrink-0 items-center justify-center",
            "rounded-md text-muted-foreground",
            "transition-colors hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary/50",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-4"
            aria-hidden="true"
          >
            <path
              d="m7 7 10 10M17 7 7 17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
