// src/features/auth/pages/SignupPage.jsx

import { Link } from "react-router-dom";

import SignupForm from "../components/SignupForm.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

const SignupPage = () => {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start your fitness journey with LiftOS"
    >
      <SignupForm />

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary transition hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
