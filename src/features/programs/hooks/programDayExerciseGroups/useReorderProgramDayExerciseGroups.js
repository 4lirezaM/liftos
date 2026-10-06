import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { reorderProgramDayExerciseGroups } from "../../api/programDayExerciseGroupsApi";

/**
 * Reorder exercise groups belonging to a program day.
 *
 * @returns {Object} Mutation object for reordering exercise groups.
 */
export const useReorderProgramDayExerciseGroups = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderProgramDayExerciseGroups,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "programDayExerciseGroups",
          user?.id,
          variables.programDayId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayStructure", user?.id, variables.programDayId],
      });
    },
  });
};
