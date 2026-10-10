import { useState } from "react";

import { usePrograms } from "../hooks/programs/usePrograms";
import { useProgram } from "../hooks/programs/useProgram";
import { useActiveProgram } from "../hooks/programs/useActiveProgram";

import ProgramSearch from "../components/ProgramSearch";
import ProgramSortMenu from "../components/sorting/ProgramSortMenu";
import ProgramFilterModal from "../components/filters/ProgramFilterModal.jsx";
import { ListFilter } from "lucide-react";

import CurrentProgramCard from "../components/CurrentProgramCard.jsx";

import ProgramList from "../components/programlist/ProgramList";
import ProgramListSkeleton from "../components/programlist/ProgramListSkeleton.jsx";

// import ProgramModal from "../components/ProgramDetails/ProgramModal";
// import ProgramFormModal from "../components/ProgramForm/ProgramFormModal";

import FloatingActionButton from "../../../shared/ui/floating-action-button/FloatingActionButton";
import { Plus } from "lucide-react";

import {
  DEFAULT_PROGRAM_FILTERS,
  DEFAULT_PROGRAM_SORT,
} from "../constants/programFilters";

export default function ProgramsPage() {
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState(DEFAULT_PROGRAM_SORT);

  const [filters, setFilters] = useState(DEFAULT_PROGRAM_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_PROGRAM_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePrograms({
    search,
    ...filters,
    sort,
    archived: false,
  });

  const { data: activeProgram, isLoading: isLoadingActiveProgram } =
    useActiveProgram();

  const { data: selectedProgram, isLoading: isLoadingProgram } =
    useProgram(selectedProgramId);

  const programs = data?.pages.flatMap((page) => page.data) ?? [];

  const handleProgramClick = (program) => {
    setSelectedProgramId((currentId) =>
      currentId === program.id ? null : program.id
    );
  };

  const handleOpenCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenFilters = () => {
    setDraftFilters({
      programType: [...filters.programType],
      goal: [...filters.goal],
      difficulty: [...filters.difficulty],
    });

    setIsFilterModalOpen(true);
  };

  const handleFilterChange = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_PROGRAM_FILTERS);
  };

  const handleApplyFilters = () => {
    setFilters({
      programType: [...draftFilters.programType],
      goal: [...draftFilters.goal],
      difficulty: [...draftFilters.difficulty],
    });

    setIsFilterModalOpen(false);
  };
  if (isError) {
    console.error("Failed to load programs:", error);

    return (
      <div>
        <p>Couldn’t load programs.</p>
        <p>{error?.message || null}</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col space-y-4">
        <CurrentProgramCard
          program={activeProgram}
          isLoading={isLoadingActiveProgram}
        />

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <ProgramSearch value={search} onChange={setSearch} />
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
            <ProgramSortMenu value={sort} onChange={setSort} />
          </div>
        </div>

        {isLoading ? (
          <ProgramListSkeleton />
        ) : (
          <ProgramList
            programs={programs}
            onProgramClick={handleProgramClick}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        )}
        <ProgramFilterModal
          isOpen={isFilterModalOpen}
          filters={draftFilters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          onCancel={() => setIsFilterModalOpen(false)}
        />

        {/* <ProgramFormModal
          isOpen={isCreateModalOpen}
          mode="create"
          onClose={handleCloseCreate}
        />  */}
      </div>

      <FloatingActionButton icon={Plus} onClick={handleOpenCreate} />
    </section>
  );
}
