import ExerciseModalSkeleton from "./ExerciseModalSkeleton";
import ExerciseContent from "./ExerciseContent.jsx";
import SlideUpModal from "../../../shared/ui/slideUpModal/SlideUpModal.jsx";

const ExerciseModal = ({ isOpen, exercise, onClose, isLoading }) => {
  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
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
