import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreProgram } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Restore an archived program.
 *
 * @returns {Object} React Query mutation object.
 *
 * @example
 * mutate("program-id");
 */
export const useRestoreProgram = () => {
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

      return restoreProgram(programId);
    },

    onSuccess: (restoredProgram) => {
      queryClient.invalidateQueries({
        queryKey: ["programs", user.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["program", user.id, restoredProgram.id],
      });
    },
  });
};
