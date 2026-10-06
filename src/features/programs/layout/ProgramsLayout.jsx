import { Info } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const tabs = [
  { label: "Programs", to: "/programs" },
  { label: "Exercises", to: "/programs/exercises" },
];

const tabDescriptions = {
  "/programs":
    "Create and organize your training programs, customize workout days, and manage every detail.",
  "/programs/exercises":
    "Browse the exercise library or add your own exercises whenever you need.",
};

export default function ProgramsLayout() {
  const { pathname } = useLocation();

  const description = tabDescriptions[pathname] ?? tabDescriptions["/programs"];

  return (
    <div className="min-h-full bg-background">
      {/* Tabs */}
      <nav
        aria-label="Programs navigation"
        className="
          fixed inset-x-0 top-0 z-navigation
          border-b border-border
          bg-background
          md:static
          md:border-b
        "
      >
        <div className="mx-auto md:pl-4 w-full max-w-7xl">
          <div
            className="
              flex w-full
              md:justify-start
              md:gap-8
            "
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/programs"}
                className={({ isActive }) =>
                  [
                    // Mobile
                    "relative flex flex-1 items-center justify-center",
                    "py-3 text-sm font-medium",
                    "transition-colors",

                    // Tablet + Desktop
                    "md:flex-none",
                    "md:justify-start",
                    "md:py-4",
                    "md:text-base",
                    "lg:text-lg",

                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-primary",
                    "focus-visible:ring-inset",

                    isActive
                      ? "text-primary"
                      : "text-foreground/60 hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.label}

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="
                          absolute bottom-0
                          left-[8%] right-[8%]
                          h-0.5 rounded-full
                          bg-primary

                          md:left-0 md:right-0
                          md:h-0.5
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-12 md:pt-0">
        <div
          className="
            mx-auto w-full max-w-7xl
            px-4 py-5
            sm:px-6 sm:py-6
            lg:px-8 lg:py-8
          "
        >
          {/* Tab Description */}
          {/* Tab Description */}
          <div
            className="
                mb-2 flex items-start gap-2.5
                rounded-lg border border-border
                bg-foreground/2
                px-3 py-2.5
               sm:px-4 sm:py-3
                "
          >
            <Info
              aria-hidden="true"
              className="
                  mt-0.5 size-4 shrink-0
                  text-primary/70
                   "
            />

            <p
              className="
                max-w-2xl
                text-xs leading-relaxed
                text-foreground/50
                sm:text-sm
                   "
            >
              {description}
            </p>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}
