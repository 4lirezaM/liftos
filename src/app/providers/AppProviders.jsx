import ReactQueryProvider from "./ReactQueryProvider";
import { ThemeProvider } from "../../theme/ThemeContext";
import { AuthProvider } from "../../features/auth";
import { RouterProvider } from "react-router-dom";
import { router } from "../router/router";
import { NotificationProvider } from "../../shared/ui/notification/NotificationProvider";

export const AppProviders = () => {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};
