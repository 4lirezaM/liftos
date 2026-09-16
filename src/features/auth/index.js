// features/auth/index.js

export { default as LoginPage } from "./pages/LoginPage";
export { default as SignupPage } from "./pages/SignupPage";
export { default as ProfilePage } from "./pages/ProfilePage";

export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { default as LogoutButton } from "./components/LogoutButton";

export { AuthProvider, useAuth } from "./contexts/AuthContext";
