import { supabase } from "@/lib/supabase";

/**
 * Get all sets belonging to a program day exercise.
 *
 * @param {string} programDayExerciseId
 * @returns {Promise<Object[]>}
 */
export const getProgramDayExerciseSets = async (programDayExerciseId) => {
  if (!programDayExerciseId) {
    throw new Error("Program Day Exercise ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercise_sets")
    .select("*")
    .eq("program_day_exercise_id", programDayExerciseId)
    .order("position", { ascending: true });

  if (error) throw error;

  return data;
};

/**
 * Get a single program day exercise set.
 *
 * @param {string} programDayExerciseSetId
 * @returns {Promise<Object>}
 */
export const getProgramDayExerciseSet = async (programDayExerciseSetId) => {
  if (!programDayExerciseSetId) {
    throw new Error("Program Day Exercise Set ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercise_sets")
    .select("*")
    .eq("id", programDayExerciseSetId)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Add a set to a program day exercise.
 *
 * The set position is automatically assigned
 * by the database based on the current exercise set order.
 *
 * @param {Object} params
 * @param {string} params.program_day_exercise_id
 * @param {string} params.set_category
 * @param {string} [params.set_method="normal"]
 * @param {number|null} [params.target_weight]
 * @param {number|null} [params.reps_min]
 * @param {number|null} [params.reps_max]
 * @param {number|null} [params.target_duration_seconds]
 * @param {number|null} [params.target_distance]
 * @param {number|null} [params.target_rir]
 * @param {number|null} [params.target_rpe]
 * @param {number|null} [params.rest_seconds]
 * @param {string|null} [params.tempo]
 * @param {string|null} [params.notes]
 * @returns {Promise<Object>}
 */
export const addProgramDayExerciseSet = async ({
  program_day_exercise_id,
  set_category,
  set_method = "normal",
  target_weight = null,
  reps_min = null,
  reps_max = null,
  target_duration_seconds = null,
  target_distance = null,
  target_rir = null,
  target_rpe = null,
  rest_seconds = null,
  tempo = null,
  notes = null,
}) => {
  if (!program_day_exercise_id) {
    throw new Error("Program Day Exercise ID is required");
  }

  if (!set_category) {
    throw new Error("Set category is required");
  }

  const { data, error } = await supabase.rpc("add_program_day_exercise_set", {
    p_program_day_exercise_id: program_day_exercise_id,
    p_set_category: set_category,
    p_set_method: set_method,
    p_target_weight: target_weight,
    p_reps_min: reps_min,
    p_reps_max: reps_max,
    p_target_duration_seconds: target_duration_seconds,
    p_target_distance: target_distance,
    p_target_rir: target_rir,
    p_target_rpe: target_rpe,
    p_rest_seconds: rest_seconds,
    p_tempo: tempo,
    p_notes: notes,
  });

  if (error) throw error;

  return data;
};

/**
 * Update a program day exercise set.
 *
 * @param {string} programDayExerciseSetId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateProgramDayExerciseSet = async (
  programDayExerciseSetId,
  updates
) => {
  if (!programDayExerciseSetId) {
    throw new Error("Program Day Exercise Set ID is required");
  }

  const payload = { ...updates };

  if (payload.tempo !== undefined) {
    payload.tempo = payload.tempo?.trim() || null;
  }

  if (payload.notes !== undefined) {
    payload.notes = payload.notes?.trim() || null;
  }

  const { data, error } = await supabase
    .from("program_day_exercise_sets")
    .update(payload)
    .eq("id", programDayExerciseSetId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
