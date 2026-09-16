import useMediaQuery from "../../../shared/hooks/useMediaQuery";

function useNavigationBreakpoint() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");

  return {
    isDesktop,
    isTablet,
    isMobile: !isDesktop && !isTablet,
  };
}

export default useNavigationBreakpoint;
