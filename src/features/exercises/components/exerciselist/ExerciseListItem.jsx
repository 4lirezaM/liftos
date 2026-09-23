export default function ExerciseListItem({ exercise, onClick }) {
  const isSystemExercise = exercise.created_by === null;
  const isArchived = exercise.is_archived;

  return (
    <button
      type="button"
      onClick={() => onClick?.(exercise)}
      className="
        group
        flex w-full items-center gap-3
        border-b border-border
        px-4 py-3
        text-left
        transition-colors
        last:border-b-0
        hover:bg-foreground/[0.03]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-inset
        focus-visible:ring-primary

        sm:gap-4
        sm:px-5
        sm:py-4

        lg:px-6
        lg:py-5
      "
    >
      {/* Exercise Image */}
      <div
        className="
          flex
          h-14 w-14
          shrink-0
          items-center justify-center
          overflow-hidden
          rounded-lg
          bg-foreground/[0.05]

          sm:h-16 sm:w-16

          lg:h-20 lg:w-20
          lg:rounded-xl
        "
        aria-hidden="true"
      >
        {/* Temporary placeholder until exercise images are added */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="
            h-6 w-6
            text-foreground/40

            sm:h-7 sm:w-7

            lg:h-8 lg:w-8
          "
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>

      {/* Exercise Information */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <div className="flex min-w-0 items-center gap-2">
          <p
            className="
              min-w-0 truncate
              text-sm font-semibold text-foreground

              sm:text-base

              lg:text-lg
            "
          >
            {exercise.name}
          </p>
        </div>

        {/* Primary Muscle + Equipment */}
        <p
          className="
            mt-1 truncate
            text-xs text-foreground/60

            sm:text-sm
          "
        >
          {exercise.primary_muscle}
          {exercise.equipment && ` · ${exercise.equipment}`}
        </p>

        {/* Movement Pattern — Tablet + Desktop */}
        {exercise.movement_pattern && (
          <p
            className="
              mt-1 hidden truncate
              text-xs text-foreground/50

              md:block
              lg:text-sm
            "
          >
            {exercise.movement_pattern}
          </p>
        )}

        {/* Badges — Mobile + Tablet */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 lg:hidden">
          <span
            className="
              inline-flex items-center
              rounded-full
              border border-border
              px-2 py-0.5
              text-[10px] font-medium
              text-foreground/60

              sm:text-xs
            "
          >
            {isSystemExercise ? "System" : "My"}
          </span>

          {isArchived && (
            <span
              className="
                inline-flex items-center
                rounded-full
                border border-border
                px-2 py-0.5
                text-[10px] font-medium
                text-foreground/60

                sm:text-xs
              "
            >
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Desktop Information */}
      <div className="hidden lg:flex lg:w-[34%] lg:items-center lg:gap-6">
        {/* Secondary Muscles */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-foreground/50">Secondary</p>

          <p className="mt-1 truncate text-sm text-foreground/70">
            {exercise.secondary_muscles?.length
              ? exercise.secondary_muscles.join(", ")
              : "—"}
          </p>
        </div>

        {/* Exercise Type */}
        <div className="w-24 shrink-0">
          <p className="truncate text-xs text-foreground/50">Type</p>

          <p className="mt-1 truncate text-sm text-foreground/70">
            {exercise.exercise_type || "—"}
          </p>
        </div>

        {/* Source / Archived */}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <span
            className="
        inline-flex shrink-0 items-center
        rounded-full
        border border-border
        px-2 py-1
        text-xs font-medium
        text-foreground/60
      "
          >
            {isSystemExercise ? "System" : "My"}
          </span>

          {isArchived && (
            <span
              className="
          inline-flex shrink-0 items-center
          rounded-full
          border border-border
          px-2 py-1
          text-xs font-medium
          text-foreground/60
        "
            >
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          ml-2
          shrink-0
          text-foreground/50
          transition-colors
          group-hover:text-foreground/80
        "
        aria-hidden="true"
      >
        ⋮
      </div>
    </button>
  );
}
