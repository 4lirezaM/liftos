import { supabase } from "@/config/supabase";
import { useAuth } from "../../auth";
import { getExerciseMediaUrl, getExerciseMediaUrls } from "@/config/storage";

/**
 * Create a new exercise.
 *
 * @param {Object} exercise
 * @param {string} exercise.name
 * @param {string} exercise.userId
 * @param {string} exercise.primaryMuscle
 * @param {string} [exercise.description]
 * @param {string[]} [exercise.secondaryMuscles]
 * @param {string|null} [exercise.equipment]
 * @param {string|null} [exercise.bodyRegion]
 *
 * @returns {Promise<Object>}
 */
export async function createExercise({
  name,
  description = null,
  userId,
  primaryMuscle,
  secondaryMuscles = [],
  equipment = null,
  bodyRegion = null,
}) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (!primaryMuscle) {
    throw new Error("Primary muscle is required.");
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
      body_region: bodyRegion,
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
  const normalizedSearch = search.trim();

  if (normalizedSearch.length >= 3) {
    query = query.ilike("name", `%${normalizedSearch}%`);
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
  if (primaryMuscle.length > 0) {
    query = query.in("primary_muscle", primaryMuscle);
  }

  if (equipment.length > 0) {
    query = query.in("equipment", equipment);
  }

  // secondary_muscles is a PostgreSQL text[] column.
  // "overlaps" means at least one selected muscle exists
  // in the exercise's secondary_muscles array.
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

  const { data: preData, error, count } = await query;

  if (error) {
    throw error;
  }

  const exercises = preData ?? [];

  /*
   * Exercise List only needs thumbnails.
   * GIF/media URLs are intentionally NOT generated here.
   *
   * This avoids generating one signed GIF URL per exercise.
   */
  const thumbnailPaths = exercises
    .map((exercise) => exercise.thumbnail_path)
    .filter(Boolean);

  const thumbnailUrls =
    thumbnailPaths.length > 0 ? await getExerciseMediaUrls(thumbnailPaths) : {};

  const data = exercises.map((exercise) => ({
    ...exercise,
    thumbnail_url: exercise.thumbnail_path
      ? thumbnailUrls[exercise.thumbnail_path] ?? null
      : null,
  }));

  return {
    data,
    count: count ?? 0,
    page,
    limit,
    hasMore: from + data.length < (count ?? 0),
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
 * Archived exercises are intentionally NOT filtered out here,
 * because archived exercises must still be viewable and restorable.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getExerciseById(id) {
  if (!id) {
    throw new Error("Exercise ID is required.");
  }

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  const mediaPaths = [data.media_path, data.thumbnail_path].filter(Boolean);

  const mediaUrls =
    mediaPaths.length > 0 ? await getExerciseMediaUrls(mediaPaths) : {};

  return {
    ...data,
    media_url: data.media_path ? mediaUrls[data.media_path] ?? null : null,
    thumbnail_url: data.thumbnail_path
      ? mediaUrls[data.thumbnail_path] ?? null
      : null,
  };
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
 * @param {string} [options.primaryMuscle]
 * @param {string[]} [options.secondaryMuscles]
 * @param {string|null} [options.equipment]
 * @param {string|null} [options.bodyRegion]
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
  bodyRegion,
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

  if (bodyRegion !== undefined) {
    updates.body_region = bodyRegion;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No fields to update.");
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
