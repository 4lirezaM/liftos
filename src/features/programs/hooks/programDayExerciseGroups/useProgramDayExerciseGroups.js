import { useQuery } from "@tanstack/react-query";

import { getProgramDayExerciseGroups } from "../../api/programDayExerciseGroupsApi";
import { useAuth } from "@/features/auth";

/**
 * Fetch all exercise groups belonging to a program day.
 *
 * @param {string} programDayId
 * @returns {Object} React Query query object.
 */
export const useProgramDayExerciseGroups = (programDayId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programDayExerciseGroups", user?.id, programDayId],
    queryFn: () => getProgramDayExerciseGroups(programDayId),
    enabled: Boolean(user?.id && programDayId),
  });
};
