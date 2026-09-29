import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { getExercises } from "../api/exercises.api";

const EXERCISES_QUERY_KEY = ["exercises"];

export const useExercises = ({
  search = "",
  source = "all",
  primaryMuscle = [],
  secondaryMuscles = [],
  equipment = [],
  archived = false,
  sort = "name_asc",
  limit = 20,
} = {}) => {
  const { user } = useAuth();
  const debouncedSearch = useDebouncedValue(search, 300);
  const userId = user?.id ?? null;

  return useInfiniteQuery({
    queryKey: [
      ...EXERCISES_QUERY_KEY,
      {
        search: debouncedSearch,
        source,
        userId,
        primaryMuscle,
        secondaryMuscles,
        equipment,
        archived,
        sort,
        limit,
      },
    ],

    queryFn: ({ pageParam }) =>
      getExercises({
        search: debouncedSearch,
        source,
        userId,
        primaryMuscle,
        secondaryMuscles,
        equipment,
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

    enabled:
      debouncedSearch.length >= 3 || debouncedSearch.length === 0
        ? source !== "my" || Boolean(userId)
        : false,
  });
};
