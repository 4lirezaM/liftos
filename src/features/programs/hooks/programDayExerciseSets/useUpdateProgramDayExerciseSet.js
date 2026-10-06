import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { updateProgramDayExerciseSet } from "../../api/programDayExerciseSetsApi";

/**
 * Update a program day exercise set.
 *
 * @returns {Object} Mutation object for updating a program day exercise set.
 */
export const useUpdateProgramDayExerciseSet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programDayId,
      programDayExerciseId,
      programDayExerciseSetId,
      updates,
    }) => updateProgramDayExerciseSet(programDayExerciseSetId, updates),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "programDayExerciseSet",
          user?.id,
          variables.programDayExerciseSetId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "programDayExerciseSets",
          user?.id,
          variables.programDayExerciseId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayStructure", user?.id, variables.programDayId],
      });
    },
  });
};
