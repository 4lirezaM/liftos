// src/shared/ui/loading/LoadingScreen.jsx

import LoadingSpinner from "./LoadingSpinner";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div
      className="
      flex
      items-center
      justify-center
      min-h-screen
    "
    >
      <div className="text-center">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>

        <p
          className="
          mt-4
          text-gray-600
          dark:text-gray-400
        "
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
