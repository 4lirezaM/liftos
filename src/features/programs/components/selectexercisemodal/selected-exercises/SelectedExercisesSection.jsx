import { useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import SelectedExerciseCard from "./SelectedExerciseCard";

function getLibraryId(exercise) {
  return exercise.exercise_id ?? exercise.exercise?.id ?? exercise.id;
}

export default function SelectedExercisesSection({
  exercises = [],
  onRemove,
  onReorder,
  onAddClick,
  disabled = false,
}) {
  const exerciseIds = useMemo(() => exercises.map(getLibraryId), [exercises]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || disabled) return;

    const oldIndex = exerciseIds.indexOf(active.id);
    const newIndex = exerciseIds.indexOf(over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    onReorder?.(arrayMove(exercises, oldIndex, newIndex));
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Selected Exercises
          </h3>
          <p className="mt-1 text-xs text-secondary">
            {exercises.length} exercises selected · Drag to reorder
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          disabled={disabled}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface-secondary disabled:opacity-50"
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
            disabled={disabled}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Add your first exercise
          </button>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={exerciseIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {exercises.map((exercise) => (
                <SelectedExerciseCard
                  key={getLibraryId(exercise)}
                  exercise={exercise}
                  onRemove={onRemove}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
