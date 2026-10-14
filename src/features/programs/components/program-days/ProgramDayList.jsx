import { useNavigate } from "react-router-dom";
import { CalendarPlus, RefreshCw, TriangleAlert } from "lucide-react";

import { useProgramDays } from "../../hooks/programDays/useProgramDays";
import ProgramDayListItem from "./ProgramDayListItem";

const ProgramDayList = ({ programId, onAddDay }) => {
  const navigate = useNavigate();

  const {
    data: programDays = [],
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useProgramDays(programId);

  if (isPending) {
    return (
      <div
        className="flex flex-col gap-3"
        aria-label="Loading program days"
        aria-busy="true"
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-xl border border-border p-4"
          >
            <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center"
      >
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert size={26} />
        </div>

        <h3 className="font-semibold text-foreground">
          Couldn't load program days
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Something went wrong while loading your program days. Please check
          your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Try again
        </button>
      </div>
    );
  }

  if (programDays.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center sm:py-16">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarPlus size={30} strokeWidth={1.7} />
        </div>

        <h3 className="text-lg font-semibold text-foreground">
          Your program starts here
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          This program doesn't have any days yet. Add your first program day and
          start building your workout routine.
        </p>

        {onAddDay && (
          <button
            type="button"
            onClick={onAddDay}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <CalendarPlus size={18} />
            Add your first day
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {programDays.map((day, index) => (
        <ProgramDayListItem
          key={day.id}
          day={day}
          index={index}
          onClick={() => navigate(`/programs/${programId}/days/${day.id}`)}
        />
      ))}
    </div>
  );
};

export default ProgramDayList;
