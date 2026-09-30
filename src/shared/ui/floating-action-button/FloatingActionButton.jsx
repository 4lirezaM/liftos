import { Plus } from "lucide-react";

const FloatingActionButton = ({
  icon: Icon = Plus,
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        // Position
        "fixed",
        "right-4",
        "bottom-[calc(var(--mobile-nav-height)+1rem)]",
        "z-fab",

        // Size
        "size-14",

        // Layout
        "flex",
        "items-center",
        "justify-center",

        // Shape
        "rounded-full",

        // Color
        "bg-primary",
        "text-background",

        // Interaction
        "cursor-pointer",
        "transition-[transform,background-color]",
        "duration-200",
        "ease-out",

        "hover:bg-primary/90",
        "active:scale-90",

        // Focus
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",

        // Disabled
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        "disabled:active:scale-100",

        // Entrance animation
        "animate-fab-enter",

        // Desktop
        "md:right-6",
        "md:bottom-6",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon className="size-6 shrink-0" strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
};

export default FloatingActionButton;
