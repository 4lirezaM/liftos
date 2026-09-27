import { useState } from "react";

import { useExercises } from "../hooks/useExercises";
import { useExercise } from "../hooks/useExercise";

import ExerciseList from "../components/exerciselist/ExerciseList";
import ExerciseModal from "../components/ExerciseModal";

export default function ExercisesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExercises();

  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const { data: selectedExercise, isLoading: isLoadingExercise } =
    useExercise(selectedExerciseId);

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const handleExerciseClick = (exercise) => {
    setSelectedExerciseId((currentId) =>
      currentId === exercise.id ? null : exercise.id
    );
  };

  if (isLoading) {
    return <div>Loading exercises...</div>;
  }

  if (isError) {
    console.error("Failed to load exercises:", error);

    return (
      <div>
        <p>Couldn’t load exercises.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Exercises</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {exercises.length} exercises
        </p>
      </div>

      <ExerciseList
        exercises={exercises}
        onExerciseClick={handleExerciseClick}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      <ExerciseModal
        isOpen={Boolean(selectedExerciseId)}
        onClose={() => setSelectedExerciseId(null)}
        exercise={selectedExercise}
        isLoading={isLoadingExercise}
      />
    </section>
  );
}
