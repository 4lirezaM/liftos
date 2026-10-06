import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { addProgramDayExercise } from "../../api/programDayExercisesApi";

/**
 * Add an exercise to an exercise group.
 *
 * @returns {Object} Mutation object for adding a program day exercise.
 */
export const useAddProgramDayExercise = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programDayId, ...exerciseData }) =>
      addProgramDayExercise(exerciseData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["programDayExercises", user?.id, variables.group_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayStructure", user?.id, variables.programDayId],
      });
    },
  });
};
