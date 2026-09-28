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

export default SkeletonBlock;
