const SkeletonBlock = ({ className = "" }) => {
  return (
    <div
      className={`
          relative
          overflow-hidden
          rounded-md
          bg-[#1B2635]
  
          before:absolute
          before:inset-y-0
          before:-left-full
          before:w-1/2
          before:bg-gradient-to-r
          before:from-transparent
          before:via-[#344154]
          before:to-transparent
          before:animate-skeleton-shimmer
  
          ${className}
        `}
    />
  );
};

const ExerciseModalSkeleton = () => {
  return (
    <div className="space-y-6 p-4">
      {/* Media */}
      <div className="flex justify-center">
        <SkeletonBlock className="h-[220px] w-[220px] rounded-xl" />
      </div>

      {/* Title + meta */}
      <div className="space-y-3">
        <SkeletonBlock className="h-6 w-2/3" />
        <SkeletonBlock className="h-4 w-1/3" />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-16 rounded-xl" />
        <SkeletonBlock className="h-16 rounded-xl" />
        <SkeletonBlock className="h-16 rounded-xl" />
        <SkeletonBlock className="h-16 rounded-xl" />
      </div>

      {/* Secondary muscles */}
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-36" />

        <div className="flex gap-2">
          <SkeletonBlock className="h-8 w-20 rounded-lg" />
          <SkeletonBlock className="h-8 w-24 rounded-lg" />
          <SkeletonBlock className="h-8 w-16 rounded-lg" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-24" />

        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-[92%]" />
          <SkeletonBlock className="h-3 w-[75%]" />
        </div>
      </div>
    </div>
  );
};

export default ExerciseModalSkeleton;
