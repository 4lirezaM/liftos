import { Plus } from "lucide-react";

import TrainingBlock from "./TrainingBlock";

export default function TrainingBlocksSection({
  groups,
  isLoading,
  onAddGroup,
  onEditExercise,
  onEditGroup,
  onDeleteGroup,
}) {
  return (
    <section className="min-w-0 space-y-2">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            Training blocks
          </h2>
          <p className="mt-0.5 text-[10px] text-secondary sm:text-xs">
            Exercises, targets and rest periods
          </p>
        </div>

        <button
          type="button"
          onClick={onAddGroup}
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:px-3"
        >
          <Plus size={14} />
          Add block
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border px-3 py-8 text-center text-sm text-secondary">
          Loading program day...
        </div>
      ) : groups.length > 0 ? (
        <div className="min-w-0 space-y-2">
          {groups.map((group) => (
            <TrainingBlock
              key={group.id}
              group={group}
              onEditExercise={onEditExercise}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-4 py-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No training blocks yet
          </p>
          <p className="mt-1 text-xs text-secondary">
            Add a block to start building this workout.
          </p>
          <button
            type="button"
            onClick={onAddGroup}
            className="mt-3 inline-flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-xs font-medium text-white"
          >
            <Plus size={14} />
            Add first block
          </button>
        </div>
      )}
    </section>
  );
}
