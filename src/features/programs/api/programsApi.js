import { supabase } from "@/config/supabase";

/**
 * Fetch programs with search, filters, sorting and pagination.
 *
 * @param {Object} options
 * @param {string} [options.search=""]
 * @param {string[]} [options.programType=[]]
 * @param {string[]} [options.goal=[]]
 * @param {string[]} [options.difficulty=[]]
 * @param {"name_asc"|"recently_added"|"recently_updated"} [options.sort="name_asc"]
 * @param {boolean} [options.archived=false]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 * @returns {Promise<{data: Object[], count: number, page: number, limit: number, hasMore: boolean}>}
 */
export const getPrograms = async ({
  search = "",
  programType = [],
  goal = [],
  difficulty = [],
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

  // Search
  const trimmedSearch = search.trim();

  if (trimmedSearch.length >= 3) {
    query = query.ilike("name", `%${trimmedSearch}%`);
  }
  // Filters
  if (programType.length > 0) {
    query = query.in("program_type", programType);
  }

  if (goal.length > 0) {
    query = query.in("goal", goal);
  }

  if (difficulty.length > 0) {
    query = query.in("difficulty", difficulty);
  }

  // Sorting
  switch (sort) {
    case "recently_added":
      query = query
        .order("created_at", { ascending: false })
        .order("id", { ascending: true });
      break;

    case "recently_updated":
      query = query
        .order("updated_at", { ascending: false })
        .order("id", { ascending: true });
      break;

    case "name_asc":
    default:
      query = query
        .order("name", { ascending: true })
        .order("id", { ascending: true });
      break;
  }

  // Pagination
  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw error;
  }

  const programs = data ?? [];
  const totalCount = count ?? 0;

  return {
    data: programs,
    count: totalCount,
    page,
    limit,
    hasMore: from + programs.length < totalCount,
  };
};

/**
 * Fetch a single program by ID.
 *
 * @param {string} programId
 * @returns {Promise<Object>}
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
 * Get the currently active, non-archived program.
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
 * @param {string|null} [program.description]
 * @param {string|null} [program.goal]
 * @param {string|null} [program.difficulty]
 * @param {number|null} [program.duration_weeks]
 * @param {number|null} [program.days_per_week]
 * @param {string|null} [program.program_type]
 * @param {boolean} [program.is_active=false]
 * @returns {Promise<Object>}
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
 * @returns {Promise<Object>}
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
 * Permanently delete a program.
 *
 * @param {string} programId
 * @returns {Promise<boolean>}
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
 * Archive a program and deactivate it.
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

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Activate a program and deactivate the user's previous active program.
 * Requires the activate_program Supabase RPC function.
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

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Restore an archived program as inactive.
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

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Archived program not found");
  }

  return data;
};
