import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import BackButton from "@/shared/ui/backbutton/BackButton";
import ShowProgramDetails from "@/features/programs/components/ShowProgramDetails";

const ProgramDetailsPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.key]);

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
