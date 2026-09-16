import { X } from "lucide-react";
import { navigationConfig } from "../config/navigation.config";
import MoreMenuItem from "./MoreMenuItem";

function MoreMenu({ open, onClose }) {
  const { secondary, actions } = navigationConfig;

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-end
        bg-black/40
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          rounded-t-3xl
          bg-background
          p-6
          shadow-xl
          dark:border-t
          dark:border-slate-800
        "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">More</h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full p-2
              text-slate-500
              hover:bg-slate-100
              dark:text-slate-400
              dark:hover:bg-slate-800
            "
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-2">
          {secondary.map((item) => (
            <MoreMenuItem key={item.id} item={item} onClick={onClose} />
          ))}
        </div>

        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-2">
          {actions.map((item) => (
            <MoreMenuItem key={item.id} item={item} onClick={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoreMenu;
