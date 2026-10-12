import { useNavigate, useParams } from "react-router-dom";

import BackButton from "@/shared/ui/backbutton/BackButton";
import ShowProgramDetails from "../components/showprogramdetails/ShowProgramDetails";

const ProgramDetailsPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <BackButton onClick={() => navigate(-1)}>Back to programs</BackButton>

      <div className="mt-6">
        <ShowProgramDetails programId={programId} />
      </div>
    </main>
  );
};

export default ProgramDetailsPage;
