import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { type Teacher, fetchFlatTeachers, teacherKeys } from "@bsport/api-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

// Keep this in sync with `@bsport/api-core` until its shared stale time is exported.
const TEACHERS_STALE_TIME = 2 * 60 * 1000;

export type TeacherPreview = Pick<Teacher, "name" | "photo">;

export const useTeachersByAssociatedCoachIdQuery = (
  associatedCoachIds: number[],
) => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const uniqueAssociatedCoachIds = useMemo(
    () => Array.from(new Set(associatedCoachIds)).sort((a, b) => a - b),
    [associatedCoachIds],
  );

  return useQuery({
    queryKey: teacherKeys.list({
      associated_coach__in: uniqueAssociatedCoachIds,
      company: companyId,
    }),
    queryFn: () =>
      fetchFlatTeachers(fetch, {
        associated_coach__in: uniqueAssociatedCoachIds,
        company: companyId,
      }),
    enabled: uniqueAssociatedCoachIds.length > 0 && Boolean(companyId),
    staleTime: TEACHERS_STALE_TIME,
    select: (teachers: Teacher[]): Map<number, TeacherPreview> => {
      const requestedIds = new Set(uniqueAssociatedCoachIds);
      const teachersByAssociatedCoachId = new Map<number, TeacherPreview>();

      for (const teacher of teachers) {
        const teacherAssociatedCoachIds = [
          teacher.associated_coach_id,
          ...teacher.associatedcoach_set,
        ];

        for (const associatedCoachId of teacherAssociatedCoachIds) {
          if (
            requestedIds.has(associatedCoachId) &&
            !teachersByAssociatedCoachId.has(associatedCoachId)
          ) {
            teachersByAssociatedCoachId.set(associatedCoachId, {
              name: teacher.name,
              photo: teacher.photo,
            });
          }
        }
      }

      return teachersByAssociatedCoachId;
    },
  });
};
