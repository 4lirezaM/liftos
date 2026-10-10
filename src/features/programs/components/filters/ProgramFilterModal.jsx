import SlideUpModal from "@/shared/ui/slideUpModal/SlideUpModal";

import {
  PROGRAM_TYPE_FILTER_OPTIONS,
  PROGRAM_GOAL_FILTER_OPTIONS,
  PROGRAM_DIFFICULTY_FILTER_OPTIONS,
} from "../../constants/programFilters";

const FILTER_SECTIONS = [
  {
    key: "programType",
    title: "Program Type",
    options: PROGRAM_TYPE_FILTER_OPTIONS,
  },
  {
    key: "goal",
    title: "Goal",
    options: PROGRAM_GOAL_FILTER_OPTIONS,
  },
  {
    key: "difficulty",
    title: "Difficulty",
    options: PROGRAM_DIFFICULTY_FILTER_OPTIONS,
  },
];

export default function ProgramFilterModal({
  isOpen,
  filters,
  onChange,
  onReset,
  onApply,
  onCancel,
}) {
  const activeFilterCount = FILTER_SECTIONS.reduce(
    (total, section) => total + filters[section.key].length,
    0
  );

  return (
    <SlideUpModal isOpen={isOpen} onClose={onCancel} title="Filters">
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <div className="border-b border-border py-4">
            <p className="text-sm text-muted-foreground">
              {activeFilterCount > 0
                ? `${activeFilterCount} active ${
                    activeFilterCount === 1 ? "filter" : "filters"
                  }`
                : "No filters applied"}
            </p>
          </div>

          {FILTER_SECTIONS.map((section) => (
            <section
              key={section.key}
              className="border-b border-border py-5 last:border-b-0"
            >
              <h3 className="mb-3 text-sm font-medium text-foreground">
                {section.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                {section.options.map((option) => {
                  const selectedValues = filters[section.key];
                  const isSelected = selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        const nextValues = isSelected
                          ? selectedValues.filter(
                              (value) => value !== option.value
                            )
                          : [...selectedValues, option.value];

                        onChange(section.key, nextValues);
                      }}
                      className={[
                        "rounded-lg border px-3 py-2",
                        "text-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-primary/50",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="shrink-0 border-t border-border bg-background p-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReset}
              className={[
                "min-h-11 flex-1 rounded-lg border border-border",
                "px-4 text-sm font-medium text-foreground",
                "transition-colors hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary/50",
              ].join(" ")}
            >
              Reset
            </button>

            <button
              type="button"
              onClick={onApply}
              className={[
                "min-h-11 flex-1 rounded-lg bg-primary",
                "px-4 text-sm font-semibold text-background",
                "transition-opacity hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary/50",
              ].join(" ")}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </SlideUpModal>
  );
}
