import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";

import { getActiveProgram } from "../../api/programsApi";

/**
 * Get the currently active program for the authenticated user.
 *
 * @returns {Object} Query object for the active program.
 */
export const useActiveProgram = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["activeProgram", user?.id],
    queryFn: getActiveProgram,
    enabled: Boolean(user?.id),
  });
};
