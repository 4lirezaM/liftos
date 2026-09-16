import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div
      className="
  h-dvh
  overflow-hidden
        bg-gray-50
        text-gray-900
        dark:bg-gray-950
        dark:text-gray-100
        transition-colors
      "
    >
      <Outlet />
    </div>
  );
};

export default RootLayout;
