import { NavLink } from "react-router-dom";

function DesktopNavigationItem({ item }) {
  const Icon = item.icon;

  if (item.action) {
    return (
      <button
        type="button"
        className="
          group flex w-full items-center gap-3
          cursor-pointer rounded-xl
          px-4 py-3
          text-color transition-all
          hover:bg-slate-100 hover:text-primary
           dark:hover:bg-slate-800
        "
      >
        <Icon className="size-5" />

        <span className="text-sm font-medium">{item.label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        [
          "group relative flex w-full items-center gap-3",
          "rounded-xl px-4 py-3 transition-all",

          isActive
            ? [
                "bg-primary/10",
                "text-primary",
                "shadow-[inset_2px_0_0_0_var(--color-primary)]",
              ].join(" ")
            : [
                "text-color",
                "hover:bg-primary/10",
                "hover:text-primary",
                "dark:hover:bg-slate-800",
              ].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={[
              "size-5 transition-colors",
              isActive ? "text-primary" : "text-current",
            ].join(" ")}
          />

          <span className="text-sm font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default DesktopNavigationItem;
