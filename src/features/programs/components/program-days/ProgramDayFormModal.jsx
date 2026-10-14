import SlideUpModal from "@/shared/ui/slideupModal/SlideUpModal";
import ProgramDayForm from "./ProgramDayForm";

const ProgramDayFormModal = ({
  isOpen,
  programId,
  programDay = null,
  onClose,
  notify,
}) => {
  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <ProgramDayForm
          programId={programId}
          programDay={programDay}
          onSuccess={onClose}
          notify={notify}
        />
      )}
    </SlideUpModal>
  );
};

export default ProgramDayFormModal;
