import { supabase } from "@/config/supabase";

/**
 * Get all exercises belonging to an exercise group.
 *
 * Exercises are returned in their configured order.
 *
 * @param {string} groupId - The exercise group's ID.
 * @returns {Promise<Object[]>} The list of exercise records.
 * @throws {Error} If the group ID is missing or the database request fails.
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
 * Get exercises belonging to a specific exercise group.
 *
 * @param {string} groupId
 * @returns {Promise<Object[]>}
 */
export const getProgramDayExercisesByGroupId = async (groupId) => {
  if (!groupId) {
    throw new Error("Group ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercises")
    .select(
      `
      *,
      exercise:exercises (*)
    `
    )
    .eq("group_id", groupId)
    .order("position", { ascending: true });

  if (error) throw error;

  return data;
};

/**
 * Get a single exercise record by its ID.
 *
 * @param {string} programDayExerciseId - The record's ID.
 * @returns {Promise<Object>} The exercise record.
 * @throws {Error} If the ID is missing or the record cannot be retrieved.
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
 * The database function assigns the exercise's position.
 * Empty notes are stored as null.
 *
 * @param {Object} params - The exercise record parameters.
 * @param {string} params.group_id - The target exercise group's ID.
 * @param {string} params.exercise_id - The exercise library record's ID.
 * @param {string|null} [params.notes=null] - Optional exercise notes.
 * @returns {Promise<Object>} The created exercise record.
 * @throws {Error} If required parameters are missing or the request fails.
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
 * Update an existing exercise record.
 *
 * Only the provided fields are updated.
 * Empty notes are normalized to null.
 *
 * @param {string} programDayExerciseId - The record's ID.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<Object>} The updated exercise record.
 * @throws {Error} If the ID is missing or the update fails.
 */
export const updateProgramDayExercise = async (
  programDayExerciseId,
  updates
) => {
  if (!programDayExerciseId) {
    throw new Error("Program Day Exercise ID is required");
  }

  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    throw new Error("Valid exercise updates are required");
  }

  const payload = { ...updates };

  // Normalize notes only when the caller explicitly provides this field.
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

/**
 * Remove an exercise record from an exercise group.
 *
 * This deletes the association record, not the exercise from the library.
 *
 * @param {string} exerciseRecordId - The program day exercise record's ID.
 * @returns {Promise<void>} Resolves when the record has been deleted.
 * @throws {Error} If the deletion fails.
 */

/**
 * Remove an exercise record from an exercise group.
 *
 * @param {string} exerciseRecordId
 * @returns {Promise<void>}
 */
export const removeProgramDayExercise = async (exerciseRecordId) => {
  if (!exerciseRecordId) {
    throw new Error("Program Day Exercise ID is required");
  }

  const { error } = await supabase
    .from("program_day_exercises")
    .delete()
    .eq("id", exerciseRecordId);

  if (error) throw error;
};

export const reorderProgramDayExercises = async ({
  groupId,
  exerciseRecordIds,
}) => {
  if (!groupId) {
    throw new Error("Exercise Group ID is required");
  }

  if (!Array.isArray(exerciseRecordIds)) {
    throw new Error("Exercise record IDs must be an array");
  }

  if (
    exerciseRecordIds.some((id) => !id) ||
    new Set(exerciseRecordIds).size !== exerciseRecordIds.length
  ) {
    throw new Error("Exercise record IDs must be valid and unique");
  }

  const { error } = await supabase.rpc("reorder_program_day_exercises", {
    p_group_id: groupId,
    p_exercise_record_ids: exerciseRecordIds,
  });

  if (error) throw error;
};
