import { supabase } from "@/config/supabase";

/**
 * Fetch programs owned by the current user.
 *
 * @param {Object} options
 * @param {string} options.search
 * @param {'name_asc'|'recently_added'|'recently_updated'} options.sort
 * @param {boolean} options.archived
 * @param {number} options.page
 * @param {number} options.limit
 */
export const getPrograms = async ({
  search = "",
  sort = "name_asc",
  archived = false,
  page = 1,
  limit = 20,
} = {}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("programs")
    .select(
      `
        id,
        name,
        goal,
        difficulty,
        program_type,
        duration_weeks,
        days_per_week,
        is_active,
        is_archived
      `,
      { count: "exact" }
    )
    .eq("is_archived", archived);

  const trimmedSearch = search.trim();

  if (trimmedSearch.length >= 3) {
    query = query.ilike("name", `%${trimmedSearch}%`);
  }

  switch (sort) {
    case "recently_added":
      query = query.order("created_at", {
        ascending: false,
      });
      break;

    case "recently_updated":
      query = query.order("updated_at", {
        ascending: false,
      });
      break;

    case "name_asc":
    default:
      query = query.order("name", {
        ascending: true,
      });
      break;
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: data ?? [],
    count: count ?? 0,
    page,
    limit,
    hasMore: from + (data?.length ?? 0) < (count ?? 0),
  };
};
/**
 * Fetch a single program by ID.
 *
 * @param {string} programId
 */
export const getProgram = async (programId) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Get the currently active program for the authenticated user.
 *
 * @returns {Promise<Object|null>}
 */
export const getActiveProgram = async () => {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .eq("is_archived", false)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
/**
 * Create a new program.
 *
 * @param {Object} program
 * @param {string} program.created_by
 * @param {string} program.name
 * @param {string} [program.description]
 * @param {string} [program.goal]
 * @param {string} [program.difficulty]
 * @param {number} [program.duration_weeks]
 * @param {number} [program.days_per_week]
 * @param {string} [program.program_type]
 * @param {boolean} [program.is_active]
 */
export const createProgram = async ({
  created_by,
  name,
  description = null,
  goal = null,
  difficulty = null,
  duration_weeks = null,
  days_per_week = null,
  program_type = null,
  is_active = false,
}) => {
  if (!created_by) {
    throw new Error("Created by is required");
  }

  if (!name?.trim()) {
    throw new Error("Program name is required");
  }

  const { data, error } = await supabase
    .from("programs")
    .insert({
      created_by,
      name: name.trim(),
      description: description?.trim() || null,
      goal,
      difficulty,
      duration_weeks,
      days_per_week,
      program_type,
      is_active,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Update an existing program.
 *
 * @param {string} programId
 * @param {Object} updates
 */
export const updateProgram = async (programId, updates) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const payload = { ...updates };

  if (payload.name !== undefined) {
    if (!payload.name?.trim()) {
      throw new Error("Program name is required");
    }

    payload.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    payload.description = payload.description?.trim() || null;
  }

  const { data, error } = await supabase
    .from("programs")
    .update(payload)
    .eq("id", programId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Delete a program.
 *
 * @param {string} programId
 */
export const deleteProgram = async (programId) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId);

  if (error) {
    throw error;
  }

  return true;
};
/**
 * Archive a program and deactivate it if currently active.
 *
 * @param {string} programId
 * @returns {Promise<Object>}
 */
export const archiveProgram = async (programId) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const { data, error } = await supabase
    .from("programs")
    .update({
      is_archived: true,
      is_active: false,
    })
    .eq("id", programId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
/**
 * Activate a program and deactivate the user's previous active program.
 *
 * @param {string} programId
 * @returns {Promise<Object>}
 */
export const activateProgram = async (programId) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const { data, error } = await supabase.rpc("activate_program", {
    p_program_id: programId,
  });

  if (error) throw error;

  return data;
};

/**
 * Restore an archived program.
 *
 * Restored programs remain inactive.
 *
 * @param {string} programId
 * @returns {Promise<Object>}
 */
export const restoreProgram = async (programId) => {
  if (!programId) {
    throw new Error("Program ID is required");
  }

  const { data, error } = await supabase
    .from("programs")
    .update({
      is_archived: false,
      is_active: false,
    })
    .eq("id", programId)
    .eq("is_archived", true)
    .select()
    .single();

  if (error) throw error;

  return data;
};
