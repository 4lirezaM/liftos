import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { getPrograms } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

const PROGRAMS_QUERY_KEY = ["programs"];
/**
 * Fetch programs with search, sorting, filtering and infinite pagination.
 *
 * @param {Object} options
 * @param {string} [options.search]
 * @param {'name_asc'|'recently_added'|'recently_updated'} [options.sort]
 * @param {boolean} [options.archived]
 * @param {number} [options.limit]
 *
 * @returns {Object} Infinite query object for programs.
 */
export const usePrograms = ({
  search = "",
  sort = "name_asc",
  archived = false,
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
        sort,
        archived,
        limit,
      },
    ],

    queryFn: ({ pageParam }) =>
      getPrograms({
        search: debouncedSearch,
        sort,
        archived,
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
        ? Boolean(userId)
        : false,
  });
};
