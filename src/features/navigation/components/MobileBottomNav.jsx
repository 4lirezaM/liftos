import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";

import { navigationConfig } from "../config/navigation.config";
import MobileNavigationItem from "./navigationItem/MobileNavigationItem";
import MobileMoreItem from "./navigationItem/MobileMoreItem";
import { LogoutButton } from "../../auth";
import ThemeToggle from "../../../theme/components/ThemeToggle";

function MobileBottomNav() {
  const { primary, secondary, actions } = navigationConfig;

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreItems = [...secondary, ...actions];

  return (
    <>
      {/* More Panel */}
      {isMoreOpen && (
        <div
          className={`
          fixed inset-x-0 top-0
          bottom-(--mobile-nav-height)
          z-overlay
          flex items-end
          bg-black/40
          transition-opacity duration-200
          ${isMoreOpen ? "opacity-100" : "opacity-0"}
        `}
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className={`
              relative z-modal
              w-full
              rounded-t-3xl
              bg-background
              p-5 pb-0
              mb-0
              border-t border-border
              transition-transform duration-800 ease-out
              ${isMoreOpen ? "translate-y-0" : "translate-y-full"}
            `}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <h2 className="text-md font-semibold">More</h2>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="
                  rounded-full
                  p-2
                  text-color
                  transition-colors
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <X className="size-5" />
              </button>
            </div>

            <div
              className="
                space-y-2
                max-h-[calc(100dvh-300px)]
                overflow-y-auto
                touch-pan-y
              "
            >
              {moreItems.map((item) => (
                <MobileMoreItem
                  key={item.id}
                  item={item}
                  onClick={() => setIsMoreOpen(false)}
                />
              ))}

              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-navigation

          flex
          h-(--mobile-nav-height)
          items-center
          justify-around

          border-t
          border-border
          bg-background
        "
      >
        {primary.map((item) => (
          <MobileNavigationItem key={item.id} item={item} />
        ))}

        {secondary.length > 0 && (
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
              hover:text-primary
            "
          >
            <MoreHorizontal
              className="
                size-4
                transition-colors
                group-hover:text-primary
              "
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
        )}
      </nav>
    </>
  );
}

export default MobileBottomNav;
