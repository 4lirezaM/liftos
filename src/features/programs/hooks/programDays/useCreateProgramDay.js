import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProgramDay } from "../../api/programDaysApi";
import { useAuth } from "@/features/auth";

/**
 * Create a new program day.
 *
 * @returns {Object} React Query mutation object.
 */
export const useCreateProgramDay = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} programDay
     * @param {string} programDay.program_id
     * @param {string} programDay.name
     * @param {string} [programDay.description]
     * @param {number} programDay.position
     * @returns {Promise<Object>}
     */
    mutationFn: (programDay) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return createProgramDay(programDay);
    },

    onSuccess: (createdProgramDay) => {
      queryClient.invalidateQueries({
        queryKey: ["programDays", user.id, createdProgramDay.program_id],
      });
    },
  });
};
