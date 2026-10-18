import { useEffect, useState } from "react";

import SelectedExercisesSection from "./selected-exercises/SelectedExercisesSection";
import ExerciseLibraryPicker from "./selected-exercises/ExerciseLibraryPicker";

import { useRemoveProgramDayExercise } from "@/features/programs/hooks/programDayExercises/useRemoveProgramDayExercise";
import { useRemoveProgramDayExerciseSet } from "@/features/programs/hooks/programDayExerciseSets/useRemoveProgramDayExerciseSet";

export default function ExerciseGroupForm({ exerciseGroup, onClose, notify }) {
  const [selectedExercises, setSelectedExercises] = useState(
    exerciseGroup?.exercises ?? []
  );
  const [removingExerciseId, setRemovingExerciseId] = useState(null);

  const removeExerciseMutation = useRemoveProgramDayExercise();
  const removeSetsMutation = useRemoveProgramDayExerciseSet();

  useEffect(() => {
    setSelectedExercises(exerciseGroup?.exercises ?? []);
  }, [exerciseGroup]);

  const handleAddExercise = (exercise) => {
    setSelectedExercises((current) => {
      const alreadyExists = current.some(
        (item) => (item.exercise_id ?? item.id) === exercise.id
      );

      if (alreadyExists) return current;

      return [...current, exercise];
    });
  };

  const handleRemoveExercise = async (exerciseId) => {
    const exercise = selectedExercises.find((item) => item.id === exerciseId);

    if (!exercise || removingExerciseId) return;

    // A library item that has not been saved to the group
    // can be removed from the local selection only.
    if (!exercise.group_id) {
      setSelectedExercises((current) =>
        current.filter((item) => item.id !== exerciseId)
      );
      return;
    }

    setRemovingExerciseId(exerciseId);

    try {
      await removeSetsMutation.mutateAsync({
        programDayExerciseId: exercise.id,
        programDayId: exerciseGroup.program_day_id,
      });

      await removeExerciseMutation.mutateAsync({
        exerciseRecordId: exercise.id,
        groupId: exercise.group_id,
        programDayId: exerciseGroup.program_day_id,
      });

      setSelectedExercises((current) =>
        current.filter((item) => item.id !== exerciseId)
      );

      notify?.("Exercise removed successfully", "success");
    } catch (error) {
      console.error("Failed to remove exercise:", error);
      notify?.("Failed to remove exercise", "error");
    } finally {
      setRemovingExerciseId(null);
    }
  };

  return (
    <div className="flex max-h-[90dvh] flex-col ">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">
          Edit Exercise Group
        </h2>

        <p className="mt-1 text-sm text-secondary">
          Add or remove exercises from this group.
        </p>
      </header>

      <div className="px-4 py-4 sm:px-6">
        <SelectedExercisesSection
          disabled={Boolean(removingExerciseId)}
          exercises={selectedExercises}
          onRemove={handleRemoveExercise}
          onAddClick={() => {
            document.getElementById("exercise-library")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />

        {removingExerciseId && (
          <p className="mt-3 text-xs text-secondary">
            Removing exercise and its sets...
          </p>
        )}
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
    </div>
  );
}
