export default function FilterMultiSelect({ options, value, onChange }) {
  const handleToggle = (optionValue) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
  };

  return (
    <div className="space-y-1">
      {options.map((option) => {
        const isSelected = value.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
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
                "flex size-5 items-center justify-center rounded-md border",
                isSelected ? "border-primary bg-primary" : "border-border",
              ].join(" ")}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-3.5 text-background"
                >
                  <path
                    d="m5 10 3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
