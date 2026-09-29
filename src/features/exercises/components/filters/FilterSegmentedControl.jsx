export default function FilterSegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex w-full overflow-hidden rounded-lg border border-border">
      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "min-h-11 flex-1 px-3",
              "text-sm font-medium",
              "transition-colors",
              "focus-visible:z-10 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary/50",
              index > 0 ? "border-l border-border" : "",
              isSelected
                ? "bg-primary text-background"
                : "bg-background text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
