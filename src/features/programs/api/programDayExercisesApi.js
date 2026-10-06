import { supabase } from "@/lib/supabase";

/**
 * Get all exercises belonging to an exercise group.
 *
 * @param {string} groupId
 * @returns {Promise<Object[]>}
 */
export const getProgramDayExercises = async (groupId) => {
  if (!groupId) {
    throw new Error("Exercise Group ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercises")
    .select("*")
    .eq("group_id", groupId)
    .order("position", { ascending: true });

  if (error) throw error;

  return data;
};

/**
 * Get a single program day exercise.
 *
 * @param {string} programDayExerciseId
 * @returns {Promise<Object>}
 */
export const getProgramDayExercise = async (programDayExerciseId) => {
  if (!programDayExerciseId) {
    throw new Error("Program Day Exercise ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercises")
    .select("*")
    .eq("id", programDayExerciseId)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Add an exercise to an exercise group.
 *
 * The exercise position is automatically assigned
 * by the database based on the current group order.
 *
 * @param {Object} params
 * @param {string} params.group_id
 * @param {string} params.exercise_id
 * @param {string|null} [params.notes]
 * @returns {Promise<Object>}
 */
export const addProgramDayExercise = async ({
  group_id,
  exercise_id,
  notes = null,
}) => {
  if (!group_id) {
    throw new Error("Exercise Group ID is required");
  }

  if (!exercise_id) {
    throw new Error("Exercise ID is required");
  }

  const { data, error } = await supabase.rpc("add_program_day_exercise", {
    p_group_id: group_id,
    p_exercise_id: exercise_id,
    p_notes: notes?.trim() || null,
  });

  if (error) throw error;

  return data;
};
/**
 * Update an existing program day exercise.
 *
 * @param {string} programDayExerciseId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateProgramDayExercise = async (
  programDayExerciseId,
  updates
) => {
  if (!programDayExerciseId) {
    throw new Error("Program Day Exercise ID is required");
  }

  const payload = { ...updates };

  if (payload.notes !== undefined) {
    payload.notes = payload.notes?.trim() || null;
  }

  const { data, error } = await supabase
    .from("program_day_exercises")
    .update(payload)
    .eq("id", programDayExerciseId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
