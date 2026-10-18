import { Plus } from "lucide-react";

import SelectedExerciseCard from "./SelectedExerciseCard";

export default function SelectedExercisesSection({
  exercises = [],
  onRemove,
  onAddClick,
  disabled = false,
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Selected Exercises
          </h3>

          <p className="mt-1 text-xs text-secondary">
            {exercises.length} exercises selected
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface-secondary"
        >
          <Plus size={15} />
          Add exercise
        </button>
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface-secondary/40 px-4 py-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-surface text-secondary">
            <Plus size={20} />
          </div>

          <p className="mt-3 text-sm font-medium text-foreground">
            No exercises added
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-secondary">
            Select exercises from the library below to add them to this group.
          </p>

          <button
            type="button"
            onClick={onAddClick}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Add your first exercise
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {exercises.map((exercise) => (
            <SelectedExerciseCard
              key={exercise.id}
              exercise={exercise}
              onRemove={onRemove}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </section>
  );
}
