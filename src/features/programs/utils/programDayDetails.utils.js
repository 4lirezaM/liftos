export function formatLabel(value) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatTarget(set) {
  switch (set.rep_type) {
    case "fixed":
      return set.reps_min != null ? `${set.reps_min} reps` : "—";

    case "range":
      return set.reps_min != null && set.reps_max != null
        ? `${set.reps_min}–${set.reps_max} reps`
        : "—";

    case "duration":
      return set.target_duration_seconds != null
        ? `${set.target_duration_seconds}s`
        : "—";

    case "distance":
      return set.target_distance != null
        ? `${set.target_distance} distance`
        : "—";

    default:
      return "—";
  }
}

export function formatWeight(weight) {
  return weight != null ? `${weight} kg` : "—";
}

export function formatRest(seconds) {
  if (seconds == null) return "—";

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];

  return [];
}

export function normalizeExerciseGroup(group) {
  const { program_day_exercises = [], ...groupData } = group;

  return {
    ...groupData,

    type: group.group_type ?? group.type ?? "normal",

    exercises: [...program_day_exercises]
      .sort((a, b) => a.position - b.position)
      .map((item) => {
        const {
          exercise: exerciseData,
          program_day_exercise_sets = [],
          ...exerciseItem
        } = item;

        const exercise = exerciseData ?? {};

        return {
          ...exerciseItem,

          name: exercise.name ?? "Unknown exercise",
          media_url: exercise.media_url ?? null,

          primary_muscles: toArray(exercise.primary_muscle),
          secondary_muscles: toArray(exercise.secondary_muscles),
          equipment: toArray(exercise.equipment),

          notes: item.notes ?? "",

          sets: [...program_day_exercise_sets].sort(
            (a, b) => a.position - b.position
          ),
        };
      }),
  };
}
