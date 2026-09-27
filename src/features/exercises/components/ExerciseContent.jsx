const ExerciseContent = ({ exercise }) => {
  const isPersonalExercise = exercise.created_by !== null;
  const isArchived = exercise.is_archived;

  return (
    <div className="overflow-hidden">
      {/* Exercise Media */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl">
        {exercise.media_url ? (
          <img
            src={exercise.media_url}
            alt={exercise.name}
            className="
              h-[240px]
              w-[240px]
              rounded-xl
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              aspect-video
              w-full
              items-center
              justify-center
              text-sm
              text-foreground/40
            "
          >
            No preview available
          </div>
        )}

        {isArchived && (
          <div className="absolute left-3 top-3">
            <span
              className="
                rounded-md
                bg-background/90
                px-2.5 py-1
                text-xs
                font-medium
                text-foreground
                backdrop-blur-sm
              "
            >
              Archived
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6 px-1 pb-6 pt-5">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {exercise.name}
            </h2>

            {isPersonalExercise && (
              <span
                className="
                  rounded-md
                  bg-primary/10
                  px-2 py-1
                  text-xs
                  font-medium
                  text-primary
                "
              >
                Personal
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-foreground/60">
            {exercise.primary_muscle}
            {exercise.equipment && ` · ${exercise.equipment}`}
          </p>
        </div>

        {/* Exercise Details */}
        <div className="grid grid-cols-2 gap-3">
          <DetailItem label="Primary muscle" value={exercise.primary_muscle} />

          <DetailItem label="Body region" value={exercise.body_region} />

          <DetailItem label="Equipment" value={exercise.equipment} />

          <DetailItem
            label="Source"
            value={isPersonalExercise ? "My Exercise" : "System"}
          />
        </div>

        {/* Secondary Muscles */}
        {exercise.secondary_muscles?.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-foreground">
              Secondary muscles
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {exercise.secondary_muscles.map((muscle) => (
                <span
                  key={muscle}
                  className="
                    rounded-lg
                    border
                    border-border
                    bg-foreground/[0.03]
                    px-3 py-1.5
                    text-xs
                    text-foreground/70
                  "
                >
                  {muscle}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {exercise.description && (
          <section>
            <h3 className="text-sm font-semibold text-foreground">
              Description
            </h3>

            <p
              className="
                mt-3
                whitespace-pre-line
                text-sm
                leading-6
                text-foreground/65
              "
            >
              {exercise.description}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <div
      className="
        rounded-xl
        border border-border
        bg-foreground/[0.02]
        px-3.5 py-3
      "
    >
      <p className="text-xs text-foreground/45">{label}</p>

      <p className="mt-1.5 truncate text-sm font-medium text-foreground/85">
        {value || "—"}
      </p>
    </div>
  );
};

export default ExerciseContent;
