import SlideUpModal from "../../../../shared/ui/slideUpModal/SlideUpModal.jsx";
import ProgramForm from "./ProgramForm.jsx";

const ProgramFormModal = ({
  isOpen,
  mode = "create",
  program = null,
  onClose,
  notify,
}) => {
  return (
    <SlideUpModal isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <ProgramForm
          mode={mode}
          program={program}
          onSuccess={onClose}
          notify={notify}
        />
      )}
    </SlideUpModal>
  );
};

export default ProgramFormModal;
