import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { type Teacher, fetchFlatTeachers } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";
import {
  GROUP_ACTIVITIES_STALE_TIME_MS,
  fetchAllStudioGroupActivities,
} from "./use-group-activities-query";

const COACH_OPTIONS_QUERY_STALE_TIME_MS = 2 * 60 * 1000;

/**
 * Returns whether a teacher should appear in the total-booking coach picker,
 * scoped to meta-activities that belong to the studio's group activities.
 */
const isTeacherInGroupActivityScope = (
  teacher: Teacher,
  groupMetaActivityIdSet: ReadonlySet<number>,
): boolean => {
  if (teacher.disabled) {
    return false;
  }
  if (teacher.is_teaching_all_activities) {
    return true;
  }
  return teacher.meta_activities_taught.some((metaActivityId) =>
    groupMetaActivityIdSet.has(metaActivityId),
  );
};

/**
 * Builds `{ id, name }` coach options for the total-booking filter: full group-activity list
 * for the studio, then client-side intersection with company teachers (no search API).
 */
export const useCoachOptionsForTotalBookingQuery = (
  companyId: number | undefined,
) => {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: smartlistQueryKeys.coachOptionsForTotalBooking(companyId),
    queryFn: async () => {
      if (companyId === undefined || companyId <= 0) {
        return [];
      }

      const metaActivities = await queryClient.fetchQuery({
        queryKey: smartlistQueryKeys.groupActivitiesKeys.all,
        queryFn: fetchAllStudioGroupActivities,
        staleTime: GROUP_ACTIVITIES_STALE_TIME_MS,
      });
      const groupMetaActivityIdSet = new Set(
        metaActivities
          .filter((metaActivity) => !metaActivity.is_workshop)
          .map((metaActivity) => metaActivity.id),
      );

      const teachers = await fetchFlatTeachers(fetch, {
        company: companyId,
        disabled: false,
      });

      return teachers
        .filter((teacher) =>
          isTeacherInGroupActivityScope(teacher, groupMetaActivityIdSet),
        )
        .map((teacher) => ({ id: teacher.id, name: teacher.name }))
        .sort((left, right) => left.name.localeCompare(right.name));
    },
    staleTime: COACH_OPTIONS_QUERY_STALE_TIME_MS,
  });
};
