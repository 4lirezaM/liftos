// features/auth/components/LoginForm.jsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema } from "../schemas/authSchemas";
import Input from "../../../shared/ui/input/Input.jsx";
import Button from "../../../shared/ui/button/Button.jsx";
import { useAuth } from "../contexts/AuthContext";
import { getAuthErrorMessage } from "../utils/authError";
import { Mail } from "lucide-react";
import { CircleX } from "lucide-react";

const LoginForm = () => {
  const { login, signInWithGoogle, isLoggingIn, isAuthenticated, loginError } =
    useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const errorMessage = getAuthErrorMessage(loginError);
  const isEmailNotConfirmed = loginError?.code === "email_not_confirmed";

  const onSubmit = (data) => {
    login(data);
  };

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        {...register("password")}
        error={errors.password?.message}
      />

      {/* Forgot Password */}
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary transition hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Auth Error */}
      {errorMessage && (
        <div
          role="alert"
          className={`
      flex
      items-start
      gap-3
      rounded-xl
      border
      p-3
      text-sm

      ${
        isEmailNotConfirmed
          ? `
            border-amber-200
            bg-amber-50
            text-amber-700
            dark:border-amber-500/20
            dark:bg-amber-500/10
            dark:text-amber-300
          `
          : `
            border-red-200
            bg-red-50
            text-red-600
            dark:border-red-900/50
            dark:bg-red-950/30
            dark:text-red-400
          `
      }
    `}
        >
          {isEmailNotConfirmed ? (
            <Mail className="mt-0.5 size-5 shrink-0" />
          ) : (
            <CircleX className="mt-0.5 size-5 shrink-0" />
          )}

          <p>{errorMessage}</p>
        </div>
      )}

      {/* Email Login */}
      <Button type="submit" isLoading={isLoggingIn} className="w-full">
        Login
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />

        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          OR
        </span>

        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
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

export default LoginForm;
