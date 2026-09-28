import { SkeletonBlock } from "@/shared/ui/skeleton";

const ExerciseModalSkeleton = () => {
  return (
    <div className="space-y-6 px-1 pb-6 pt-5">
      {/* Exercise Media */}
      <div className="flex justify-center">
        <SkeletonBlock className="h-60 w-60 rounded-xl" />
      </div>

      {/* Header */}
      <div>
        <SkeletonBlock className="h-7 w-2/3 rounded-md" />
        <SkeletonBlock className="mt-2 h-4 w-1/3 rounded-md" />
      </div>

      {/* Exercise Details */}
      <section>
        <SkeletonBlock className="mb-3 h-4 w-32 rounded-md" />

        <div className="overflow-hidden rounded-xl border border-border">
          <SkeletonDetailItem />
          <SkeletonDetailItem />
          <SkeletonDetailItem />
          <SkeletonDetailItem isLast />
        </div>
      </section>

      {/* Secondary Muscles */}
      <section>
        <SkeletonBlock className="h-4 w-36 rounded-md" />

        <div className="mt-3 flex flex-wrap gap-2">
          <SkeletonBlock className="h-7 w-20 rounded-md" />
          <SkeletonBlock className="h-7 w-24 rounded-md" />
          <SkeletonBlock className="h-7 w-16 rounded-md" />
        </div>
      </section>

      {/* Description */}
      <section>
        <SkeletonBlock className="h-4 w-24 rounded-md" />

        <div className="mt-3 space-y-2">
          <SkeletonBlock className="h-3 w-full rounded-md" />
          <SkeletonBlock className="h-3 w-[92%] rounded-md" />
          <SkeletonBlock className="h-3 w-[75%] rounded-md" />
        </div>
      </section>
    </div>
  );
};

const SkeletonDetailItem = ({ isLast = false }) => {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        px-4
        py-3
        ${!isLast ? "border-b border-border" : ""}
      `}
    >
      <SkeletonBlock className="h-4 w-28 rounded-md" />
      <SkeletonBlock className="h-4 w-24 rounded-md" />
    </div>
  );
};

export default ExerciseModalSkeleton;
