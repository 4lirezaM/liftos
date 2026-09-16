import { useEffect } from "react";
import { X } from "lucide-react";

import { NotificationIcon } from "./NotificationIcon";
import { notificationConfig } from "./notification.config";

export function Notification({
  open,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
}) {
  const config = notificationConfig[type] ?? notificationConfig.info;

  useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <article
      role="alert"
      className="
        pointer-events-auto
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-slate-900
        shadow-xl
        shadow-slate-950/10

        dark:border-white/10
        dark:bg-[#111A26]
        dark:text-white
        dark:shadow-black/30
      "
    >
      <div className="flex gap-3 p-4">
        {/* Icon */}
        <NotificationIcon type={type} />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {title && (
            <h3 className="text-sm font-semibold leading-5">{title}</h3>
          )}

          {message && (
            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-600
                dark:text-slate-400
              "
            >
              {message}
            </p>
          )}
        </div>

        {/* Close */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="
              flex
              size-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
              dark:hover:bg-white/5
              dark:hover:text-white
            "
          >
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Progress */}
      {duration > 0 && (
        <div className="h-0.5 w-full bg-slate-100 dark:bg-white/5">
          <div
            className={`h-full ${config.progressClass}`}
            style={{
              animation: `notification-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </article>
  );
}
