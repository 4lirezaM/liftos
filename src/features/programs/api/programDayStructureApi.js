import { supabase } from "@/config/supabase";
import { getExerciseMediaUrls } from "@/config/storage";

/**
 * Get the complete exercise structure of a program day,
 * including signed GIF URLs.
 *
 * Program Day → Exercise Groups → Exercises → Sets
 *
 * @param {string} programDayId
 * @returns {Promise<Object[]>}
 */
export const getProgramDayStructure = async (programDayId) => {
  if (!programDayId) {
    throw new Error("Program Day ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercise_groups")
    .select(
      `
      *,
      program_day_exercises (
        *,
        exercise:exercises (*),
        program_day_exercise_sets (*)
      )
    `
    )
    .eq("program_day_id", programDayId)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  const groups = (data ?? []).map((group) => ({
    ...group,
    program_day_exercises: [...(group.program_day_exercises ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((programDayExercise) => ({
        ...programDayExercise,
        program_day_exercise_sets: [
          ...(programDayExercise.program_day_exercise_sets ?? []),
        ].sort((a, b) => a.position - b.position),
      })),
  }));

  // Collect all GIF paths across all groups and exercises.
  const mediaPaths = groups.flatMap((group) =>
    group.program_day_exercises
      .map((item) => item.exercise?.media_path)
      .filter(Boolean)
  );

  // Generate signed URLs in one batch.
  const mediaUrls = await getExerciseMediaUrls([...new Set(mediaPaths)]);

  // Attach the usable GIF URL to each exercise.
  return groups.map((group) => ({
    ...group,
    program_day_exercises: group.program_day_exercises.map((item) => ({
      ...item,
      exercise: item.exercise
        ? {
            ...item.exercise,
            media_url: item.exercise.media_path
              ? mediaUrls[item.exercise.media_path] ?? null
              : null,
          }
        : null,
    })),
  }));
};
