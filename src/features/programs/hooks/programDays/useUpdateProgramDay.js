import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProgramDay } from "../../api/programDaysApi";
import { useAuth } from "@/features/auth";

/**
 * Update an existing program day.
 *
 * @returns {Object} React Query mutation object.
 *
 * @example
 * mutate({
 *   programDayId: "program-day-id",
 *   updates: {
 *     name: "Day 1 - Push",
 *     description: "Chest, shoulders and triceps",
 *   },
 * });
 */
export const useUpdateProgramDay = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} params
     * @param {string} params.programDayId
     * @param {Object} params.updates
     * @returns {Promise<Object>}
     */
    mutationFn: ({ programDayId, updates }) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return updateProgramDay(programDayId, updates);
    },

    onSuccess: (updatedProgramDay) => {
      queryClient.invalidateQueries({
        queryKey: ["programDays", user.id, updatedProgramDay.program_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDay", user.id, updatedProgramDay.id],
      });
    },
  });
};
