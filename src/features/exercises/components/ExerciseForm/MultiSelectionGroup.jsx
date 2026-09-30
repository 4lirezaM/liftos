import { formatLabel } from "./ExerciseForm";

/*
 * ==================================================
 * Multi selection
 * ==================================================
 */
export const MultiSelectionGroup = ({
  label,
  options,
  values,
  onChange,
  disabled = false,
  error,
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = values.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`
                rounded-lg
                border
                px-3
                py-2
                text-sm
                transition
                ${
                  isSelected
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }
                disabled:pointer-events-none
                disabled:opacity-50
              `}
            >
              {formatLabel(option)}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
