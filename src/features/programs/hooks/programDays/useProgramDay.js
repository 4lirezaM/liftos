import { useQuery } from "@tanstack/react-query";

import { getProgramDay } from "../../api/programDaysApi";
import { useAuth } from "@/features/auth";

/**
 * Fetch a single program day.
 *
 * @param {string} programDayId
 *
 * @returns {Object} React Query query object.
 */
export const useProgramDay = (programDayId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programDay", user?.id, programDayId],
    queryFn: () => getProgramDay(programDayId),
    enabled: Boolean(user?.id && programDayId),
  });
};
