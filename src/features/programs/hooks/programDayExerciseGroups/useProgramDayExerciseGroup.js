import { useQuery } from "@tanstack/react-query";

import { getProgramDayExerciseGroup } from "../../api/programDayExerciseGroupsApi";
import { useAuth } from "@/features/auth";

/**
 * Fetch a single exercise group.
 *
 * @param {string} groupId
 * @returns {Object} React Query query object.
 */
export const useProgramDayExerciseGroup = (groupId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programDayExerciseGroup", user?.id, groupId],
    queryFn: () => getProgramDayExerciseGroup(groupId),
    enabled: Boolean(user?.id && groupId),
  });
};
