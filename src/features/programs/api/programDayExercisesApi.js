import { supabase } from "@/config/supabase";
import { getExerciseMediaUrls } from "@/config/storage";

/**
 * Resolve media paths for exercises and return signed URLs.
 *
 * @param {Object[]} records - Program day exercise records.
 * @returns {Promise<Object[]>}
 */
const attachExerciseMediaUrls = async (records) => {
  const mediaPaths = [
    ...new Set(
      records
        .flatMap(({ exercise }) => [
          exercise?.media_path,
          exercise?.thumbnail_path,
        ])
        .filter(Boolean)
    ),
  ];

  const mediaUrls = await getExerciseMediaUrls(mediaPaths);

  return records.map((record) => {
    if (!record.exercise) {
      return record;
    }

    const exercise = record.exercise;

    return {
      ...record,
      exercise: {
        ...exercise,
        media_url: mediaUrls[exercise.media_path] ?? null,
        thumbnail_url: mediaUrls[exercise.thumbnail_path] ?? null,
      },
    };
  });
};

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
 * Get exercises belonging to a group with their library data and signed media URLs.
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

  return attachExerciseMediaUrls(data);
};

/**
 * Get a single exercise record with its library data and signed media URLs.
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
    .select(
      `
      *,
      exercise:exercises (*)
    `
    )
    .eq("id", programDayExerciseId)
    .single();

  if (error) throw error;

  const [record] = await attachExerciseMediaUrls([data]);

  return record;
};

/**
 * Add an exercise to an exercise group.
 *
 * @param {Object} params
 * @param {string} params.group_id
 * @param {string} params.exercise_id
 * @param {string|null} [params.notes=null]
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
 * Update an existing exercise record.
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

  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    throw new Error("Valid exercise updates are required");
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

/**
 * Remove an exercise record from a group.
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

/**
 * Reorder exercises within a group.
 *
 * @param {Object} params
 * @param {string} params.groupId
 * @param {string[]} params.exerciseRecordIds
 * @returns {Promise<void>}
 */
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
