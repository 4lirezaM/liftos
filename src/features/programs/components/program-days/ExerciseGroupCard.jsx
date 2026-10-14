function ExerciseGroupCard({ group, onEditExercise }) {
  const meta = getGroupMeta(group);

  const exercises = (group.exercises ?? [])
    .slice()
    .sort((a, b) => a.position - b.position);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Group header */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">
          {group.position}
        </h2>

        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {meta.label}
        </span>
      </header>

      {/* Exercise cards */}
      <div className="space-y-4 p-3 sm:p-4">
        {exercises.map((exercise, index) => (
          <div key={exercise.id}>
            <ExerciseCard
              exercise={exercise}
              index={index}
              onEdit={onEditExercise}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
