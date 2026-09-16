import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function LogoutButton({ variant = "desktop", className = "" }) {
  const { logout, isLoggingOut } = useAuth();

  const label = isLoggingOut ? "Logging out..." : "Logout";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => logout()}
        disabled={isLoggingOut}
        aria-label="Logout"
        className={[
          "group",
          "flex size-11 shrink-0",
          "flex-col items-center justify-center",
          "gap-0.5",
          "rounded-lg",

          "cursor-pointer",
          "text-color",
          "transition-colors duration-200",

          "hover:text-red-500",

          "disabled:cursor-not-allowed",
          "disabled:opacity-50",

          "dark:hover:text-red-400",

          className,
        ].join(" ")}
      >
        <LogOut
          className="
            size-4
            transition-colors
            group-hover:text-red-500
            dark:group-hover:text-red-400
          "
        />

        <span
          className="
            max-w-9
            truncate
            text-[9px]
            font-medium
          "
        >
          Logout
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={isLoggingOut}
      className={[
        "group flex w-full items-center gap-3",
        "rounded-xl px-4 py-3",

        "text-sm font-medium",
        "cursor-pointer",

        "text-color",
        "transition-colors duration-200",

        "hover:text-red-500",

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        "dark:hover:text-red-400",

        className,
      ].join(" ")}
    >
      <LogOut
        className="
          size-5
          transition-colors
          group-hover:text-red-500
          dark:group-hover:text-red-400
        "
      />

      <span>{label}</span>
    </button>
  );
}

export default LogoutButton;
