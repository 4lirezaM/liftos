import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { addProgramDayExerciseSet } from "../../api/programDayExerciseSetsApi";

/**
 * Add a set to a program day exercise.
 *
 * @returns {Object} Mutation object for adding a program day exercise set.
 */
export const useAddProgramDayExerciseSet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programDayId, ...setData }) =>
      addProgramDayExerciseSet(setData),

    onSuccess: (_, variables) => {
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
