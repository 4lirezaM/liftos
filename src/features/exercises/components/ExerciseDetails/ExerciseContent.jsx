import { useNotification } from "../../../../shared/ui/notification";
import { useExerciseMutations } from "../../hooks/useExerciseMutations";
import { Archive } from "lucide-react";
import { ArchiveRestore } from "lucide-react";
const ExerciseContent = ({ exercise }) => {
  const isPersonalExercise = exercise.created_by !== null;
  const isArchived = exercise.is_archived;
  const { notify } = useNotification();
  const { archiveExercise, isArchiving, restoreExercise, isRestoring } =
    useExerciseMutations();

  const handleArchive = () => {
    archiveExercise(
      { id: exercise.id },
      {
        onSuccess: () => {
          notify({
            type: "warning",
            title: "Exercise archived",
            actionLabel: "Undo",
            onAction: () => {
              restoreExercise({ id: exercise.id });
            },
          });
        },
      }
    );
  };

  const handleRestore = () => {
    restoreExercise({
      id: exercise.id,
    });
  };

  return (
    <div className="overflow-hidden">
      {/* Exercise Media */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl">
        {exercise.media_url ? (
          <img
            src={exercise.media_url}
            alt={exercise.name}
            className="
              h-60
              w-60
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
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="
                text-xl
                font-semibold
                leading-tight
                tracking-tight
                text-foreground
                sm:text-2xl
              "
            >
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

          <p className="mt-1.5 text-sm text-foreground/55">
            {exercise.primary_muscle}
            {exercise.equipment && ` · ${exercise.equipment}`}
          </p>
        </header>

        {/* Exercise Details */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Exercise details
          </h3>

          <div
            className="
              overflow-hidden
              rounded-xl
              border border-border
            "
          >
            <DetailItem
              label="Primary muscle"
              value={exercise.primary_muscle}
            />

            <DetailItem label="Body region" value={exercise.body_region} />

            <DetailItem label="Equipment" value={exercise.equipment} />

            <DetailItem
              label="Source"
              value={isPersonalExercise ? "My Exercise" : "System"}
            />
            {isPersonalExercise && (
              <DetailItem
                label="Status"
                value={isArchived ? "Archived" : "Active"}
                isLast
              />
            )}
          </div>
        </section>

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
                    rounded-md
                    border border-border
                    bg-foreground/[0.02]
                    px-2.5 py-1.5
                    text-xs
                    text-foreground/65
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
        {isPersonalExercise && (
          <>
            {!isArchived ? (
              <button
                type="button"
                onClick={handleArchive}
                disabled={isArchiving}
                className={[
                  "flex min-h-11 w-full items-center justify-center gap-2",
                  "cursor-pointer rounded-lg border",
                  "border-amber-400/40 bg-amber-400/10",
                  "px-4 py-2.5",
                  "text-sm font-medium text-amber-400",
                  "transition-colors duration-200",
                  "hover:border-amber-400/70 hover:bg-amber-400/20",
                  "active:border-amber-400 active:bg-amber-400/30",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-amber-400/50",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "sm:w-auto",
                ].join(" ")}
              >
                <Archive className="size-4 shrink-0" aria-hidden="true" />

                {isArchiving ? "Archiving..." : "Archive Exercise"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRestore}
                disabled={isRestoring}
                className={[
                  "flex min-h-11 w-full items-center justify-center gap-2",
                  "cursor-pointer rounded-lg border",
                  "border-primary/40 bg-primary/10",
                  "px-4 py-2.5",
                  "text-sm font-medium text-primary",
                  "transition-colors duration-200",
                  "hover:border-primary/60 hover:bg-primary/15",
                  "active:bg-primary/20",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/50",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "sm:w-auto",
                ].join(" ")}
              >
                <ArchiveRestore
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />

                {isRestoring ? "Restoring..." : "Restore Exercise"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, isLast = false }) => {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        px-4
        py-3

        ${!isLast ? "border-b border-border" : ""}
      `}
    >
      <span className="shrink-0 text-sm text-foreground/50">{label}</span>

      <span
        className="
          truncate
          text-right
          text-sm
          font-medium
          text-foreground/85
        "
      >
        {value || "—"}
      </span>
    </div>
  );
};

export default ExerciseContent;
