import { useExercises } from "../hooks/useExercises";
import ExerciseList from "../components/exerciselist/ExerciseList";

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

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const handleExerciseClick = (exercise) => {
    console.log("Selected exercise:", exercise);
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
    </section>
  );
}
