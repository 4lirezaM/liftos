import { useState } from "react";

import { Search, X } from "lucide-react";

export default function ProgramSearch({
  value,
  onChange,
  placeholder = "Search programs...",
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
        aria-label="Search programs"
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
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
