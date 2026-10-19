import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";
import { removeProgramDayExerciseSets } from "../../api/programDayExerciseSetsApi";

export const useRemoveProgramDayExerciseSet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programDayExerciseId }) =>
      removeProgramDayExerciseSets(programDayExerciseId),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "programDayExerciseSets",
            user?.id,
            variables.programDayExerciseId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: ["programDayStructure", user?.id, variables.programDayId],
        }),
      ]);
    },
  });
};
