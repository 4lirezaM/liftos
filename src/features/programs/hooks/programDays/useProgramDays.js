import { useQuery } from "@tanstack/react-query";

import { getProgramDays } from "../../api/programDaysApi";
import { useAuth } from "@/features/auth";

/**
 * Fetch all days belonging to a program.
 *
 * @param {string} programId
 *
 * @returns {Object} React Query query object.
 */
export const useProgramDays = (programId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programDays", user?.id, programId],
    queryFn: () => getProgramDays(programId),
    enabled: Boolean(user?.id && programId),
  });
};
