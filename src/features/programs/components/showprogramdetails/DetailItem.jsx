export const DetailItem = ({ label, value }) => (
  <div className="min-w-0 py-4">
    <p className="text-xs font-medium uppercase tracking-wider text-foreground/45">
      {label}
    </p>

    <p className="mt-2 wrap-break-word text-sm font-semibold text-foreground">
      {value ?? "—"}
    </p>
  </div>
);
