import { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { navigationConfig } from "../config/navigation.config";
import DesktopNavigationItem from "./navigationItem/DesktopNavigationItem";
import Logo from "../../../shared/ui/logo/Logo";

import { LogoutButton } from "../../auth";
import ThemeToggle from "../../../theme/components/ThemeToggle";

function DesktopSidebar() {
  const { primary, secondary, actions } = navigationConfig;

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <aside
      className="
        flex h-dvh w-64 shrink-0 flex-col
        border-r border-border
        bg-background
        pt-6 pr-2
        transition-colors duration-300
      "
    >
      {/* Logo */}
      <div className="flex shrink-0 items-center justify-center px-3">
        <Logo />
      </div>

      {/* Divider */}
      <div className="mt-6 mb-3 h-px shrink-0 bg-border" />

      {/* Navigation */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          scrollbar-minimal
          scrollbar-gutter-stable
          [direction:rtl]
        "
        aria-label="Primary navigation"
      >
        <div className="[direction:ltr]">
          <div className="space-y-1">
            {/* Primary */}
            {primary.map((item) => (
              <DesktopNavigationItem key={item.id} item={item} />
            ))}

            {/* More */}
            {secondary.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen((previous) => !previous)}
                  aria-expanded={isMoreOpen}
                  className="
                    group flex w-full items-center justify-between
                    rounded-xl
                    px-4 py-3
                    text-sm font-medium
                    cursor-pointer
                    text-color

                    transition-colors duration-200

                   text-color
                   hover:bg-slate-100
                   hover:text-primary
                   dark:hover:bg-slate-800
                  "
                >
                  <span className="flex items-center gap-3">
                    <MoreHorizontal
                      className="
                        size-5
                        transition-colors
                      "
                    />

                    <span>More</span>
                  </span>

                  <ChevronDown
                    className={[
                      "size-4 transition-transform duration-200",
                      isMoreOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {isMoreOpen && (
                  <div
                    className="
                      mt-1
                      space-y-1
                      pl-2
                    "
                  >
                    {secondary.map((item) => (
                      <DesktopNavigationItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Controls */}
      <div
        className="
          shrink-0

          border-t
          border-border

          px-2
          pt-3
          pb-3

          space-y-1
        "
      >
        {/* Theme */}
        <ThemeToggle />

        {/* Logout */}
        <LogoutButton />

        {/* Future Actions */}
        {actions.length > 0 && (
          <div
            className="
              mt-2
              space-y-1
            "
          >
            {actions.map((item) => (
              <DesktopNavigationItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default DesktopSidebar;
