import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import SelectedExercisesSection from "./selected-exercises/SelectedExercisesSection";
import ExerciseLibraryPicker from "./selected-exercises/ExerciseLibraryPicker";

import { useProgramDayExercisesByGroupId } from "@/features/programs/hooks/programDayExercises/useProgramDayExercisesByGroupId";
import { useCreateProgramDayExerciseGroup } from "@/features/programs/hooks/programDayExerciseGroups/useCreateProgramDayExerciseGroup";
import { useAddProgramDayExercise } from "@/features/programs/hooks/programDayExercises/useAddProgramDayExercise";
import { useRemoveProgramDayExercise } from "@/features/programs/hooks/programDayExercises/useRemoveProgramDayExercise";
import { useRemoveProgramDayExerciseSet } from "@/features/programs/hooks/programDayExerciseSets/useRemoveProgramDayExerciseSet";
import { useReorderProgramDayExercises } from "@/features/programs/hooks/programDayExercises/useReorderProgramDayExercises";

import { getProgramDayExercisesByGroupId } from "@/features/programs/api/programDayExercisesApi";

/**
 * Returns the ID of the underlying exercise from the library.
 * `id` may instead refer to a program_day_exercises record.
 */
function getLibraryId(exercise) {
  return exercise.exercise_id ?? exercise.exercise?.id ?? exercise.id;
}

/**
 * Normalizes library exercises and saved program-day exercise records
 * into a consistent shape for the form.
 */
function normalizeExercise(exercise) {
  const libraryExercise = exercise.exercise ?? exercise;

  return {
    ...libraryExercise,
    ...exercise,
    exercise_id: getLibraryId(exercise),
    name: exercise.name ?? libraryExercise.name,
    media_url: exercise.media_url ?? libraryExercise.media_url ?? null,
    thumbnail_url:
      exercise.thumbnail_url ?? libraryExercise.thumbnail_url ?? null,
    group_id: exercise.group_id ?? null,
    position: exercise.position ?? null,
  };
}

function haveSameOrder(first, second) {
  if (first.length !== second.length) return false;

  return first.every(
    (exercise, index) => getLibraryId(exercise) === getLibraryId(second[index])
  );
}

function createExerciseMaps(exercises) {
  return new Map(
    exercises.map((exercise) => [getLibraryId(exercise), exercise])
  );
}

export default function ExerciseGroupForm({
  mode = "edit",
  exerciseGroup,
  groupId = exerciseGroup?.id,
  programDayId = exerciseGroup?.program_day_id,
  groupType,
  onClose,
  onSaved,
  notify,
}) {
  const isCreateMode = mode === "create";
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [originalExercises, setOriginalExercises] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const exercisesQuery = useProgramDayExercisesByGroupId(
    isCreateMode ? null : groupId
  );

  const createGroupMutation = useCreateProgramDayExerciseGroup();
  const addExerciseMutation = useAddProgramDayExercise();
  const removeExerciseMutation = useRemoveProgramDayExercise();
  const removeSetsMutation = useRemoveProgramDayExerciseSet();
  const reorderMutation = useReorderProgramDayExercises();

  const isLoading =
    !isCreateMode && Boolean(groupId) && exercisesQuery.isPending;

  const loadError = !isCreateMode && exercisesQuery.isError;

  const hasChanges = useMemo(() => {
    // A new group itself is a change, even when it contains no exercises.
    if (isCreateMode) return true;

    return !haveSameOrder(originalExercises, selectedExercises);
  }, [isCreateMode, originalExercises, selectedExercises]);

  // Initialize the edit draft from the server without overwriting
  // unsaved local edits when the query refetches.
  useEffect(() => {
    if (isCreateMode) {
      setOriginalExercises([]);
      setSelectedExercises([]);
      return;
    }

    if (!groupId || !exercisesQuery.data) return;

    const normalized = exercisesQuery.data.map(normalizeExercise);

    setOriginalExercises(normalized);
    setSelectedExercises(normalized);
  }, [isCreateMode, groupId, exercisesQuery.data]);
  const handleAddExercise = useCallback((exercise) => {
    const normalized = normalizeExercise(exercise);
    const libraryId = getLibraryId(normalized);

    if (!libraryId) return;

    setSelectedExercises((current) => {
      if (current.some((item) => getLibraryId(item) === libraryId)) {
        return current;
      }

      return [
        ...current,
        {
          ...normalized,
          exercise_id: libraryId,
          group_id: null,
          position: null,

          // This is a temporary UI ID, not a persisted record ID.
          id: libraryId,
        },
      ];
    });
  }, []);

  const handleRemoveExercise = useCallback((libraryId) => {
    setSelectedExercises((current) =>
      current.filter((exercise) => getLibraryId(exercise) !== libraryId)
    );
  }, []);

  const handleReorderExercises = useCallback((nextExercises) => {
    setSelectedExercises(nextExercises);
  }, []);

  const handleDiscard = useCallback(() => {
    setSelectedExercises(originalExercises);
  }, [originalExercises]);

  const handleSaveChanges = async () => {
    if (!hasChanges || isSaving || isLoading || loadError) {
      return;
    }

    if (!programDayId) {
      notify?.("Program Day ID is missing.", "error");
      return;
    }

    if (isCreateMode && !groupType) {
      notify?.("Exercise Group type is required.", "error");
      return;
    }

    if (!isCreateMode && !groupId) {
      notify?.("Exercise Group ID is missing.", "error");
      return;
    }

    setIsSaving(true);

    let targetGroupId = groupId;

    try {
      // 1. Create the group only when the user saves.
      if (isCreateMode) {
        const createdGroup = await createGroupMutation.mutateAsync({
          program_day_id: programDayId,
          group_type: groupType,
          position: exerciseGroup?.position ?? 1,
        });

        if (!createdGroup?.id) {
          throw new Error(
            "The exercise group was created without returning an ID."
          );
        }

        targetGroupId = createdGroup.id;
      }

      const originalByLibraryId = createExerciseMaps(originalExercises);
      const selectedByLibraryId = createExerciseMaps(selectedExercises);

      const removedExercises = originalExercises.filter(
        (exercise) => !selectedByLibraryId.has(getLibraryId(exercise))
      );

      const addedExercises = selectedExercises.filter(
        (exercise) => !originalByLibraryId.has(getLibraryId(exercise))
      );

      // 2. Remove sets before removing their parent exercise records.
      for (const exercise of removedExercises) {
        if (!exercise.id) {
          throw new Error(
            `Missing saved record ID for ${
              exercise.name ?? "a removed exercise"
            }.`
          );
        }

        await removeSetsMutation.mutateAsync({
          programDayExerciseId: exercise.id,
          programDayId,
        });

        await removeExerciseMutation.mutateAsync({
          exerciseRecordId: exercise.id,
          groupId: targetGroupId,
          programDayId,
        });
      }

      // 3. Add newly selected library exercises.
      for (const exercise of addedExercises) {
        const libraryId = getLibraryId(exercise);

        if (!libraryId) {
          throw new Error(
            `Missing library exercise ID for ${
              exercise.name ?? "a selected exercise"
            }.`
          );
        }

        await addExerciseMutation.mutateAsync({
          group_id: targetGroupId,
          exercise_id: libraryId,
          programDayId,
        });
      }

      // 4. Fetch persisted records to obtain their actual database IDs.
      const persistedRecords = (
        await getProgramDayExercisesByGroupId(targetGroupId)
      ).map(normalizeExercise);

      const persistedByLibraryId = createExerciseMaps(persistedRecords);

      const orderedRecordIds = selectedExercises.map((exercise) => {
        const persisted = persistedByLibraryId.get(getLibraryId(exercise));

        if (!persisted?.id) {
          throw new Error(
            `Could not find the saved record for ${
              exercise.name ?? "an exercise"
            }.`
          );
        }

        return persisted.id;
      });

      // 5. Persist the selected order.
      if (orderedRecordIds.length > 0) {
        await reorderMutation.mutateAsync({
          groupId: targetGroupId,
          programDayId,
          exerciseRecordIds: orderedRecordIds,
        });
      }

      // 6. Fetch the final saved state.
      const finalRecords = (
        await getProgramDayExercisesByGroupId(targetGroupId)
      ).map(normalizeExercise);

      const finalByLibraryId = createExerciseMaps(finalRecords);

      const orderedFinalExercises = selectedExercises.map((exercise) => {
        const persisted = finalByLibraryId.get(getLibraryId(exercise));

        if (!persisted?.id) {
          throw new Error(
            `Could not verify the saved record for ${
              exercise.name ?? "an exercise"
            }.`
          );
        }

        return persisted;
      });

      setOriginalExercises(orderedFinalExercises);
      setSelectedExercises(orderedFinalExercises);

      // 7. Refresh the relevant React Query caches.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["program-day-exercises", "group", targetGroupId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["programDayStructure", user?.id, programDayId],
        }),
      ]);

      notify?.("Exercise group saved successfully.", "success");

      onSaved?.({
        groupId: targetGroupId,
        exercises: orderedFinalExercises,
      });
    } catch (error) {
      console.error("Failed to save exercise group:", error);

      if (targetGroupId && !isCreateMode) {
        try {
          const persistedRecords = (
            await getProgramDayExercisesByGroupId(targetGroupId)
          ).map(normalizeExercise);

          setOriginalExercises(persistedRecords);
        } catch (refreshError) {
          console.error("Failed to refresh persisted exercises:", refreshError);
        }
      }

      notify?.(
        error?.message ??
          "Saving failed. Your current selection has been preserved.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex max-h-[90dvh] min-h-0 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">
          {isCreateMode ? "Create Exercise Group" : "Edit Exercise Group"}
        </h2>

        <p className="mt-1 text-sm text-secondary">
          Add, remove, and arrange exercises before saving.
        </p>
      </header>

      <div className="min-h-0 flex-1  pb-24">
        {!isCreateMode && !groupId && (
          <div className="px-4 py-6 sm:px-6">
            <p className="text-sm text-red-500">
              Exercise Group ID is missing.
            </p>
          </div>
        )}

        {isLoading && (
          <p className="px-4 py-6 text-sm text-secondary sm:px-6">
            Loading exercises...
          </p>
        )}

        {loadError && (
          <div className="px-4 py-6 sm:px-6">
            <p className="text-sm text-red-500">Failed to load exercises.</p>

            <button
              type="button"
              onClick={() => exercisesQuery.refetch()}
              className="mt-2 text-sm font-medium text-primary"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !loadError && (isCreateMode || Boolean(groupId)) && (
          <>
            <div className="px-4 py-4 sm:px-6">
              <SelectedExercisesSection
                exercises={selectedExercises}
                disabled={isSaving}
                onRemove={handleRemoveExercise}
                onReorder={handleReorderExercises}
                onAddClick={() => {
                  document.getElementById("exercise-library")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
            </div>

            <div
              id="exercise-library"
              className="scroll-mt-4 border-t border-border px-4 py-5 sm:px-6"
            >
              <ExerciseLibraryPicker
                selectedExercises={selectedExercises}
                onSelect={handleAddExercise}
              />
            </div>
          </>
        )}
      </div>

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-navigation border-t border-border",
          "bg-surface px-4 py-3 shadow-lg transition-all duration-300 sm:px-6",
          hasChanges
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        ].join(" ")}
        aria-hidden={!hasChanges}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {isCreateMode ? "New exercise group" : "Unsaved changes"}
            </p>

            <p className="text-xs text-secondary">
              {selectedExercises.length} exercises selected
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={isSaving || isCreateMode}
              onClick={handleDiscard}
              className="rounded-lg px-3 py-2 text-sm font-medium text-secondary disabled:opacity-50"
            >
              Discard
            </button>

            <button
              type="button"
              disabled={
                isSaving ||
                isLoading ||
                loadError ||
                (!isCreateMode && !groupId)
              }
              onClick={handleSaveChanges}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
