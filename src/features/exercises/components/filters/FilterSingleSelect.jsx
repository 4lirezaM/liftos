export default function FilterSingleSelect({ options, value, onChange }) {
  return (
    <div className="space-y-1">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "flex min-h-11 w-full items-center justify-between",
              "rounded-lg px-3 text-left text-sm",
              "transition-colors",
              "hover:bg-muted",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary/50",
            ].join(" ")}
          >
            <span
              className={
                isSelected
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {option.label}
            </span>

            <span
              aria-hidden="true"
              className={[
                "flex size-5 items-center justify-center rounded-full border",
                isSelected ? "border-primary" : "border-border",
              ].join(" ")}
            >
              {isSelected && (
                <span className="size-2.5 rounded-full bg-primary" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
