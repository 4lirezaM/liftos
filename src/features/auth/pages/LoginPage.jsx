// src/features/auth/pages/LoginPage.jsx

import { Link } from "react-router-dom";

import LoginForm from "../components/LoginForm.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome Back" subtitle="Login to your account">
      <LoginForm />

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-primary transition hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
