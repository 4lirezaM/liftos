import { supabase } from "@/lib/supabase";

/**
 * Get the complete exercise structure of a program day.
 *
 * Returns all exercise groups ordered by position,
 * with their exercises ordered by position,
 * and each exercise's sets ordered by position.
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

  return data.map((group) => ({
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
};
