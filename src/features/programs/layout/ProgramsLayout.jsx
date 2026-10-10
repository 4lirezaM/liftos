import { Outlet } from "react-router-dom";

export default function ProgramsLayout() {
  return (
    <div className="min-h-full bg-background">
      <main className="pt-0">
        <div
          className="
            mx-auto w-full max-w-7xl
            px-4 py-5
            sm:px-6 sm:py-6
            lg:px-8 lg:py-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
