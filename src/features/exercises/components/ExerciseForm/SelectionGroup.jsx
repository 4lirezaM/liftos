import { formatLabel } from "./ExerciseForm";

/*
 * ==================================================
 * Single selection
 * ==================================================
 */
export const SelectionGroup = ({
  label,
  required = false,
  options,
  value,
  onChange,
  disabled = false,
  error,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">
          {label}

          {required && <span className="ml-1 text-primary">*</span>}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option;

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
