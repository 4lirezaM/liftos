import { CalendarDays, ArrowRight } from "lucide-react";

const ProgramDayListItem = ({ day, index, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex w-full items-center gap-3 sm:gap-4
        rounded-2xl border border-border
        bg-background p-3.5 sm:p-4
        text-left
        transition-all duration-300 ease-out
        hover:border-primary/20
        hover:bg-primary/10
        hover:shadow-sm
        cursor-pointer
        active:scale-[0.99]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/50
        focus-visible:ring-offset-2
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      {/* Day position */}
      <span
        className="
          flex size-8 shrink-0 items-center justify-center
          rounded-lg bg-muted
          text-xs font-semibold tabular-nums
          text-muted-foreground
          transition-colors duration-300
          group-hover:text-primary
        "
      >
        {index + 1}
      </span>

      {/* Calendar icon */}
      <div
        className="
          flex size-11 shrink-0 items-center justify-center
          rounded-xl bg-muted/70
          text-muted-foreground
          transition-all duration-300 ease-out
          group-hover:scale-105
          group-hover:bg-primary/15
          group-hover:text-primary
          sm:size-12
          motion-reduce:transform-none
        "
      >
        <CalendarDays size={23} strokeWidth={1.8} />
      </div>

      {/* Day information */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">
          {day.name || `Day ${index + 1}`}
        </p>

        {day.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {day.description}
          </p>
        )}
      </div>

      {/* Animated navigation arrow */}
      <div
        className="
          flex size-9 shrink-0 items-center justify-center
          rounded-full text-muted-foreground
          transition-all duration-300 ease-out
          group-hover:translate-x-1
          group-hover:bg-primary/10
          group-hover:text-primary
          group-active:translate-x-1.5
          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        <ArrowRight size={19} strokeWidth={1.8} />
      </div>
    </button>
  );
};

export default ProgramDayListItem;
