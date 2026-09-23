import ExerciseListItem from "./ExerciseListItem";
import InfiniteScrollSentinel from "../../../../shared/components/infinite-scroll/InfiniteScrollSentinel";
import LoadingMore from "../../../../shared/components/infinite-scroll/LoadingMore";

export default function ExerciseList({
  exercises,
  onExerciseClick,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) {
  if (exercises.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No exercises found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div>
        {exercises.map((exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
            onClick={onExerciseClick}
          />
        ))}
      </div>

      {hasNextPage && (
        <>
          <InfiniteScrollSentinel
            onIntersect={onLoadMore}
            disabled={isFetchingNextPage}
          />

          {isFetchingNextPage && <LoadingMore />}
        </>
      )}
    </div>
  );
}
