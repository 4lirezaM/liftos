import { Outlet } from "react-router-dom";
import { AppNavigation } from "../../features/navigation";

function AppLayout() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AppNavigation />

      <main
        className="   min-w-0
                      flex-1
                      overflow-y-auto
                      mb-(--mobile-nav-height)
                      md:mb-0"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
