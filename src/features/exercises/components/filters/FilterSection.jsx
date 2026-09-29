export default function FilterSection({ title, children }) {
  return (
    <section className="border-b border-border py-5 last:border-b-0">
      <h3 className="mb-3 text-sm font-medium text-foreground">{title}</h3>

      {children}
    </section>
  );
}
