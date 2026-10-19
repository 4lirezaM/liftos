import { GripVertical, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const sortableId =
    exercise.exercise_id ?? exercise.exercise?.id ?? exercise.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId,
    disabled,
  });

  const primaryMuscles = normalizeArray(
    exercise.primary_muscles ?? exercise.exercise?.primary_muscles
  );
  const secondaryMuscles = normalizeArray(
    exercise.secondary_muscles ?? exercise.exercise?.secondary_muscles
  );
  const equipment = normalizeArray(
    exercise.equipment ?? exercise.exercise?.equipment
  );

  const name = exercise.name ?? exercise.exercise?.name ?? "Exercise";
  const mediaUrl = exercise.media_url ?? exercise.exercise?.media_url;

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={[
        "group relative flex min-w-0 gap-2 rounded-xl border border-border",
        "bg-surface p-3 transition-colors hover:border-primary/40",
        isDragging ? "z-10 opacity-80 shadow-xl" : "",
      ].join(" ")}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`Reorder ${name}`}
        title="Drag to reorder"
        className="flex min-h-10 w-7 shrink-0 touch-none items-center justify-center self-center rounded-md text-secondary hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <GripVertical size={18} />
      </button>

      {mediaUrl ? (
        <img
          src={mediaUrl}
          alt={`${name} demonstration`}
          loading="lazy"
          className="size-[68px] shrink-0 rounded-lg bg-surface-secondary object-contain"
        />
      ) : (
        <div className="flex size-[68px] shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-[10px] text-secondary">
          No GIF
        </div>
      )}

      <div className="min-w-0 flex-1 py-0.5 pr-5">
        <h4 className="break-words text-sm font-semibold leading-5 text-foreground">
          {name}
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
        onClick={() => onRemove(sortableId)}
        aria-label={`Remove ${name}`}
        title="Remove exercise"
        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-md text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X size={14} />
      </button>
    </article>
  );
}
