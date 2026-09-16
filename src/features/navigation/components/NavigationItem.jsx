import { NavLink } from "react-router-dom";

function NavigationItem({ item, variant = "desktop" }) {
  const Icon = item.icon;

  if (item.action) {
    return (
      <button
        type="button"
        className={
          variant === "compact"
            ? `
              group flex size-16 flex-col items-center justify-center cursor-pointer
              gap-1 rounded-xl
              text-slate-500 transition-all
              hover:bg-slate-100 hover:text-primary
              dark:text-slate-400 dark:hover:bg-slate-800
            `
            : `
              group flex w-full items-center gap-3 rounded-xl cursor-pointer
              px-4 py-3
              text-slate-500 transition-all
              hover:bg-slate-100 hover:text-primary
              dark:text-slate-400 dark:hover:bg-slate-800
            `
        }
      >
        <Icon className="size-5" />

        <span className="text-xs font-medium">{item.label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => {
        if (variant === "compact") {
          return [
            "group relative flex size-16 flex-col items-center justify-center",
            "gap-1 rounded-xl transition-all duration-200",

            isActive
              ? [
                  "bg-primary-50",
                  "dark:bg-primary-100",
                  "text-primary",
                  "shadow-lg",
                  "shadow-[inset_4px_0_0_0_var(--color-primary)]",
                ].join(" ")
              : [
                  "text-slate-500",
                  "hover:bg-slate-100",
                  "hover:text-primary",
                  "dark:text-slate-400",
                  "dark:hover:bg-slate-800",
                ].join(" "),
          ].join(" ");
        }

        return [
          "group relative flex w-full items-center gap-3",
          "rounded-xl px-4 py-3 transition-all",

          isActive
            ? [
                "bg-primary/10",
                "dark:bg-primary/10",
                "text-primary",
                "shadow-[inset_2px_0_0_0_var(--color-primary)]",
              ].join(" ")
            : [
                "text-slate-500",
                "hover:bg-slate-100",
                "hover:text-primary",
                "dark:text-slate-400",
                "dark:hover:bg-slate-800",
              ].join(" "),
        ].join(" ");
      }}
    >
      {({ isActive }) => (
        <>
          <Icon
            className={[
              "size-5 transition-colors",
              isActive ? "text-primary" : "text-current",
            ].join(" ")}
          />

          <span
            className={
              variant === "compact"
                ? "text-xs font-medium"
                : "text-sm font-medium"
            }
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default NavigationItem;
