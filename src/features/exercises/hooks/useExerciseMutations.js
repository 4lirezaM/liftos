import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts/AuthContext";

import {
  createExercise,
  updateExercise,
  archiveExercise,
  restoreExercise,
} from "../api/exercises.api";

const EXERCISES_QUERY_KEY = ["exercises"];

export const useExerciseMutations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateExercises = () => {
    queryClient.invalidateQueries({
      queryKey: EXERCISES_QUERY_KEY,
    });
  };

  const createMutation = useMutation({
    mutationFn: (exercise) =>
      createExercise({
        ...exercise,
        userId: user?.id,
      }),

    onSuccess: invalidateExercises,
  });

  const updateMutation = useMutation({
    mutationFn: (exercise) =>
      updateExercise({
        ...exercise,
        userId: user?.id,
      }),

    onSuccess: invalidateExercises,
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id }) =>
      archiveExercise({
        id,
        userId: user?.id,
      }),

    onSuccess: invalidateExercises,
  });

  const restoreMutation = useMutation({
    mutationFn: ({ id }) =>
      restoreExercise({
        id,
        userId: user?.id,
      }),

    onSuccess: invalidateExercises,
  });

  return {
    createExercise: createMutation.mutate,
    createExerciseAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateExercise: updateMutation.mutate,
    updateExerciseAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    archiveExercise: archiveMutation.mutate,
    archiveExerciseAsync: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
    archiveError: archiveMutation.error,

    restoreExercise: restoreMutation.mutate,
    restoreExerciseAsync: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
    restoreError: restoreMutation.error,
  };
};
