import ExerciseModalSkeleton from "./ExerciseModalSkeleton";
import ExerciseContent from "./ExerciseContent.jsx";
import SlideUpModal from "../../../../shared/ui/slideUpModal/SlideUpModal.jsx";

const ExerciseModal = ({
  isOpen,
  exercise,
  onClose,
  isLoading,
  mode = "default",
}) => {
  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose} mode={mode}>
      {isOpen &&
        (isLoading || !exercise ? (
          <ExerciseModalSkeleton />
        ) : (
          <ExerciseContent exercise={exercise} />
        ))}
    </SlideUpModal>
  );
};

export default ExerciseModal;
