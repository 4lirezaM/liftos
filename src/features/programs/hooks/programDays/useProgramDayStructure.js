import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { getProgramDayStructure } from "../../api/programDayStructureApi";

/**
 * Get the complete exercise structure of a program day.
 *
 * @param {string} programDayId
 * @returns {Object} Query object for the program day structure.
 */
export const useProgramDayStructure = (programDayId) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programDayStructure", user?.id, programDayId],
    queryFn: () => getProgramDayStructure(programDayId),
    enabled: Boolean(user?.id && programDayId),
  });
};
