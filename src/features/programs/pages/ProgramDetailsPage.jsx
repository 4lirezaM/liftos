import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";

import BackButton from "@/shared/ui/backbutton/BackButton";
import FloatingActionButton from "@/shared/ui/floating-action-button/FloatingActionButton";
import { useNotification } from "@/shared/ui/notification/NotificationProvider";

import ShowProgramDetails from "../components/showprogramdetails/ShowProgramDetails";
import ProgramDayList from "../components/program-days/ProgramDayList";
import ProgramDayFormModal from "../components/program-days/ProgramDayFormModal";

const ProgramDetailsPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [isCreateDayModalOpen, setIsCreateDayModalOpen] = useState(false);

  const handleOpenCreateDay = () => {
    setIsCreateDayModalOpen(true);
  };

  const handleCloseCreateDay = () => {
    setIsCreateDayModalOpen(false);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-2 py-2 sm:px-6 sm:py-8">
      <BackButton onClick={() => navigate(-1)}>Back to programs</BackButton>

      <div className="mt-6 space-y-2">
        <ShowProgramDetails programId={programId} />
        <ProgramDayList programId={programId} />
      </div>

      <FloatingActionButton icon={Plus} onClick={handleOpenCreateDay} />

      <ProgramDayFormModal
        isOpen={isCreateDayModalOpen}
        programId={programId}
        onClose={handleCloseCreateDay}
        notify={notify}
      />
    </main>
  );
};

export default ProgramDetailsPage;
