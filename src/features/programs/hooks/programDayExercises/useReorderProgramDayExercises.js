import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";
import { reorderProgramDayExercises } from "@/features/programs/api/programDayExercisesApi";

export const useReorderProgramDayExercises = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderProgramDayExercises,

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["programDayStructure", user?.id, variables.programDayId],
      });
    },
  });
};
