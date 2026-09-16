import { createContext, useCallback, useContext, useState } from "react";

import { NotificationContainer } from "./NotificationContainer";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }, []);

  const notify = useCallback((notification) => {
    const id = crypto.randomUUID();

    setNotifications((current) => [
      ...current,
      {
        id,
        type: "info",
        duration: 5000,
        showCloseButton: true,
        ...notification,
      },
    ]);

    return id;
  }, []);

  return (
    <NotificationContext value={{ notify, removeNotification }}>
      {children}

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
}
