import SlideUpModal from "@/shared/ui/slideUpModal/SlideUpModal";
import ExerciseGroupForm from "./ExerciseGroupForm";

export default function ExerciseGroupFormModal({
  isOpen,
  exerciseGroup = null,
  onClose,
  notify,
}) {
  if (!exerciseGroup) return null;

  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <ExerciseGroupForm
          exerciseGroup={exerciseGroup}
          onClose={onClose}
          notify={notify}
        />
      )}
    </SlideUpModal>
  );
}
