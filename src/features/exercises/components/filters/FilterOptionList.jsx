export default function FilterOptionList({ options, value, onChange }) {
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const unselectedOptions = options.filter(
    (option) => !value.includes(option.value)
  );

  const orderedOptions = [...selectedOptions, ...unselectedOptions];

  const handleToggle = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {orderedOptions.map((option) => {
        const isSelected = value.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={[
              "rounded-lg border px-3 py-2",
              "text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary/50",
              isSelected
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
