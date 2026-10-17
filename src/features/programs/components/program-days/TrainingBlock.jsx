import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

import ExerciseSummary from "./ExerciseSummary";
import SetTable from "./SetTable";
import { GROUP_META } from "../../constants/programDayDetails.constants";
import { formatLabel } from "../../utils/programDayDetails.utils";

export default function TrainingBlock({
  group,
  onEditExercise,
  onEditGroup,
  onDeleteGroup,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const meta = GROUP_META[group.type] ?? {
    label: formatLabel(group.type),
    description: "Training block",
  };

  const exercises = group.exercises ?? [];

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex min-w-0 items-start gap-2 p-2 sm:p-3">
        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-label={isExpanded ? "Collapse block" : "Expand block"}
          aria-expanded={isExpanded}
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-surface-secondary"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          className="min-w-0 flex-1 text-left"
        >
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-foreground sm:text-sm">
              {meta.label}
            </h3>
          </div>

          {exercises.length > 0 ? (
            <ul className="space-y-1">
              {exercises.map((exercise, index) => (
                <li
                  key={exercise.id}
                  className="flex min-w-0 items-start gap-2 text-xs text-foreground sm:text-sm"
                >
                  <span className="shrink-0 text-secondary">{index + 1}.</span>

                  <span className="min-w-0 break-words">{exercise.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-secondary">No exercises added yet.</p>
          )}
        </button>

        <button
          type="button"
          onClick={() => onEditGroup(group)}
          aria-label="Edit training block"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-surface-secondary hover:text-foreground"
        >
          <Pencil size={14} />
        </button>

        <button
          type="button"
          onClick={() => onDeleteGroup(group)}
          aria-label="Delete training block"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="min-w-0 space-y-2 border-t border-border p-2 sm:space-y-3 sm:p-3">
          {exercises.length > 0 ? (
            <>
              <div className="grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2">
                {exercises.map((exercise) => (
                  <ExerciseSummary
                    key={exercise.id}
                    exercise={exercise}
                    onEdit={onEditExercise}
                  />
                ))}
              </div>

              <SetTable exercises={exercises} />
            </>
          ) : (
            <p className="py-4 text-center text-xs text-secondary">
              No exercises in this block yet.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
