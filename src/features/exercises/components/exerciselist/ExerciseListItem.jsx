import ExerciseBadge from "./ExerciseBadge";

export default function ExerciseListItem({ exercise, onClick }) {
  const isPersonalExercise = exercise.created_by !== null;
  const isArchived = exercise.is_archived;

  return (
    <article
      onClick={() => onClick?.(exercise)}
      className="
        group
        flex w-full
        cursor-pointer
        items-center gap-3
        border-b border-border
        px-4 py-3
        text-left
        transition-colors
        last:border-b-0
        hover:bg-foreground/[0.03]

        sm:gap-4
        sm:px-5
        sm:py-4

        lg:px-6
        lg:py-5
      "
    >
      {/* Exercise Thumbnail */}
      <div
        className="
          h-12 w-12
          shrink-0
          overflow-hidden
          rounded-lg
          bg-foreground/[0.05]

          sm:h-16 sm:w-16

          lg:h-20 lg:w-20
          lg:rounded-xl
        "
      >
        {exercise.thumbnail_url ? (
          <img
            src={exercise.thumbnail_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      {/* Exercise Information */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <p
          className="
            truncate
            text-sm font-semibold text-foreground

            sm:text-base

            lg:text-lg
          "
        >
          {exercise.name}
        </p>

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
      </div>

      {/* Mobile / Tablet Status */}
      <div
        className="
          flex
          max-w-22.5
          shrink-0
          flex-col
          items-end
          gap-1.5

          lg:hidden
        "
      >
        {isPersonalExercise && <ExerciseBadge>Personal</ExerciseBadge>}

        {isArchived && <ExerciseBadge>Archived</ExerciseBadge>}
      </div>

      {/* Desktop Information */}
      <div
        className="
          hidden
          min-w-0
          lg:flex
          lg:w-[34%]
          lg:items-center
          lg:gap-6
        "
      >
        {/* Secondary Muscles */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-foreground/50">Secondary</p>

          <p className="mt-1 truncate text-sm text-foreground/70">
            {exercise.secondary_muscles?.length
              ? exercise.secondary_muscles.join(", ")
              : "—"}
          </p>
        </div>

        {/* Body Region */}
        <div className="w-24 shrink-0">
          <p className="truncate text-xs text-foreground/50">Region</p>

          <p className="mt-1 truncate text-sm text-foreground/70">
            {exercise.body_region || "—"}
          </p>
        </div>

        {/* Personal / Archived */}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {isPersonalExercise && <ExerciseBadge>Personal</ExerciseBadge>}

          {isArchived && <ExerciseBadge>Archived</ExerciseBadge>}
        </div>
      </div>
    </article>
  );
}
