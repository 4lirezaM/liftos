import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProgram } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Update an existing program.
 *
 * @returns {Object} React Query mutation object.
 *
 * @example
 * mutate({
 *   programId: "program-id",
 *   updates: {
 *     name: "My Program",
 *     goal: "hypertrophy",
 *   },
 * });
 */
export const useUpdateProgram = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} params
     * @param {string} params.programId
     * @param {Object} params.updates
     * @returns {Promise<Object>}
     */
    mutationFn: ({ programId, updates }) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return updateProgram(programId, updates);
    },

    /**
     * @param {Object} updatedProgram
     */
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries({
        queryKey: ["programs", user.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["program", user.id, updatedProgram.id],
      });
    },
  });
};
