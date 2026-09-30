import SlideUpModal from "../../../../shared/ui/slideUpModal/SlideUpModal.jsx";
import ExerciseForm from "./ExerciseForm.jsx";

const ExerciseFormModal = ({ isOpen, mode, exercise = null, onClose }) => {
  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <ExerciseForm mode={mode} exercise={exercise} onSuccess={onClose} />
      )}
    </SlideUpModal>
  );
};

export default ExerciseFormModal;
