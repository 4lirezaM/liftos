import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProgramDayExerciseGroup } from "../../api/programDayExerciseGroupsApi";
import { useAuth } from "@/features/auth";

/**
 * Update an existing exercise group.
 *
 * @returns {Object} React Query mutation object.
 *
 * @example
 * mutate({
 *   groupId: "group-id",
 *   updates: {
 *     group_type: "superset",
 *     position: 2,
 *   },
 * });
 */
export const useUpdateProgramDayExerciseGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} params
     * @param {string} params.groupId
     * @param {Object} params.updates
     * @returns {Promise<Object>}
     */
    mutationFn: ({ groupId, updates }) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return updateProgramDayExerciseGroup(groupId, updates);
    },

    onSuccess: (updatedGroup) => {
      queryClient.invalidateQueries({
        queryKey: [
          "programDayExerciseGroups",
          user.id,
          updatedGroup.program_day_id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayExerciseGroup", user.id, updatedGroup.id],
      });
    },
  });
};
