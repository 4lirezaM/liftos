import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { updateProgramDayExercise } from "../../api/programDayExercisesApi";

/**
 * Update a program day exercise.
 *
 * @returns {Object} Mutation object for updating a program day exercise.
 */
export const useUpdateProgramDayExercise = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programDayExerciseId, updates }) =>
      updateProgramDayExercise(programDayExerciseId, updates),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "programDayExercise",
          user?.id,
          variables.programDayExerciseId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayExercises", user?.id, variables.groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayStructure", user?.id, variables.programDayId],
      });
    },
  });
};
