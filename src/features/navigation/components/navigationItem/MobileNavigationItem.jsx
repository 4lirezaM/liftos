import { NavLink } from "react-router-dom";

function MobileNavigationItem({ item }) {
  const Icon = item.icon;

  if (item.action) {
    return (
      <button
        type="button"
        className="
          group
          flex
          size-11
          shrink-0
          flex-col
          items-center
          justify-center
          gap-0.5
          overflow-hidden
          rounded-lg

          text-color
          transition-colors duration-200
=
          hover:text-primary
=
        "
      >
        <Icon className="size-4" />

        <span
          className="
            max-w-9
            truncate
            text-[8px]
            font-medium
          "
        >
          {item.label}
        </span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        [
          "group relative isolate",
          "flex size-16 shrink-0",
          "flex-col items-center justify-center",
          "gap-0.5",
          "overflow-hidden",
          "rounded-lg",
          "transition-colors duration-200",

          isActive
            ? ["text-primary"].join(" ")
            : ["text-color", "hover:text-primary"].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={[
              "size-4 transition-colors",
              isActive ? "text-primary" : "text-current",
            ].join(" ")}
          />

          <span
            className="
              max-w-15
              truncate
              text-[9px]
              font-medium
            "
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}
export default MobileNavigationItem;
