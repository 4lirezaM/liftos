import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProgramDayExerciseGroup } from "../../api/programDayExerciseGroupsApi";
import { useAuth } from "@/features/auth";

/**
 * Create a new exercise group.
 *
 * @returns {Object} React Query mutation object.
 */
export const useCreateProgramDayExerciseGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} group
     * @param {string} group.program_day_id
     * @param {string} group.group_type
     * @param {number} group.position
     * @returns {Promise<Object>}
     */
    mutationFn: (group) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return createProgramDayExerciseGroup(group);
    },

    onSuccess: (createdGroup) => {
      queryClient.invalidateQueries({
        queryKey: [
          "programDayExerciseGroups",
          user.id,
          createdGroup.program_day_id,
        ],
      });
    },
  });
};
