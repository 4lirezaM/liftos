import { useState } from "react";

import { useExercises } from "../hooks/useExercises";
import { useExercise } from "../hooks/useExercise";

import ExerciseSortMenu from "../components/sorting/ExerciseSortMenu";

import ExerciseList from "../components/exerciselist/ExerciseList";
import ExerciseModal from "../components/ExerciseModal";
import ExerciseListSkeleton from "../components/exerciselist/ExerciseListSkeleton";
import {
  DEFAULT_EXERCISE_FILTERS,
  DEFAULT_EXERCISE_SORT,
} from "../constants/exerciseFilters";
import ExerciseFilterModal from "../components/filters/ExerciseFilterModal";
import ExerciseSearch from "../components/ExerciseSearch";
import { ListFilter } from "lucide-react";

export default function ExercisesPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState(DEFAULT_EXERCISE_FILTERS);

  const [sort, setSort] = useState(DEFAULT_EXERCISE_SORT);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState(DEFAULT_EXERCISE_FILTERS);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExercises({
    search,
    ...filters,
    sort,
  });

  const { data: selectedExercise, isLoading: isLoadingExercise } =
    useExercise(selectedExerciseId);

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const handleExerciseClick = (exercise) => {
    setSelectedExerciseId((currentId) =>
      currentId === exercise.id ? null : exercise.id
    );
  };

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setIsFilterModalOpen(false);
  };

  const handleCancelFilters = () => {
    setIsFilterModalOpen(false);
  };
  const handleDraftFilterChange = (key, value) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };
  const handleResetAll = () => {
    setSearch("");
    setFilters(DEFAULT_EXERCISE_FILTERS);
    setSort(DEFAULT_EXERCISE_SORT);

    setDraftFilters(DEFAULT_EXERCISE_FILTERS);
  };
  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_EXERCISE_FILTERS);
  };

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
      <div className="flex flex-col space-y-4">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <ExerciseSearch value={search} onChange={setSearch} />
          <div className="flex gap-2 sm:contents">
            <button
              type="button"
              onClick={handleOpenFilters}
              className={[
                "flex min-h-11 items-center justify-center gap-2",
                "rounded-lg border border-border px-4",
                "text-sm font-medium text-foreground",
                "transition-colors hover:bg-primary hover:text-black cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary/50",
                "flex-1 sm:flex-none",
              ].join(" ")}
            >
              <ListFilter className="size-4" aria-hidden="true" />
              <span>Filters</span>
            </button>
            <ExerciseSortMenu value={sort} onChange={setSort} />
          </div>
        </div>
        {isLoading && <ExerciseListSkeleton />}
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
        <ExerciseFilterModal
          isOpen={isFilterModalOpen}
          filters={draftFilters}
          onChange={handleDraftFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          onCancel={handleCancelFilters}
        />
      </div>
    </section>
  );
}
