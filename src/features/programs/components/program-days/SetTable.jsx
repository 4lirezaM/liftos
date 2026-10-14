import {
  formatRest,
  formatTarget,
  formatWeight,
} from "../../utils/programDayDetails.utils";

export default function SetTable({ exercises }) {
  const maxSets = Math.max(
    0,
    ...exercises.map((exercise) => exercise.sets.length)
  );

  if (maxSets === 0) {
    return (
      <p className="px-2 py-3 text-center text-xs text-secondary">
        No sets added yet.
      </p>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border">
      <table className="w-full table-fixed text-left text-[10px] sm:text-xs">
        <colgroup>
          <col className="w-[12%]" />
          <col className="w-[38%]" />
          <col className="w-[25%]" />
          <col className="w-[25%]" />
        </colgroup>

        <thead className="bg-surface-secondary text-secondary">
          <tr>
            <th className="px-1.5 py-2 font-medium sm:px-2">Set</th>
            <th className="px-1.5 py-2 font-medium sm:px-2">
              Exercise / Target
            </th>
            <th className="px-1.5 py-2 font-medium sm:px-2">Weight</th>
            <th className="px-1.5 py-2 font-medium sm:px-2">Rest</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: maxSets }, (_, setIndex) => {
            const rowExercises = exercises.filter(
              (exercise) => exercise.sets[setIndex]
            );

            return rowExercises.map((exercise, rowIndex) => {
              const set = exercise.sets[setIndex];

              return (
                <tr
                  key={`${exercise.id}-${set.id ?? setIndex}`}
                  className="border-t border-border"
                >
                  {rowIndex === 0 && (
                    <td
                      rowSpan={rowExercises.length}
                      className="px-1.5 py-2 align-middle font-medium text-foreground sm:px-2"
                    >
                      {setIndex + 1}
                    </td>
                  )}

                  <td className="break-words px-1.5 py-2 text-foreground sm:px-2">
                    <span className="block break-words">{exercise.name}</span>
                    <span className="mt-0.5 block text-secondary">
                      {formatTarget(set)}
                    </span>
                  </td>

                  <td className="break-words px-1.5 py-2 text-foreground sm:px-2">
                    {formatWeight(set.target_weight)}
                  </td>

                  <td className="break-words px-1.5 py-2 text-secondary sm:px-2">
                    {formatRest(set.rest_seconds)}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
