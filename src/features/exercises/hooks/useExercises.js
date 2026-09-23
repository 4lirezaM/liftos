import { useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts/AuthContext";
import { getExercises } from "../api/exercises.api";

const EXERCISES_QUERY_KEY = ["exercises"];

export const useExercises = ({
  search = "",
  source = "all",
  primaryMuscle = [],
  secondaryMuscles = [],
  equipment = [],
  exerciseType = [],
  movementPattern = [],
  archived = false,
  sort = "name_asc",
  limit = 20,
} = {}) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: [
      ...EXERCISES_QUERY_KEY,
      {
        search,
        source,
        primaryMuscle,
        secondaryMuscles,
        equipment,
        exerciseType,
        movementPattern,
        archived,
        sort,
        limit,
      },
    ],

    queryFn: ({ pageParam }) =>
      getExercises({
        search,
        source,
        userId: user?.id,
        primaryMuscle,
        secondaryMuscles,
        equipment,
        exerciseType,
        movementPattern,
        archived,
        sort,
        page: pageParam,
        limit,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.page + 1;
    },

    enabled: source !== "my" || Boolean(user?.id),
  });
};
