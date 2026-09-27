import { supabase } from "./supabase";

const EXERCISE_MEDIA_BUCKET = "exercise-media";
const SIGNED_URL_EXPIRES_IN = 60 * 60 * 6; // 6 hours

export const getExerciseMediaUrls = async (mediaPaths) => {
  const validPaths = mediaPaths.filter(Boolean);

  if (validPaths.length === 0) {
    return {};
  }

  const { data, error } = await supabase.storage
    .from(EXERCISE_MEDIA_BUCKET)
    .createSignedUrls(validPaths, SIGNED_URL_EXPIRES_IN);

  if (error) {
    throw error;
  }

  return Object.fromEntries(
    data.map(({ path, signedUrl }) => [path, signedUrl])
  );
};

export const getExerciseMediaUrl = async (mediaPath) => {
  if (!mediaPath) {
    return null;
  }

  const urls = await getExerciseMediaUrls([mediaPath]);

  return urls[mediaPath] ?? null;
};
