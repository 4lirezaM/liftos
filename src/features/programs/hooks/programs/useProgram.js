import { useQuery } from "@tanstack/react-query";

import { getProgram } from "@/features/programs/api/programsApi";
import { useAuth } from "@/features/auth";

/**
 * Fetch a single program for the current user.
 *
 * @param {string} programId
 */
export const useProgram = (programId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["program", user?.id, programId],
    queryFn: () => getProgram(programId),
    enabled: Boolean(user?.id && programId),
  });
};
