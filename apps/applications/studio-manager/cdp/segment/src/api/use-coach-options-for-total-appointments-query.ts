import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchFlatTeachers } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

const COACH_OPTIONS_QUERY_STALE_TIME_MS = 2 * 60 * 1000;

/**
 * Builds `{ id, name }` coach options for the total-appointments filter from
 * all enabled teachers for the studio (no group-activity scoping).
 */
export const useCoachOptionsForTotalAppointmentsQuery = (
  companyId: number | undefined,
) => {
  return useSuspenseQuery({
    queryKey: smartlistQueryKeys.coachOptionsForTotalAppointments(companyId),
    queryFn: async () => {
      if (companyId === undefined || companyId <= 0) {
        return [];
      }

      const teachers = await fetchFlatTeachers(fetch, {
        company: companyId,
      });

      return teachers
        .map((teacher) => ({ id: teacher.id, name: teacher.name }))
        .sort((left, right) => left.name.localeCompare(right.name));
    },
    staleTime: COACH_OPTIONS_QUERY_STALE_TIME_MS,
  });
};
