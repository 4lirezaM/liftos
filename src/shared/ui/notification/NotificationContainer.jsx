import { createPortal } from "react-dom";
import { Notification } from "./Notification";

export function NotificationContainer({ notifications = [], onRemove }) {
  if (!notifications.length) return null;

  return createPortal(
    <div
      className="
        pointer-events-none
        fixed
        inset-x-0
        bottom-0
        z-50

        flex
        flex-col-reverse
        gap-3

        p-4
        pb-[calc(1rem+env(safe-area-inset-bottom))]

        sm:inset-x-auto
        sm:bottom-6
        sm:right-6
        sm:w-[380px]
        sm:p-0
      "
      aria-live="polite"
      aria-atomic="false"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          open
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          showCloseButton={notification.showCloseButton}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>,
    document.body
  );
}
