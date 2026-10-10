import { useState } from "react";

import { usePrograms } from "../hooks/programs/usePrograms";
import { useProgram } from "../hooks/programs/useProgram";
import { useActiveProgram } from "../hooks/programs/useActiveProgram";

// import ProgramSearch from "../components/ProgramSearch";

// import ProgramSortMenu from "../components/sorting/ProgramSortMenu";

import ProgramList from "../components/programlist/ProgramList";
// import ProgramListSkeleton from "../components/programlist/ProgramListSkeleton";

import CurrentProgramCard from "../components/CurrentProgramCard.jsx";

// import ProgramModal from "../components/ProgramDetails/ProgramModal";
// import ProgramFormModal from "../components/ProgramForm/ProgramFormModal";

import FloatingActionButton from "../../../shared/ui/floating-action-button/FloatingActionButton";
import { Plus } from "lucide-react";

import { DEFAULT_PROGRAM_SORT } from "../constants/programFilters";
import ProgramListSkeleton from "../components/programlist/ProgramListSkeleton.jsx";

export default function ProgramsPage() {
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState(DEFAULT_PROGRAM_SORT);

  const {
    error,
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = usePrograms({
    search,
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
        {/* 
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <ProgramSearch value={search} onChange={setSearch} />

          <ProgramSortMenu value={sort} onChange={setSort} />
        </div> */}

        {/* {isLoading && <ProgramListSkeleton />} */}
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

        {/* <ProgramModal
          isOpen={Boolean(selectedProgramId)}
          onClose={() => setSelectedProgramId(null)}
          program={selectedProgram}
          isLoading={isLoadingProgram}
        />

        <ProgramFormModal
          isOpen={isCreateModalOpen}
          mode="create"
          onClose={handleCloseCreate}
        /> */}
      </div>

      <FloatingActionButton icon={Plus} onClick={handleOpenCreate} />
    </section>
  );
}
