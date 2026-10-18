import { X } from "lucide-react";

import Tag from "./Tag";
import { formatLabel } from "@/features/programs/utils/programDayDetails.utils";

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }
  return [];
}

export default function SelectedExerciseCard({
  exercise,
  onRemove,
  disabled = false,
}) {
  const primaryMuscles = normalizeArray(exercise.primary_muscles);
  const secondaryMuscles = normalizeArray(exercise.secondary_muscles);
  const equipment = normalizeArray(exercise.equipment);

  return (
    <article className="group relative flex min-w-0 gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/40">
      {exercise.media_url ? (
        <img
          src={exercise.media_url}
          alt={`${exercise.name} demonstration`}
          loading="lazy"
          className="size-[68px] shrink-0 rounded-lg bg-surface-secondary object-contain"
        />
      ) : (
        <div className="flex size-[68px] shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-[10px] text-secondary">
          No GIF
        </div>
      )}

      <div className="min-w-0 flex-1 py-0.5 pr-6">
        <h4 className="break-words text-sm font-semibold leading-5 text-foreground">
          {exercise.name}
        </h4>

        {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {primaryMuscles.map((muscle, index) => (
              <span
                key={`primary-${muscle}-${index}`}
                className="rounded-md bg-primary/15 px-2 py-1 text-[11px] font-medium text-primary"
              >
                {formatLabel(muscle)}
              </span>
            ))}

            {secondaryMuscles.map((muscle, index) => (
              <span
                key={`secondary-${muscle}-${index}`}
                className="rounded-md bg-surface-secondary px-2 py-1 text-[11px] text-secondary"
              >
                {formatLabel(muscle)}
              </span>
            ))}
          </div>
        )}

        {equipment.length > 0 && (
          <p className="mt-2 text-xs text-secondary">
            {equipment.map((item) => formatLabel(item)).join(" · ")}
          </p>
        )}

        {exercise.notes && (
          <p className="mt-2 break-words text-xs leading-5 text-secondary">
            {exercise.notes}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onRemove(exercise.id)}
        aria-label={`Remove ${exercise.name}`}
        title="Remove exercise"
        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-md text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X size={14} />
      </button>
    </article>
  );
}
