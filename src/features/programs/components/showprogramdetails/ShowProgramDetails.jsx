import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Archive, Check, Pencil, Play, RotateCcw } from "lucide-react";

import { useProgram } from "@/features/programs/hooks/programs/useProgram";
import { useActivateProgram } from "@/features/programs/hooks/programs/useActivateProgram";
import { useArchiveProgram } from "@/features/programs/hooks/programs/useArchiveProgram";
import { useRestoreProgram } from "@/features/programs/hooks/programs/useRestoreProgram";

import ProgramFormModal from "@/features/programs/components/forms/ProgramFormModal";
import { useNotification } from "@/shared/ui/notification";

import {
  PROGRAM_TYPE_OPTIONS,
  PROGRAM_DIFFICULTY_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
} from "@/features/programs/constants/programOptions";
import { ProgramDetailsSkeleton } from "./ProgramDetailsSkeleton";
import { ActionButton } from "./ActionButton";
import { DetailItem } from "./DetailItem";

const getOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value ?? "—";

export default function ShowProgramDetails({ programId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { notify } = useNotification();

  const { data: program, isPending, isError, error } = useProgram(programId);

  const activateMutation = useActivateProgram();
  const archiveMutation = useArchiveProgram();
  const restoreMutation = useRestoreProgram();

  const isBusy =
    activateMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending;

  const mutationError =
    activateMutation.error || archiveMutation.error || restoreMutation.error;

  const invalidateProgramQueries = async () => {
    await Promise.all([
      // Invalidate all program lists, including different filters and searches.
      queryClient.invalidateQueries({
        queryKey: ["programs"],
      }),

      // Invalidate the active program query for the current user.
      queryClient.invalidateQueries({
        queryKey: ["activeProgram", program?.created_by],
      }),

      // Invalidate the current program details.
      queryClient.invalidateQueries({
        queryKey: ["program", program?.created_by, programId],
      }),
    ]);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    invalidateProgramQueries();
  };

  const handleActivate = () => {
    activateMutation.mutate(programId, {
      onSuccess: async () => {
        await invalidateProgramQueries();

        notify({
          type: "success",
          title: "Program activated",
          message: "Your program has been activated successfully.",
        });
      },
      onError: (error) => {
        notify({
          type: "error",
          title: "Activation failed",
          message: error.message || "Please try again.",
        });
      },
    });
  };

  const handleArchive = () => {
    archiveMutation.mutate(programId, {
      onSuccess: () => {
        notify({
          type: "warning",
          title: "Program archived",
          message: "Your program has been archived.",
          actionLabel: "Undo",
          onAction: () => {
            restoreMutation.mutate(programId, {
              onSuccess: () => {
                notify({
                  type: "success",
                  title: "Program restored",
                  message: "Your program is available again.",
                });
              },
              onError: (error) => {
                notify({
                  type: "error",
                  title: "Restore failed",
                  message: error.message || "Please try again.",
                });
              },
            });
          },
        });
      },
      onError: (error) => {
        notify({
          type: "error",
          title: "Archive failed",
          message: error.message || "Please try again.",
        });
      },
    });
  };

  const handleRestore = () => {
    restoreMutation.mutate(programId, {
      onSuccess: () => {
        notify({
          type: "success",
          title: "Program restored",
          message: "Your program is available again.",
        });
      },
    });
  };

  if (isPending) {
    return <ProgramDetailsSkeleton />;
  }

  if (isError || !program) {
    return (
      <div className="py-8" role="alert">
        <h1 className="text-xl font-semibold text-foreground">
          {isError ? "Unable to load program" : "Program not found"}
        </h1>

        {isError && (
          <p className="mt-2 text-sm text-red-500">
            {error?.message || "Something went wrong."}
          </p>
        )}
      </div>
    );
  }

  const isArchived = program.is_archived === true;
  const isActive = program.is_active === true;

  const coverImage = `/programtypes/${program.program_type}_cover.jpg`;

  return (
    <>
      <section className="space-y-6">
        {/* Program cover */}
        <div className="mx-auto w-full max-w-123 md:w-1/2">
          <div className="relative aspect-492/404 w-full overflow-hidden rounded-xl bg-foreground/2">
            <img
              src={coverImage}
              alt=""
              aria-hidden="true"
              width={492}
              height={404}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Program heading */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground/65">
              {getOptionLabel(PROGRAM_TYPE_OPTIONS, program.program_type)}
            </span>

            <span
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                isArchived
                  ? "bg-foreground/5 text-foreground/55"
                  : isActive
                  ? "bg-primary-500/10 text-primary-500"
                  : "bg-foreground/5 text-foreground/60"
              }`}
            >
              {isArchived ? "Archived" : isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {program.name}
          </h1>

          <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-foreground/60">
            {program.description || "No description provided."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-y border-foreground/10 py-4">
          <ActionButton
            onClick={() => setIsEditModalOpen(true)}
            disabled={isBusy}
          >
            <Pencil size={16} strokeWidth={1.8} />
            Edit program
          </ActionButton>

          {!isArchived && !isActive && (
            <ActionButton
              onClick={handleActivate}
              disabled={isBusy}
              variant="primary"
            >
              <Play size={16} strokeWidth={1.8} />
              {activateMutation.isPending ? "Activating..." : "Activate"}
            </ActionButton>
          )}

          {isActive && !isArchived && (
            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-500">
              <Check size={16} />
              Currently active
            </span>
          )}

          {isArchived ? (
            <ActionButton
              onClick={handleRestore}
              disabled={isBusy}
              variant="primary"
            >
              <RotateCcw size={16} strokeWidth={1.8} />
              {restoreMutation.isPending ? "Restoring..." : "Restore"}
            </ActionButton>
          ) : (
            <ActionButton
              onClick={handleArchive}
              disabled={isBusy}
              variant="warning"
            >
              <Archive size={16} strokeWidth={1.8} />
              {archiveMutation.isPending ? "Archiving..." : "Archive"}
            </ActionButton>
          )}
        </div>

        {/* Program details */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Program details
          </h2>

          <p className="mt-1 text-sm text-foreground/50">
            Training specifications and program information
          </p>

          <div className="mt-4 grid grid-cols-1 divide-y divide-foreground/10 border-y border-foreground/10 sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 lg:grid-cols-3 lg:gap-x-10">
            <DetailItem
              label="Program type"
              value={getOptionLabel(PROGRAM_TYPE_OPTIONS, program.program_type)}
            />

            <DetailItem
              label="Training days per week"
              value={
                program.days_per_week != null
                  ? `${program.days_per_week} days`
                  : "—"
              }
            />

            <DetailItem
              label="Duration"
              value={
                program.duration_weeks != null
                  ? `${program.duration_weeks} weeks`
                  : "—"
              }
            />

            <DetailItem
              label="Difficulty"
              value={getOptionLabel(
                PROGRAM_DIFFICULTY_OPTIONS,
                program.difficulty
              )}
            />

            <DetailItem
              label="Training goal"
              value={getOptionLabel(PROGRAM_GOAL_OPTIONS, program.goal)}
            />

            <DetailItem
              label="Created at"
              value={
                program.created_at
                  ? new Date(program.created_at).toLocaleDateString()
                  : "—"
              }
            />
          </div>
        </div>
      </section>

      {/* Edit program modal */}
      <ProgramFormModal
        isOpen={isEditModalOpen}
        mode="edit"
        program={program}
        onClose={handleCloseEdit}
        notify={notify}
      />
    </>
  );
}
