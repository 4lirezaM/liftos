import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";
import { removeProgramDayExerciseSets } from "../../api/programDayExerciseSetsApi";

export const useRemoveProgramDayExerciseSet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, exerciseId }) =>
      removeProgramDayExerciseSets({ groupId, exerciseId }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["programDayExerciseSets", user?.id, variables.exerciseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["programDayStructure", user?.id, variables.programDayId],
      });
    },
  });
};
