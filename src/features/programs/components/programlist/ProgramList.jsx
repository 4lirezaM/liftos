import ProgramListItem from "./ProgramListItem";
import InfiniteScrollSentinel from "../../../../shared/components/infinite-scroll/InfiniteScrollSentinel";
import LoadingMore from "../../../../shared/components/infinite-scroll/LoadingMore";

export default function ProgramList({
  programs,
  onProgramClick,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) {
  if (programs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No programs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div>
        {programs.map((program) => (
          <ProgramListItem
            key={program.id}
            program={program}
            onClick={onProgramClick}
          />
        ))}
      </div>

      {hasNextPage && (
        <>
          <InfiniteScrollSentinel
            onIntersect={onLoadMore}
            disabled={isFetchingNextPage}
          />

          {isFetchingNextPage && <LoadingMore />}
        </>
      )}
    </div>
  );
}
