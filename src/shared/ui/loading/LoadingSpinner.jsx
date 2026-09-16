// src/shared/ui/loading/LoadingSpinner.jsx

const LoadingSpinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-14 h-14 border-4",
  };

  return (
    <div
      className={`
          ${sizes[size]}
          border-blue-500
          border-t-transparent
          rounded-full
          animate-spin
        `}
    />
  );
};

export default LoadingSpinner;
