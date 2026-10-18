import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { removeProgramDayExercise } from "../../api/programDayExercisesApi";

export const useRemoveProgramDayExercise = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseRecordId }) =>
      removeProgramDayExercise(exerciseRecordId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["programDayExercises", user?.id, variables.groupId],
      });

      if (variables.programDayId) {
        queryClient.invalidateQueries({
          queryKey: ["programDayStructure", user?.id, variables.programDayId],
        });
      }
    },
  });
};
