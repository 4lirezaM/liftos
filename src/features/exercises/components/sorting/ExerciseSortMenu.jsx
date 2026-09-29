import { ArrowDownAZ, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { SORT_OPTIONS } from "./sortOptions";

const ExerciseSortMenu = ({ value, onChange, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "flex min-h-11 w-full items-center justify-center gap-2",
          "rounded-lg border border-border",
          "bg-background px-3 py-2",
          "text-sm font-medium text-foreground",
          "transition-colors hover:bg-muted cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary/50",
          "sm:w-auto",
        ].join(" ")}
      >
        <ArrowDownAZ
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <span>Sort</span>

        <ChevronDown
          className={[
            "size-4 shrink-0 text-muted-foreground",
            "transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className={[
            "absolute right-0 z-20 mt-2 w-52",
            "rounded-lg border border-border",
            "bg-background p-1.5 shadow-lg",
          ].join(" ")}
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={[
                  "flex min-h-10 w-full items-center",
                  "justify-between gap-3",
                  "rounded-md px-3 py-2",
                  "text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2  cursor-pointer",
                  "focus-visible:ring-primary/50",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExerciseSortMenu;
