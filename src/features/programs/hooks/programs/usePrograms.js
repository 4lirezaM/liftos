import { useQuery } from "@tanstack/react-query";

import { getPrograms } from "../../api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Fetch programs with search, sorting, filtering and pagination.
 *
 * @param {Object} options
 * @param {string} [options.search]
 * @param {string} [options.sort]
 * @param {boolean} [options.archived]
 * @param {number} [options.page]
 * @param {number} [options.limit]
 *
 * @returns {Object} React Query query object.
 */
export const usePrograms = ({
  search = "",
  sort = "name_asc",
  archived = false,
  page = 1,
  limit = 20,
} = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programs", user?.id, { search, sort, archived, page, limit }],
    queryFn: () =>
      getPrograms({
        search,
        sort,
        archived,
        page,
        limit,
      }),
    enabled: Boolean(user?.id),
  });
};
