import SlideUpModal from "@/shared/ui/slideupModal/SlideUpModal";
import ProgramDayForm from "./ProgramDayForm";

const ProgramDayFormModal = ({ isOpen, programId, onClose, notify }) => {
  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <ProgramDayForm
          programId={programId}
          onSuccess={onClose}
          notify={notify}
        />
      )}
    </SlideUpModal>
  );
};

export default ProgramDayFormModal;
