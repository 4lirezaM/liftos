import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProgram } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Create a new program.
 *
 * @returns {Object} React Query mutation object.
 */
export const useCreateProgram = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} program
     * @param {string} program.name
     * @param {string} [program.description]
     * @param {string} [program.goal]
     * @param {string} [program.difficulty]
     * @param {number} [program.duration_weeks]
     * @param {number} [program.days_per_week]
     * @param {string} [program.program_type]
     * @param {boolean} [program.is_active]
     * @returns {Promise<Object>}
     */
    mutationFn: (program) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return createProgram({
        ...program,
        created_by: user.id,
      });
    },

    /**
     * @param {Object} createdProgram
     */
    onSuccess: (createdProgram) => {
      queryClient.invalidateQueries({
        queryKey: ["programs", user.id],
      });
    },
  });
};
