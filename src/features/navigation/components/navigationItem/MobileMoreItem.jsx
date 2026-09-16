import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function MobileMoreItem({ item, onClick }) {
  const Icon = item.icon;

  const hasChildren = item.children?.length > 0;

  if (item.action) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          flex
          w-full
          items-center
          justify-between

          rounded-xl
          px-4
          py-3

          text-color

          transition-colors

          hover:bg-slate-100
          hover:text-primary

          dark:hover:bg-slate-800
        "
      >
        <div className="flex items-center gap-3">
          <Icon className="size-5" />

          <span className="text-sm font-medium">{item.label}</span>
        </div>
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between

        rounded-xl
        px-4
        py-3

        text-color

        transition-colors

        hover:bg-slate-100
        hover:text-primary

        dark:hover:bg-slate-800
      "
    >
      <div className="flex items-center gap-3">
        <Icon className="size-5" />

        <span className="text-sm font-medium">{item.label}</span>
      </div>

      {hasChildren && <ChevronRight className="size-4" />}
    </NavLink>
  );
}

export default MobileMoreItem;
