import { supabase } from "@/lib/supabase";

/**
 * Get all exercise groups belonging to a program day.
 *
 * @param {string} programDayId
 * @returns {Promise<Object[]>}
 */
export const getProgramDayExerciseGroups = async (programDayId) => {
  if (!programDayId) {
    throw new Error("Program Day ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercise_groups")
    .select("*")
    .eq("program_day_id", programDayId)
    .order("position", { ascending: true });

  if (error) throw error;

  return data;
};

/**
 * Get a single exercise group.
 *
 * @param {string} groupId
 * @returns {Promise<Object>}
 */
export const getProgramDayExerciseGroup = async (groupId) => {
  if (!groupId) {
    throw new Error("Exercise Group ID is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercise_groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Create a new exercise group.
 *
 * @param {Object} group
 * @param {string} group.program_day_id
 * @param {string} group.group_type
 * @param {number} group.position
 *
 * @returns {Promise<Object>}
 */
export const createProgramDayExerciseGroup = async ({
  program_day_id,
  group_type,
  position,
}) => {
  if (!program_day_id) {
    throw new Error("Program Day ID is required");
  }

  if (!group_type) {
    throw new Error("Exercise Group type is required");
  }

  if (position === undefined || position === null) {
    throw new Error("Exercise Group position is required");
  }

  const { data, error } = await supabase
    .from("program_day_exercise_groups")
    .insert({
      program_day_id,
      group_type,
      position,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Update an existing exercise group.
 *
 * @param {string} groupId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateProgramDayExerciseGroup = async (groupId, updates) => {
  if (!groupId) {
    throw new Error("Exercise Group ID is required");
  }

  const payload = { ...updates };

  const { data, error } = await supabase
    .from("program_day_exercise_groups")
    .update(payload)
    .eq("id", groupId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
/**
 * Reorder exercise groups belonging to a program day.
 *
 * @param {Object} params
 * @param {string} params.programDayId
 * @param {string[]} params.groupIds
 * @returns {Promise<Object[]>}
 */
export const reorderProgramDayExerciseGroups = async ({
  programDayId,
  groupIds,
}) => {
  if (!programDayId) {
    throw new Error("Program Day ID is required");
  }

  if (!groupIds?.length) {
    throw new Error("Group IDs are required");
  }

  const { data, error } = await supabase.rpc(
    "reorder_program_day_exercise_groups",
    {
      p_program_day_id: programDayId,
      p_group_ids: groupIds,
    }
  );

  if (error) throw error;

  return data;
};
