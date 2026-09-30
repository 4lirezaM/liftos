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

  // Optional action
  actionLabel,
  onAction,

  showCloseButton = true,
}) {
  const config = notificationConfig[type] ?? notificationConfig.info;

  const hasAction = Boolean(actionLabel && onAction);

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

  const handleAction = () => {
    onAction?.();
    onClose();
  };

  return (
    <article
      role="alert"
      className="
        pointer-events-auto
        relative
        w-full
        overflow-hidden
        rounded-md
        bg-white
        text-slate-900
        shadow-xl
        shadow-slate-950/10

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

          {hasAction && (
            <button
              type="button"
              onClick={handleAction}
              className="
                mt-2
                text-sm
                font-semibold
                text-primary
                transition-opacity
                hover:opacity-80
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/50
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            >
              {actionLabel}
            </button>
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
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/50
            "
          >
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Progress */}
      {duration > 0 && (
        <div className="h-1 w-full bg-transparent">
          <div
            className={`h-full origin-left ${config.progressClass}`}
            style={{
              animation: `notification-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </article>
  );
}
