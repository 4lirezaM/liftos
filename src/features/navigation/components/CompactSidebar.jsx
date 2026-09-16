import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { navigationConfig } from "../config/navigation.config";
import Logo from "../../../shared/ui/logo/Logo";

import { LogoutButton } from "../../auth";
import ThemeToggle from "../../../theme/components/ThemeToggle";
import CompactNavigationItem from "./navigationItem/CompactNavigationItem";

function CompactSidebar() {
  const { primary, secondary, actions } = navigationConfig;

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <aside
      className="
        flex h-dvh w-23 shrink-0 flex-col space-y-2
        items-center
        border-r border-border
        bg-background
         pt-2 
        transition-colors duration-300
      "
    >
      {/* Logo */}
      <div className="shrink-0">
        <Logo size="sm" />
      </div>

      {/* Divider */}
      <div className=" h-px w-full shrink-0 bg-border" />

      {/* Navigation */}
      <nav
        aria-label="Primary navigation"
        className="
          min-h-0
          flex-1
          w-full
          overflow-y-auto
          scrollbar-minimal
          scrollbar-gutter-stable
          [direction:rtl]
        "
      >
        <div className="flex flex-col items-center gap-2">
          {/* Primary */}
          {primary.map((item) => (
            <CompactNavigationItem key={item.id} item={item} />
          ))}

          {/* More */}
          {secondary?.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMoreOpen((previous) => !previous)}
                aria-expanded={isMoreOpen}
                className="
    group
    relative
    flex
    size-11
    shrink-0
    flex-col
    items-center
    justify-center
    gap-0.5
    rounded-lg
    cursor-pointer
    text-color
    transition-colors duration-200

    hover:bg-slate-100
    hover:text-primary

    dark:hover:bg-slate-800
  "
              >
                <ChevronDown
                  className={[
                    "absolute bottom-0.5 size-4 transition-transform duration-200",
                    isMoreOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
                <span
                  className="
      max-w-9
      truncate
      text-[9px]
      font-medium
    "
                >
                  More
                </span>
              </button>

              {isMoreOpen && (
                <div className="flex flex-col items-center gap-2">
                  {secondary.map((item) => (
                    <CompactNavigationItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Controls */}
      <div
        className="
          z-10
          mt-4
          flex
          shrink-0
          flex-col
          items-center
          gap-2

          border-t
          border-border

          bg-background
          pt-3
        "
      >
        {/* Theme */}
        <ThemeToggle variant="compact" />

        {/* Logout */}
        <LogoutButton variant="compact" />

        {/* Future actions */}
        {actions.length > 0 && (
          <div className="mt-2 flex flex-col items-center gap-2">
            {actions.map((item) => (
              <CompactNavigationItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default CompactSidebar;
