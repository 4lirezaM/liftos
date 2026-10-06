import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { getProgramDayExerciseSets } from "../../api/programDayExerciseSetsApi";

/**
 * Get all sets belonging to a program day exercise.
 *
 * @param {string} programDayExerciseId
 * @returns {Object} Query object for program day exercise sets.
 */
export const useProgramDayExerciseSets = (programDayExerciseId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programDayExerciseSets", user?.id, programDayExerciseId],
    queryFn: () => getProgramDayExerciseSets(programDayExerciseId),
    enabled: Boolean(user?.id && programDayExerciseId),
  });
};
