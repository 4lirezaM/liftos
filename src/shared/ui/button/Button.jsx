import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className = "",
      as: Component = "button",
      isLoading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(68,224,146,0.15)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60";

    const variantClasses = {
      primary:
        "border border-primary bg-primary text-background hover:brightness-95 active:brightness-90",

      secondary:
        "border border-primary bg-transparent text-primary hover:bg-primary hover:text-background active:brightness-95",

      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700",

      ghost:
        "bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20",

      danger:
        "border border-red-600 bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    };
    const sizeClasses = {
      sm: "min-h-9 px-3 text-sm",
      md: "min-h-10 px-5 text-sm",
      lg: "min-h-12 px-7 text-base",
    };

    const content = isLoading ? (
      <>
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        <span>Loading...</span>
      </>
    ) : (
      children
    );

    return (
      <Component
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
