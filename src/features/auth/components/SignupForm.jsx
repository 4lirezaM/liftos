// src/features/auth/components/SignupForm.jsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { signupSchema } from "../schemas/authSchemas";
import Input from "../../../shared/ui/input/Input.jsx";
import Button from "../../../shared/ui/button/Button.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../../../shared/ui/notification";
import { getAuthErrorMessage } from "../utils/authError";

const SignupForm = () => {
  const {
    register,
    signInWithGoogle,
    isRegistering,
    isAuthenticated,
    registerError,
  } = useAuth();

  const { notify } = useNotification();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const errorMessage = getAuthErrorMessage(registerError);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;

    const result = await register(userData);

    if (result?.user && !result?.session) {
      notify({
        type: "success",
        title: "Account created",
        message: "Check your email and confirm your account, then log in.",
        duration: 7000,
      });

      navigate("/login", { replace: true });
    }
  };

  const handleGoogleSignup = () => {
    signInWithGoogle();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        {...formRegister("full_name")}
        error={errors.full_name?.message}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        {...formRegister("email")}
        error={errors.email?.message}
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        autoComplete="new-password"
        {...formRegister("password")}
        error={errors.password?.message}
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        {...formRegister("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      {/* Auth Error */}
      {errorMessage && (
        <div
          role="alert"
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-3
            text-sm
            text-red-600
            dark:border-red-900/50
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          {errorMessage}
        </div>
      )}

      {/* Email Signup */}
      <Button type="submit" isLoading={isRegistering} className="w-full">
        Create Account
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />

        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          OR
        </span>

        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Google Signup */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        className="w-full"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.45h3.14c1.84-1.7 2.93-4.2 2.93-7.41Z"
          />
          <path
            fill="#34A853"
            d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.7Z"
          />
          <path
            fill="#FBBC05"
            d="M6.53 13.78A5.86 5.86 0 0 1 6.23 12c0-.62.11-1.22.3-1.78V7.69H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.31l3.24-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.19c1.43 0 2.7.49 3.71 1.45l2.78-2.78C16.83 3.29 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.71 5.39l3.24 2.53C7.3 7.91 9.46 6.19 12 6.19Z"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
};

export default SignupForm;
