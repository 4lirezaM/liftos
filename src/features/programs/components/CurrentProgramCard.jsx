import { Dumbbell } from "lucide-react";

import {
  PROGRAM_TYPE_OPTIONS,
  PROGRAM_DIFFICULTY_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
} from "../constants/programOptions";

export default function CurrentProgramCard({
  program,
  isLoading = false,
  onClick,
}) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="animate-pulse p-5 sm:p-6 lg:p-7">
          <div className="h-4 w-28 rounded bg-foreground/10" />

          <div className="mt-4 h-8 w-2/3 rounded bg-foreground/10" />

          <div className="mt-2 h-4 w-1/2 rounded bg-foreground/10" />

          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            <SkeletonDetail />
            <SkeletonDetail />
            <SkeletonDetail />
            <SkeletonDetail />
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-background">
        <div className="flex flex-col items-center px-5 py-10 text-center sm:px-6 sm:py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Dumbbell size={22} strokeWidth={1.8} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
            No active program
          </h2>

          <p className="mt-1 max-w-md text-sm text-foreground/60">
            Choose a program to start tracking your workouts.
          </p>
        </div>
      </div>
    );
  }

  const programType =
    PROGRAM_TYPE_OPTIONS.find((option) => option.value === program.program_type)
      ?.label ?? "—";

  const goal =
    PROGRAM_GOAL_OPTIONS.find((option) => option.value === program.goal)
      ?.label ?? "—";

  const difficulty =
    PROGRAM_DIFFICULTY_OPTIONS.find(
      (option) => option.value === program.difficulty
    )?.label ?? "—";

  const programTypeImage = program.program_type
    ? `/programtypes/${program.program_type}.jpg`
    : null;
  return (
    <article
      onClick={() => onClick?.(program)}
      className="
        group
        overflow-hidden
        rounded-2xl
        border border-primary/30
        bg-background
        transition-all
        hover:shadow-sm
      "
    >
      {/* Accent header */}
      <div
        className="
    relative
    overflow-hidden
    bg-primary-400
    text-foreground
    dark:bg-primary-200
  "
      >
        {/* Decorative circles */}
        <div
          className="
      absolute
      -right-10
      -top-10
      h-36
      w-36
      rounded-full
      bg-white/10
    "
        />

        <div
          className="
      absolute
      -bottom-16
      right-20
      h-32
      w-32
      rounded-full
      bg-white/5
    "
        />

        {/* Program Type Image */}
        {programTypeImage && (
          <div
            className="
        absolute
        inset-y-0
        left-0
        z-10
        aspect-[287/404]
        h-full
        overflow-hidden
      "
          >
            <img
              src={programTypeImage}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <div
          className="
      relative
      flex
      min-h-[150px]
      items-center
      pl-[calc(150px*0.71+16px)]
      pr-5
      py-5

      sm:min-h-[165px]
      sm:pl-[calc(165px*0.71+20px)]
      sm:pr-6
      sm:py-6

      lg:min-h-[180px]
      lg:pl-[calc(180px*0.71+24px)]
      lg:pr-7
      lg:py-7
    "
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
            rounded-full
            bg-primary-200
            px-2.5
            py-1
            text-[11px]
            font-semibold
            text-black
            dark:bg-primary
          "
              >
                Active
              </span>

              <span className="text-xs text-white/70">Current program</span>
            </div>

            <h2
              className="
          mt-2
          line-clamp-2
          text-xl
          font-bold
          leading-6

          sm:text-2xl
          sm:leading-7

          lg:text-3xl
          lg:leading-8
        "
            >
              {program.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Program information */}
      <div className="px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          <ProgramDetail label="Type" value={programType} />

          <ProgramDetail label="Goal" value={goal} />

          <ProgramDetail label="Difficulty" value={difficulty} />

          <ProgramDetail
            label="Duration"
            value={
              program.duration_weeks ? `${program.duration_weeks} weeks` : "—"
            }
          />
        </div>

        {/* Frequency */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <div>
            <p className="text-xs text-foreground/50">Training frequency</p>

            <p className="mt-1 text-sm font-semibold text-foreground sm:text-[15px]">
              {program.days_per_week
                ? `${program.days_per_week} days per week`
                : "Not specified"}
            </p>
          </div>

          <span className="text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">
            View program →
          </span>
        </div>
      </div>
    </article>
  );
}

function ProgramDetail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-foreground/45">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-semibold text-foreground sm:text-[15px]">
        {value}
      </p>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div>
      <div className="h-3 w-16 rounded bg-foreground/10" />
      <div className="mt-2 h-4 w-24 rounded bg-foreground/10" />
    </div>
  );
}
