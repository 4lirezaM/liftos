import { CircleCheck, CircleX, TriangleAlert, Info } from "lucide-react";

const iconConfig = {
  success: {
    icon: CircleCheck,
    className: "text-emerald-500",
  },

  error: {
    icon: CircleX,
    className: "text-red-500",
  },

  warning: {
    icon: TriangleAlert,
    className: "text-amber-500",
  },

  info: {
    icon: Info,
    className: "text-blue-500",
  },
};

export function NotificationIcon({ type = "info" }) {
  const config = iconConfig[type] ?? iconConfig.info;
  const Icon = config.icon;

  return (
    <div
      className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          dark:bg-white/5
        "
    >
      <Icon
        className={`size-5 ${config.className}`}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
}
