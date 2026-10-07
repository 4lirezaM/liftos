import { PROGRAM_TYPE_OPTIONS } from "../../constants/programOptions";

export default function ProgramListItem({ program, onClick }) {
  const programType =
    PROGRAM_TYPE_OPTIONS.find((option) => option.value === program.program_type)
      ?.label ?? "—";

  const programTypeImage = program.program_type
    ? `/programtypes/${program.program_type}.jpg`
    : null;

  return (
    <article
      onClick={() => onClick?.(program)}
      className="
        group
        flex w-full
        cursor-pointer
        items-stretch
        border-b border-border
        text-left
        transition-colors
        last:border-b-0
        hover:bg-foreground/[0.03]
      "
    >
      {/* Active Status */}
      {program.is_active && (
        <div
          className="
            flex
            w-7
            shrink-0
            items-center
            justify-center
            bg-primary
            text-slate-900
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              [writing-mode:vertical-rl]
              [text-orientation:mixed]
            "
          >
            Active
          </span>
        </div>
      )}

      {/* Main Content */}
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-4
          px-2
          py-2

          sm:gap-5
          sm:px-5
          sm:py-6

          lg:gap-6
          lg:px-6
          lg:py-6
        "
      >
        {/* Program Type Image */}
        {programTypeImage && (
          <div
            className="
                 h-[88px]
    w-[63px]
    shrink-0
    overflow-hidden
    rounded-lg
    bg-foreground/[0.04]

    sm:h-[105px]
    sm:w-[75px]

    lg:h-[123px]
    lg:w-[87px]
            "
          >
            <img
              src={programTypeImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Program Information */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <p
            className="
      line-clamp-2
      text-sm
      font-semibold
      leading-5
      text-foreground

      sm:text-base
      sm:leading-5

      lg:text-lg
      lg:leading-6
    "
          >
            {program.name}
          </p>

          {/* Program Type + Goal */}
          <p
            className="
      mt-1
      line-clamp-2
      text-[11px]
      leading-4
      text-foreground/60

      sm:text-xs
      sm:leading-4

      lg:text-sm
      lg:leading-5
    "
          >
            {programType}
            {program.goal && ` · ${program.goal}`}
          </p>
        </div>

        {/* Desktop Program Information */}
        <div
          className="
            hidden
            min-w-0
            lg:flex
            lg:w-[38%]
            lg:items-center
            lg:gap-8
          "
        >
          {/* Difficulty */}
          <div className="w-24 shrink-0">
            <p className="truncate text-xs text-foreground/50">Difficulty</p>

            <p className="mt-1 truncate text-sm text-foreground/70">
              {program.difficulty || "—"}
            </p>
          </div>

          {/* Duration */}
          <div className="w-24 shrink-0">
            <p className="truncate text-xs text-foreground/50">Duration</p>

            <p className="mt-1 truncate text-sm text-foreground/70">
              {program.duration_weeks ? `${program.duration_weeks} weeks` : "—"}
            </p>
          </div>
        </div>

        {/* Frequency - visible on all sizes */}
        <div className="shrink-0 text-center">
          <p
            className="
      text-lg
      font-semibold
      leading-5
      text-primary

      sm:text-xl
      sm:leading-6
    "
          >
            {program.days_per_week ?? "—"}
          </p>

          <p
            className="
      mt-0.5
      text-[10px]
      font-medium
      italic
      leading-3
      text-foreground/40
              tracking-[0.18em]
              [writing-mode:vertical-rl]
              [text-orientation:mixed]
    "
          >
            /week
          </p>
        </div>
      </div>
    </article>
  );
}
