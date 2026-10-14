export default function Tag({ children }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-md bg-surface-secondary px-2 py-1 text-[10px] text-secondary">
      <span className="truncate">{children}</span>
    </span>
  );
}
