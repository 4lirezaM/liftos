import { useQuery } from "@tanstack/react-query";

import { getExerciseById } from "../api/exercises.api";

const EXERCISE_QUERY_KEY = ["exercise"];

export const useExercise = (exerciseId) => {
  return useQuery({
    queryKey: [...EXERCISE_QUERY_KEY, exerciseId],

    queryFn: () => getExerciseById(exerciseId),

    enabled: Boolean(exerciseId),
  });
};
