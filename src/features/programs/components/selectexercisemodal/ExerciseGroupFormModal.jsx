import SlideUpModal from "@/shared/ui/slideUpModal/SlideUpModal";
import ExerciseGroupForm from "./ExerciseGroupForm";

export default function ExerciseGroupFormModal({
  isOpen,
  mode = "edit",
  exerciseGroup = null,
  programDayId,
  groupType,
  onClose,
  onSaved,
  notify,
}) {
  if (!isOpen) return null;

  if (mode === "edit" && !exerciseGroup) return null;

  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
      <ExerciseGroupForm
        mode={mode}
        exerciseGroup={exerciseGroup}
        programDayId={programDayId}
        groupType={groupType}
        onClose={onClose}
        onSaved={onSaved}
        notify={notify}
      />
    </SlideUpModal>
  );
}
