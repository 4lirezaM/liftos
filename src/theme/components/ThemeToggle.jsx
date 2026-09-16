import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";

function ThemeToggle({ variant = "desktop", className = "" }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  const iconClass = `
    size-4
    transition-colors
    group-hover:text-primary
  `;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={[
          "group",
          "flex size-11 shrink-0",
          "flex-col items-center justify-center",
          "gap-0.5",
          "rounded-lg",

          "text-color",
          "transition-colors duration-200",

          "hover:bg-slate-100",
          "hover:text-primary",

          "dark:hover:bg-slate-800",
          "dark:hover:text-primary",

          "cursor-pointer",

          className,
        ].join(" ")}
      >
        <Icon className={iconClass} />

        <span
          className="
            max-w-9
            truncate
            text-[9px]
            font-medium
          "
        >
          {isDark ? "Light" : "Dark"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={[
        "group flex w-full items-center gap-3",
        "rounded-xl px-4 py-3",

        "text-sm font-medium",
        "text-color",

        "transition-colors duration-200",

        "hover:text-primary",

        "cursor-pointer",

        "dark:hover:text-primary",

        className,
      ].join(" ")}
    >
      <Icon className={iconClass} />

      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

export default ThemeToggle;
