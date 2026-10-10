function ProgramListSkeletonItem() {
  return (
    <div
      className="
          flex
          w-full
          items-stretch
          border-b
          border-border
          last:border-b-0
        "
    >
      {/* Main Content */}
      <div
        className="
            flex
            min-w-0
            flex-1
            animate-pulse
            items-center
            gap-4
            px-2
            py-2
  
            sm:gap-5
            sm:px-5
            sm:py-6
  
            lg:gap-6
            lg:px-6
            lg:py-6
          "
      >
        {/* Program Type Image */}
        <div
          className="
              h-[88px]
              w-[63px]
              shrink-0
              rounded-lg
              bg-foreground/[0.08]
  
              sm:h-[105px]
              sm:w-[75px]
  
              lg:h-[123px]
              lg:w-[87px]
            "
        />

        {/* Program Information */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <div
            className="
                h-5
                w-3/4
                rounded
                bg-foreground/[0.08]
  
                sm:h-5
                lg:h-6
              "
          />

          <div
            className="
                mt-2
                h-4
                w-1/2
                rounded
                bg-foreground/[0.06]
              "
          />
        </div>

        {/* Desktop Program Information */}
        <div
          className="
              hidden
              min-w-0
              lg:flex
              lg:w-[38%]
              lg:items-center
              lg:gap-8
            "
        >
          {/* Difficulty */}
          <div className="w-24 shrink-0">
            <div className="h-3 w-16 rounded bg-foreground/[0.06]" />

            <div className="mt-2 h-4 w-20 rounded bg-foreground/[0.08]" />
          </div>

          {/* Duration */}
          <div className="w-24 shrink-0">
            <div className="h-3 w-14 rounded bg-foreground/[0.06]" />

            <div className="mt-2 h-4 w-20 rounded bg-foreground/[0.08]" />
          </div>
        </div>

        {/* Frequency */}
        <div className="flex w-8 shrink-0 flex-col items-center">
          <div className="h-5 w-5 rounded bg-foreground/[0.08] sm:h-6 sm:w-6" />

          <div className="mt-1 h-3 w-5 rounded bg-foreground/[0.05]" />
        </div>
      </div>
    </div>
  );
}

export default function ProgramListSkeleton({ count = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {Array.from({ length: count }).map((_, index) => (
        <ProgramListSkeletonItem key={index} />
      ))}
    </div>
  );
}
