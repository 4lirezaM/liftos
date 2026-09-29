import { SkeletonBlock } from "../../../../shared/ui/skeleton";

const ExerciseListSkeleton = ({ count = 8 }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {Array.from({ length: count }).map((_, index) => (
        <ExerciseListSkeletonItem key={index} />
      ))}
    </div>
  );
};

const ExerciseListSkeletonItem = () => {
  return (
    <article
      className="
        flex w-full
        items-center gap-3
        border-b border-border
        px-4 py-3
        last:border-b-0

        sm:gap-4
        sm:px-5
        sm:py-4

        lg:px-6
        lg:py-5
      "
    >
      {/* Thumbnail */}
      <SkeletonBlock
        className="
          h-12 w-12
          shrink-0
          rounded-lg

          sm:h-16 sm:w-16

          lg:h-20 lg:w-20
          lg:rounded-xl
        "
      />

      {/* Exercise Information */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <SkeletonBlock className="h-4 w-2/3 rounded-md sm:h-5 sm:w-1/2 lg:h-6 lg:w-2/5" />

        {/* Primary Muscle + Equipment */}
        <SkeletonBlock className="mt-2 h-3 w-1/2 rounded-md sm:h-4 sm:w-1/3" />
      </div>

      {/* Mobile / Tablet Status */}
      <div
        className="
          flex
          max-w-22.5
          shrink-0
          flex-col
          items-end
          gap-1.5

          lg:hidden
        "
      >
        <SkeletonBlock className="h-5 w-16 rounded-md" />
        <SkeletonBlock className="h-5 w-20 rounded-md" />
      </div>

      {/* Desktop Information */}
      <div
        className="
          hidden
          min-w-0
          lg:flex
          lg:w-[34%]
          lg:items-center
          lg:gap-6
        "
      >
        {/* Secondary Muscles */}
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-3 w-16 rounded-md" />
          <SkeletonBlock className="mt-2 h-4 w-3/4 rounded-md" />
        </div>

        {/* Body Region */}
        <div className="w-24 shrink-0">
          <SkeletonBlock className="h-3 w-12 rounded-md" />
          <SkeletonBlock className="mt-2 h-4 w-20 rounded-md" />
        </div>

        {/* Status */}
        <div className="flex shrink-0 items-center gap-1.5">
          <SkeletonBlock className="h-5 w-16 rounded-md" />
          <SkeletonBlock className="h-5 w-20 rounded-md" />
        </div>
      </div>
    </article>
  );
};

export default ExerciseListSkeleton;
