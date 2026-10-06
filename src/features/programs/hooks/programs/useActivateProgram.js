import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activateProgram } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Activate a program.
 *
 * @returns {Object} React Query mutation object.
 *
 * @example
 * mutate("program-id");
 */
export const useActivateProgram = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {string} programId
     * @returns {Promise<Object>}
     */
    mutationFn: (programId) => {
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      return activateProgram(programId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programs", user.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["program", user.id],
      });
    },
  });
};
