import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ProgramDayFormModal from "../components/program-days/ProgramDayFormModal";
import { Dumbbell, Plus } from "lucide-react";

import { useNotification } from "@/shared/ui/notification/NotificationProvider";
import { useProgramDayStructure } from "../hooks/programDays/useProgramDayStructure";

import ProgramDayDetailsHeader from "../components/program-days/ProgramDayDetailsHeader";
import TrainingBlocksSection from "../components/program-days/TrainingBlocksSection";

import { normalizeExerciseGroup } from "../utils/programDayDetails.utils";

import BackButton from "@/shared/ui/backbutton/BackButton";

export default function ProgramDayDetailsPage() {
  const navigate = useNavigate();
  const { programId, dayId } = useParams();
  const [programDayToEdit, setProgramDayToEdit] = useState(null);

  const { notify } = useNotification();
  const handleEditDay = (programDay) => {
    setProgramDayToEdit(programDay);
  };

  const handleCloseEditDay = () => {
    setProgramDayToEdit(null);
  };
  const {
    data: rawGroups = [],
    isPending,
    isError,
    error,
    refetch,
  } = useProgramDayStructure(dayId);

  const groups = rawGroups.map(normalizeExerciseGroup);

  const handleEditExercise = (exercise) => {
    console.info("Edit exercise:", exercise);
  };

  const handleEditGroup = (group) => {
    console.info("Edit training block:", group);
  };

  const handleDeleteGroup = (group) => {
    console.info("Delete training block — mutation not implemented:", group);
  };

  const handleAddGroup = () => {
    console.info("Add training block for program day:", dayId);
  };

  return (
    <main
      data-program-id={programId}
      className="mx-auto w-full min-w-0 max-w-6xl space-y-3 px-2 py-2 sm:space-y-4 sm:px-4 sm:py-4 lg:px-6"
    >
      <BackButton onClick={() => navigate(-1)}>Back to programs</BackButton>

      <ProgramDayDetailsHeader onEdit={handleEditDay} />

      {isPending ? (
        <div className="rounded-lg border border-border px-3 py-8 text-center text-sm text-secondary">
          Loading program day...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border px-3 py-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Failed to load training blocks.
          </p>

          <p className="mt-1 break-words text-xs text-secondary">
            {error?.message ?? "An unexpected error occurred."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md bg-primary px-3 py-2 text-xs font-medium text-white"
          >
            Try again
          </button>
        </div>
      ) : (
        <TrainingBlocksSection
          groups={groups}
          isLoading={false}
          onAddGroup={handleAddGroup}
          onEditExercise={handleEditExercise}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
          emptyStateIcon={Dumbbell}
          addIcon={Plus}
        />
      )}
      <ProgramDayFormModal
        isOpen={Boolean(programDayToEdit)}
        programId={programId}
        programDay={programDayToEdit}
        onClose={handleCloseEditDay}
        notify={notify}
      />
    </main>
  );
}
