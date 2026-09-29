import SlideUpModal from "@/shared/ui/slideUpModal/SlideUpModal";

import {
  ARCHIVED_FILTER_OPTIONS,
  EQUIPMENT_FILTER_OPTIONS,
  PRIMARY_MUSCLE_FILTER_OPTIONS,
  SECONDARY_MUSCLE_FILTER_OPTIONS,
  SOURCE_FILTER_OPTIONS,
} from "../../constants/exerciseFilters";

import FilterOptionList from "./FilterOptionList";
import FilterSection from "./FilterSection";
import FilterSegmentedControl from "./FilterSegmentedControl";

export default function ExerciseFilterModal({
  isOpen,
  filters,
  onChange,
  onReset,
  onApply,
  onCancel,
}) {
  const activeFilterCount =
    (filters.source !== "all" ? 1 : 0) +
    filters.primaryMuscle.length +
    filters.secondaryMuscles.length +
    filters.equipment.length +
    (filters.archived !== false ? 1 : 0);

  return (
    <SlideUpModal isOpen={isOpen} onClose={onCancel} title="Filters">
      <div className="flex h-full flex-col">
        {/* Scrollable content */}
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

          <FilterSection title="Source">
            <FilterSegmentedControl
              options={SOURCE_FILTER_OPTIONS}
              value={filters.source}
              onChange={(value) => onChange("source", value)}
            />
          </FilterSection>

          <FilterSection title="Primary Muscle">
            <FilterOptionList
              options={PRIMARY_MUSCLE_FILTER_OPTIONS}
              value={filters.primaryMuscle}
              onChange={(value) => onChange("primaryMuscle", value)}
            />
          </FilterSection>

          <FilterSection title="Secondary Muscles">
            <FilterOptionList
              options={SECONDARY_MUSCLE_FILTER_OPTIONS}
              value={filters.secondaryMuscles}
              onChange={(value) => onChange("secondaryMuscles", value)}
            />
          </FilterSection>

          <FilterSection title="Equipment">
            <FilterOptionList
              options={EQUIPMENT_FILTER_OPTIONS}
              value={filters.equipment}
              onChange={(value) => onChange("equipment", value)}
            />
          </FilterSection>

          <FilterSection title="Archived">
            <FilterSegmentedControl
              options={ARCHIVED_FILTER_OPTIONS}
              value={filters.archived}
              onChange={(value) => onChange("archived", value)}
            />
          </FilterSection>
        </div>

        {/* Fixed footer */}
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
