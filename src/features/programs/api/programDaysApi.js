import { supabase } from "@/lib/supabase";

/**
 * Get all days belonging to a program.
 *
 * @param {string} programId
 * @returns {Promise<Object[]>}
 */
export const getProgramDays = async (programId) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const { data, error } = await supabase
    .from("program_days")
    .select("*")
    .eq("program_id", programId)
    .order("position", { ascending: true });

  if (error) throw error;

  return data;
};

/**
 * Get a single program day.
 *
 * @param {string} programDayId
 * @returns {Promise<Object>}
 */
export const getProgramDay = async (programDayId) => {
  if (!programDayId) {
    throw new Error("Program Day ID is required");
  }

  const { data, error } = await supabase
    .from("program_days")
    .select("*")
    .eq("id", programDayId)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Create a new program day.
 *
 * @param {Object} programDay
 * @param {string} programDay.program_id
 * @param {string} programDay.name
 * @param {string} [programDay.description]
 * @param {number} programDay.position
 *
 * @returns {Promise<Object>}
 */
export const createProgramDay = async ({
  program_id,
  name,
  description = null,
  position,
}) => {
  if (!program_id) {
    throw new Error("Program ID is required");
  }

  if (!name?.trim()) {
    throw new Error("Program Day name is required");
  }

  if (position === undefined || position === null) {
    throw new Error("Program Day position is required");
  }

  const { data, error } = await supabase
    .from("program_days")
    .insert({
      program_id,
      name: name.trim(),
      description: description?.trim() || null,
      position,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Update an existing program day.
 *
 * @param {string} programDayId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateProgramDay = async (programDayId, updates) => {
  if (!programDayId) {
    throw new Error("Program Day ID is required");
  }

  const payload = { ...updates };

  if (payload.name !== undefined) {
    if (!payload.name?.trim()) {
      throw new Error("Program Day name is required");
    }

    payload.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    payload.description = payload.description?.trim() || null;
  }

  const { data, error } = await supabase
    .from("program_days")
    .update(payload)
    .eq("id", programDayId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Delete a program day.
 *
 * @param {string} programDayId
 * @returns {Promise<boolean>}
 */
export const deleteProgramDay = async (programDayId) => {
  if (!programDayId) {
    throw new Error("Program Day ID is required");
  }

  const { error } = await supabase
    .from("program_days")
    .delete()
    .eq("id", programDayId);

  if (error) throw error;

  return true;
};
