import { Info } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Programs", to: "/programs" },
  { label: "Exercises", to: "/programs/exercises" },
];

const descriptions = {
  "/programs":
    "Create and organize your training programs, customize workout days, and manage every detail.",
  "/programs/exercises":
    "Browse the exercise library or add your own exercises whenever you need.",
};

export default function ProgramsTabs({ activeTab }) {
  const description = descriptions[activeTab];

  return (
    <div>
      {/* Tabs */}
      <nav
        aria-label="Programs navigation"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto w-full max-w-7xl md:pl-4">
          <div className="flex w-full md:justify-start md:gap-8">
            {tabs.map((tab) => {
              const isActive = tab.to === activeTab;

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end
                  className={[
                    "relative flex flex-1 items-center justify-center",
                    "py-3 text-sm font-medium transition-colors duration-200",
                    "md:flex-none md:justify-start md:py-4 md:text-base",
                    "lg:text-lg",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary",
                    "focus-visible:ring-inset",
                    isActive
                      ? "text-primary"
                      : "text-foreground/60 hover:text-foreground",
                  ].join(" ")}
                >
                  {tab.label}

                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                     absolute bottom-0
                     left-[5%] w-[90%]
                     h-[3px]
                     rounded-full bg-primary
                 
                     md:left-0 md:w-full
                   "
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Description */}
      {description && (
        <div
          className="
            my-2 flex items-start gap-2.5
            rounded-lg border border-border
            bg-foreground/[0.02]
             py-2.5
            sm:px-4 sm:py-3
          "
        >
          <Info
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary/70"
          />

          <p className="max-w-2xl text-xs leading-relaxed text-foreground/50 sm:text-sm">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
