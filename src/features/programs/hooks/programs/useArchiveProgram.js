import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveProgram } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Archive a program.
 *
 * @returns {Object} React Query mutation object.
 *
 * @example
 * mutate("program-id");
 */
export const useArchiveProgram = () => {
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

      return archiveProgram(programId);
    },

    /**
     * @param {Object} archivedProgram
     */
    onSuccess: (archivedProgram) => {
      queryClient.invalidateQueries({
        queryKey: ["programs", user.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["program", user.id, archivedProgram.id],
      });
    },
  });
};
