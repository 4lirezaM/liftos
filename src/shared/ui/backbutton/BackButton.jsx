import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick, children = "Back" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-primary-500"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 transition-all duration-300 group-hover:-translate-x-1 group-hover:border-primary-500/40">
        <ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />
      </span>

      {children}
    </button>
  );
};

export default BackButton;
