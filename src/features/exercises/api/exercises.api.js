import { supabase } from "@/config/supabase";
import { useAuth } from "../../auth";

/**
 * Create a new exercise.
 *
 * @param {Object} exercise
 * @param {string} exercise.name
 * @param {string} [exercise.description]
 * @param {string} exercise.userId
 * @param {string} [exercise.primaryMuscle]
 * @param {string[]} [exercise.secondaryMuscles]
 * @param {string} [exercise.equipment]
 * @param {string} [exercise.exerciseType]
 * @param {string} [exercise.movementPattern]
 *
 * @returns {Promise<Object>}
 */
export async function createExercise({
  name,
  description = null,
  userId,
  primaryMuscle = null,
  secondaryMuscles = [],
  equipment = null,
  exerciseType = null,
  movementPattern = null,
}) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      name,
      description,
      created_by: userId,
      primary_muscle: primaryMuscle,
      secondary_muscles: secondaryMuscles,
      equipment,
      exercise_type: exerciseType,
      movement_pattern: movementPattern,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get exercises from the Exercise Library.
 *
 * Supports:
 * - Search by exercise name
 * - Source filtering: all / system / my
 * - Primary muscle filtering
 * - Secondary muscle filtering
 * - Equipment filtering
 * - Exercise type filtering
 * - Movement pattern filtering
 * - Active / archived filtering
 * - Sorting
 * - Pagination
 *
 * @param {Object} options
 * @param {string} options.search
 * @param {"all" | "system" | "my"} options.source
 * @param {string[]} options.primaryMuscle
 * @param {string[]} options.secondaryMuscles
 * @param {string[]} options.equipment
 * @param {string[]} options.exerciseType
 * @param {string[]} options.movementPattern
 * @param {boolean} options.archived
 * @param {"name_asc" | "recently_added"} options.sort
 * @param {number} options.page
 * @param {number} options.limit
 *
 * @returns {Promise<{
 *   data: Array,
 *   count: number,
 *   page: number,
 *   limit: number,
 *   hasMore: boolean
 * }>}
 */
export async function getExercises({
  search = "",
  source = "all",
  primaryMuscle = [],
  secondaryMuscles = [],
  equipment = [],
  exerciseType = [],
  movementPattern = [],
  archived = false,
  sort = "name_asc",
  page = 1,
  limit = 20,
} = {}) {
  let query = supabase
    .from("exercises")
    .select("*", { count: "exact" })
    .eq("is_archived", archived);

  // Search starts from 3 characters.
  // Search is case-insensitive and works anywhere inside the exercise name.
  if (search.trim().length >= 3) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  // Source filter.
  // "all" needs no extra condition because RLS already allows
  // system exercises and the current user's own exercises.
  if (source === "system") {
    query = query.is("created_by", null);
  }

  if (source === "my") {
    const { user, userError } = useAuth();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    query = query.eq("created_by", user.id);
  }

  // Multiple values inside one filter use OR semantics.
  // Example:
  // primaryMuscle: ["chest", "back"]
  // means chest OR back.
  if (primaryMuscle.length > 0) {
    query = query.in("primary_muscle", primaryMuscle);
  }

  if (equipment.length > 0) {
    query = query.in("equipment", equipment);
  }

  if (exerciseType.length > 0) {
    query = query.in("exercise_type", exerciseType);
  }

  if (movementPattern.length > 0) {
    query = query.in("movement_pattern", movementPattern);
  }

  // secondary_muscles is a PostgreSQL text[] column.
  // "ov" means the exercise's array overlaps with the selected values.
  //
  // Example:
  // secondaryMuscles: ["triceps", "front_delts"]
  //
  // means the exercise must contain at least one of them.
  if (secondaryMuscles.length > 0) {
    query = query.overlaps("secondary_muscles", secondaryMuscles);
  }

  // Sorting
  if (sort === "recently_added") {
    query = query.order("created_at", {
      ascending: false,
    });
  } else {
    query = query.order("name", {
      ascending: true,
    });
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

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
}

/**
 * Get one exercise by its ID.
 *
 * Used for:
 * - Exercise Details
 * - View
 * - Edit
 * - Archived Exercise Details
 *
 * RLS decides whether the current user is allowed to see
 * the requested exercise.
 *
 * Archived exercises are intentionally NOT filtered out here,
 * because archived exercises must still be viewable and restorable.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getExerciseById(id) {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
/**
 * Update an existing exercise.
 *
 * Only fields provided in the input will be updated.
 *
 * @param {Object} options
 * @param {string} options.id
 * @param {string} options.userId
 * @param {string} [options.name]
 * @param {string|null} [options.description]
 * @param {string|null} [options.primaryMuscle]
 * @param {string[]} [options.secondaryMuscles]
 * @param {string|null} [options.equipment]
 * @param {string|null} [options.exerciseType]
 * @param {string|null} [options.movementPattern]
 *
 * @returns {Promise<Object>}
 */
export async function updateExercise({
  id,
  userId,
  name,
  description,
  primaryMuscle,
  secondaryMuscles,
  equipment,
  exerciseType,
  movementPattern,
}) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (!id) {
    throw new Error("Exercise ID is required.");
  }

  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (primaryMuscle !== undefined) {
    updates.primary_muscle = primaryMuscle;
  }

  if (secondaryMuscles !== undefined) {
    updates.secondary_muscles = secondaryMuscles;
  }

  if (equipment !== undefined) {
    updates.equipment = equipment;
  }

  if (exerciseType !== undefined) {
    updates.exercise_type = exerciseType;
  }

  if (movementPattern !== undefined) {
    updates.movement_pattern = movementPattern;
  }

  const { data, error } = await supabase
    .from("exercises")
    .update(updates)
    .eq("id", id)
    .eq("created_by", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
/**
 * Archive an exercise.
 *
 * Only the owner of the exercise can archive it.
 *
 * @param {Object} options
 * @param {string} options.id
 * @param {string} options.userId
 *
 * @returns {Promise<Object>}
 */
export async function archiveExercise({ id, userId }) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (!id) {
    throw new Error("Exercise ID is required.");
  }

  const { data, error } = await supabase
    .from("exercises")
    .update({
      is_archived: true,
    })
    .eq("id", id)
    .eq("created_by", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Restore an archived exercise.
 *
 * Only the owner of the exercise can restore it.
 *
 * @param {Object} options
 * @param {string} options.id
 * @param {string} options.userId
 *
 * @returns {Promise<Object>}
 */
export async function restoreExercise({ id, userId }) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (!id) {
    throw new Error("Exercise ID is required.");
  }

  const { data, error } = await supabase
    .from("exercises")
    .update({
      is_archived: false,
    })
    .eq("id", id)
    .eq("created_by", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
