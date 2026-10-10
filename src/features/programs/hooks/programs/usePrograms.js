import { useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

import { getPrograms } from "../../api/programsApi";

const PROGRAMS_QUERY_KEY = ["programs"];

/**
 * Fetch programs with search, sorting, filtering and infinite pagination.
 *
 * @param {Object} options
 * @param {string} [options.search=""]
 * @param {string[]} [options.programType=[]]
 * @param {string[]} [options.goal=[]]
 * @param {string[]} [options.difficulty=[]]
 * @param {boolean} [options.archived=false]
 * @param {"name_asc"|"recently_added"|"recently_updated"} [options.sort="name_asc"]
 * @param {number} [options.limit=10]
 *
 * @returns {Object} Infinite query result.
 */
export const usePrograms = ({
  search = "",
  programType = [],
  goal = [],
  difficulty = [],
  archived = false,
  sort = "name_asc",
  limit = 10,
} = {}) => {
  const { user } = useAuth();

  const debouncedSearch = useDebouncedValue(search, 300);
  const userId = user?.id ?? null;

  return useInfiniteQuery({
    queryKey: [
      ...PROGRAMS_QUERY_KEY,
      {
        search: debouncedSearch,
        userId,
        programType,
        goal,
        difficulty,
        archived,
        sort,
        limit,
      },
    ],

    queryFn: ({ pageParam }) =>
      getPrograms({
        search: debouncedSearch,
        userId,
        programType,
        goal,
        difficulty,
        archived,
        sort,
        page: pageParam,
        limit,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,

    enabled: Boolean(userId),
  });
};
