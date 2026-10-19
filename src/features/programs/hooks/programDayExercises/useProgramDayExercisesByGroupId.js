import { useQuery } from "@tanstack/react-query";

import { getProgramDayExercisesByGroupId } from "@/features/programs/api/programDayExercisesApi";

export const useProgramDayExercisesByGroupId = (groupId) => {
  return useQuery({
    queryKey: ["program-day-exercises", "group", groupId],
    queryFn: () => getProgramDayExercisesByGroupId(groupId),
    enabled: Boolean(groupId),
  });
};
