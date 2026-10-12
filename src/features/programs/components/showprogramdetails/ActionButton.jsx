export const ActionButton = ({
  children,
  onClick,
  disabled = false,
  variant = "secondary",
}) => {
  const variants = {
    primary: [
      "border border-primary-500/40 bg-primary-500/10",
      "text-primary-500",
      "hover/70 hover/20",
      "active active/30",
      "focus-visible/50",
    ].join(" "),

    secondary: [
      "border border-foreground/15 bg-foreground/[0.02]",
      "text-foreground",
      "hover:border-foreground/30 hover:bg-foreground/[0.05]",
      "active:bg-foreground/[0.08]",
      "focus-visible:ring-foreground/30",
    ].join(" "),
    warning: [
      "border border-amber-400/40 bg-amber-400/10",
      "text-amber-400",
      "hover:border-amber-400/70 hover:bg-amber-400/20",
      "active:border-amber-400 active:bg-amber-400/30",
      "focus-visible:ring-amber-400/50",
    ].join(" "),
    danger: [
      "border border-red-400/40 bg-red-400/10",
      "text-red-400",
      "hover:border-red-400/70 hover:bg-red-400/20",
      "active:border-red-400 active:bg-red-400/30",
      "focus-visible:ring-red-400/50",
    ].join(" "),
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2",
        "cursor-pointer rounded-lg border px-4 py-2.5",
        "text-sm font-medium",
        "transition-colors duration-200",
        "active:scale-[0.97]",
        "focus-visible focus-visible",
        "disabled disabled",
        variants[variant],
      ].join(" ")}
    >
      {children}
    </button>
  );
};
