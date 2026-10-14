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
  const [isExpanded, setIsExpanded] = useState(true);

  const meta = GROUP_META[group.type] ?? {
    label: formatLabel(group.type),
    description: "Training block",
  };

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex min-w-0 items-center gap-2 p-2 sm:p-3">
        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-label={isExpanded ? "Collapse block" : "Expand block"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-surface-secondary"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          className="min-w-0 flex-1 text-left"
        >
          <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm">
            {meta.label}
          </h3>
          <p className="mt-0.5 text-[10px] text-secondary">
            {group.exercises.length} exercises
          </p>
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
          {group.exercises.length > 0 ? (
            <>
              <div className="grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2">
                {group.exercises.map((exercise) => (
                  <ExerciseSummary
                    key={exercise.id}
                    exercise={exercise}
                    onEdit={onEditExercise}
                  />
                ))}
              </div>

              <SetTable exercises={group.exercises} />
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
