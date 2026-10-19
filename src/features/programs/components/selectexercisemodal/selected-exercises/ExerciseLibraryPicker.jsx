import { useState } from "react";
import { Check, ListFilter, Eye } from "lucide-react";

import { useExercise } from "@/features/exercises/hooks/useExercise";
import ExerciseModal from "@/features/exercises/components/ExerciseDetails/ExerciseModal";
import { useExercises } from "@/features/exercises/hooks/useExercises";
import ExerciseSearch from "@/features/exercises/components/ExerciseSearch";
import ExerciseSortMenu from "@/features/exercises/components/sorting/ExerciseSortMenu";
import ExerciseFilterModal from "@/features/exercises/components/filters/ExerciseFilterModal";
import ExerciseListSkeleton from "@/features/exercises/components/exerciselist/ExerciseListSkeleton";

import {
  DEFAULT_EXERCISE_FILTERS,
  DEFAULT_EXERCISE_SORT,
} from "@/features/exercises/constants/exerciseFilters";

export default function ExerciseLibraryPicker({
  selectedExercises = [],
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_EXERCISE_FILTERS);
  const [sort, setSort] = useState(DEFAULT_EXERCISE_SORT);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_EXERCISE_FILTERS);

  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

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

  const { data: detailedExercise, isLoading: isLoadingExercise } =
    useExercise(selectedExerciseId);

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const selectedIds = new Set(
    selectedExercises.map(
      (item) => item.exercise_id ?? item.exercise?.id ?? item.id
    )
  );

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setIsFilterModalOpen(true);
  };

  const handleDraftFilterChange = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_EXERCISE_FILTERS);
  };

  const handleCloseExerciseModal = () => {
    setSelectedExerciseId(null);
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Exercise Library
        </h3>

        <p className="mt-1 text-xs text-secondary">
          Search and select exercises to add to this group.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <ExerciseSearch value={search} onChange={setSearch} />

        <div className="flex gap-2 sm:contents">
          <button
            type="button"
            onClick={handleOpenFilters}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary sm:flex-none"
          >
            <ListFilter size={16} />
            Filters
          </button>

          <ExerciseSortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      {isError && (
        <p className="rounded-lg border border-red-500/30 p-3 text-sm text-red-500">
          Couldn’t load exercises: {error?.message}
        </p>
      )}

      {isLoading && <ExerciseListSkeleton />}

      {!isLoading && !isError && (
        <>
          {exercises.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-secondary">
              No exercises found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {exercises.map((exercise) => {
                const isSelected = selectedIds.has(exercise.id);

                return (
                  <div
                    key={exercise.id}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/50"
                  >
                    {exercise.thumbnail_url ? (
                      <img
                        src={exercise.thumbnail_url}
                        alt=""
                        loading="lazy"
                        className="size-16 shrink-0 rounded-lg bg-surface-secondary object-contain"
                      />
                    ) : (
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-[10px] text-secondary">
                        No GIF
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSelected) {
                            onSelect(exercise);
                          }
                        }}
                        disabled={isSelected}
                        className="block w-full text-left disabled:cursor-default"
                      >
                        <span className="block break-words text-sm font-medium text-foreground">
                          {exercise.name}
                        </span>

                        <span className="mt-1 block text-xs text-secondary">
                          {isSelected ? "Already selected" : "Tap to add"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedExerciseId(exercise.id)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <Eye size={13} />
                        Show details
                      </button>
                    </div>

                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-secondary">
                      {isSelected ? (
                        <Check size={16} className="text-primary" />
                      ) : (
                        "+"
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {hasNextPage && (
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={fetchNextPage}
              className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}

      <ExerciseFilterModal
        isOpen={isFilterModalOpen}
        filters={draftFilters}
        onChange={handleDraftFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
        onCancel={() => setIsFilterModalOpen(false)}
      />

      <ExerciseModal
        isOpen={Boolean(selectedExerciseId)}
        exercise={detailedExercise}
        onClose={handleCloseExerciseModal}
        isLoading={isLoadingExercise}
        mode="nested"
      />
    </section>
  );
}
