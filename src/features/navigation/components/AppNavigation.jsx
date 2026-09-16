import DesktopSidebar from "./DesktopSidebar";
import CompactSidebar from "./CompactSidebar";
import MobileBottomNav from "./MobileBottomNav";
import useNavigationBreakpoint from "../hooks/useNavigationBreakpoint";

function AppNavigation() {
  const { isDesktop, isTablet, isMobile } = useNavigationBreakpoint();

  if (isDesktop) {
    return <DesktopSidebar />;
  }

  if (isTablet) {
    return <CompactSidebar />;
  }

  if (isMobile) {
    return <MobileBottomNav />;
  }

  return null;
}

export default AppNavigation;
