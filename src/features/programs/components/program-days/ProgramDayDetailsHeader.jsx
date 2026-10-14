import {
  Pencil,
  Trash2,
  Layers3,
  Dumbbell,
  Repeat2,
  Workflow,
  Flame,
  ListChecks,
} from "lucide-react";
import { useParams } from "react-router-dom";

import { useProgramDayStructure } from "../../hooks/programDays/useProgramDayStructure";
import { useProgramDay } from "../../hooks/programDays/useProgramDay";

function CountPill({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
      <Icon size={13} strokeWidth={1.8} />
      <span>{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function getStats(groups = []) {
  const stats = {
    totalGroups: groups.length,
    totalExercises: 0,
    supersets: 0,
    trisets: 0,
    giantSets: 0,
    warmUpSets: 0,
    totalSets: 0,
  };

  for (const group of groups) {
    switch (group.group_type ?? group.type) {
      case "superset":
        stats.supersets += 1;
        break;
      case "triset":
        stats.trisets += 1;
        break;
      case "giant_set":
        stats.giantSets += 1;
        break;
      default:
        break;
    }

    const exercises = group.program_day_exercises ?? [];

    stats.totalExercises += exercises.length;

    for (const exercise of exercises) {
      const sets = exercise.program_day_exercise_sets ?? [];

      stats.totalSets += sets.length;

      stats.warmUpSets += sets.filter(
        (set) => set.set_category === "warmup"
      ).length;
    }
  }

  return stats;
}

export default function ProgramDayDetailsHeader({ onEdit, onDelete }) {
  const { dayId } = useParams();

  const {
    data: programDay,
    isPending: isProgramDayPending,
    isError: isProgramDayError,
  } = useProgramDay(dayId);

  const {
    data: groups = [],
    isPending: isStructurePending,
    isError: isStructureError,
  } = useProgramDayStructure(dayId);

  const stats = getStats(groups);

  const isPending = isProgramDayPending || isStructurePending;
  const isError = isProgramDayError || isStructureError;

  const statItems = [
    { label: "Training blocks", value: stats.totalGroups, icon: Layers3 },
    { label: "Total exercises", value: stats.totalExercises, icon: Dumbbell },
    { label: "Supersets", value: stats.supersets, icon: Repeat2 },
    { label: "Trisets", value: stats.trisets, icon: Workflow },
    { label: "Giant sets", value: stats.giantSets, icon: Layers3 },
    { label: "Warm-up sets", value: stats.warmUpSets, icon: Flame },
    { label: "Total sets", value: stats.totalSets, icon: ListChecks },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="bg-surface-secondary/50 p-3 sm:p-5 lg:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            Program day {programDay?.position ?? "—"}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(programDay)}
              disabled={!programDay || !onEdit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-slate-800 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(programDay)}
              disabled={!programDay || !onDelete}
              aria-label="Delete program day"
              title="Delete day"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:size-9"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {isProgramDayPending ? (
          <p className="text-sm text-muted-foreground">
            Loading program day...
          </p>
        ) : isProgramDayError ? (
          <p className="text-sm text-red-600">
            Could not load program day details.
          </p>
        ) : (
          <div>
            <h1 className="break-words text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
              {programDay?.name ?? "Program day"}
            </h1>

            {programDay?.description && (
              <p className="mt-2 max-w-2xl whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground sm:text-sm">
                {programDay.description}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {isPending ? (
            <p className="text-xs text-muted-foreground">
              Loading workout statistics...
            </p>
          ) : isError ? (
            <p className="text-xs text-red-600">
              Could not load workout statistics.
            </p>
          ) : (
            statItems.map((item) => <CountPill key={item.label} {...item} />)
          )}
        </div>
      </div>
    </section>
  );
}
