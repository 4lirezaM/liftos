import { Pencil } from "lucide-react";

import Tag from "./Tag";
import { formatLabel } from "../../utils/programDayDetails.utils";

export default function ExerciseSummary({ exercise, onEdit }) {
  const muscles = [...exercise.primary_muscles, ...exercise.secondary_muscles];

  return (
    <article className="min-w-0 rounded-lg border border-border bg-surface p-2 sm:p-3">
      <div className="flex min-w-0 items-start gap-2">
        {exercise.media_url ? (
          <img
            src={exercise.media_url}
            alt={`${exercise.name} demonstration`}
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-xs text-secondary">
            No GIF
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-xs font-semibold text-foreground sm:text-sm">
            {exercise.name}
          </h3>

          <p className="mt-1 text-[10px] text-secondary">
            {exercise.sets.length} sets
          </p>

          {exercise.notes && (
            <p className="mt-1 break-words text-[10px] text-secondary">
              {exercise.notes}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEdit(exercise)}
          aria-label={`Edit ${exercise.name}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary transition-colors hover:bg-surface-secondary hover:text-foreground"
        >
          <Pencil size={14} />
        </button>
      </div>

      {muscles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {muscles.map((muscle, index) => (
            <Tag key={`${muscle}-${index}`}>{formatLabel(muscle)}</Tag>
          ))}
        </div>
      )}

      {exercise.equipment.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {exercise.equipment.map((item, index) => (
            <Tag key={`${item}-${index}`}>{formatLabel(item)}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
