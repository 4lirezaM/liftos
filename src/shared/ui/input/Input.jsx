import { forwardRef, useId } from "react";

const Input = forwardRef(
  ({ label, autoComplete, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const inputClasses = `
      w-full rounded-xl border bg-white px-4 py-2.5
      text-sm text-gray-900
      placeholder:text-gray-400
      transition duration-200
      focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-gray-900 dark:text-gray-100
      dark:placeholder:text-gray-500
      dark:autofill:bg-gray-900

      ${
        error
          ? "border-red-500 focus:border-red-500 focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.12)] dark:border-red-500"
          : "border-gray-300 focus:border-primary focus-visible:shadow-[0_0_0_3px_rgba(68,224,146,0.12)] dark:border-gray-700 dark:focus:border-primary"
      }

      ${className}
    `;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          autoComplete={autoComplete}
          className={inputClasses}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
