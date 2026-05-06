import { useQuery } from "@tanstack/react-query";

import { type Teacher, fetchFlatTeachers, teacherKeys } from "@bsport/api-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

// Keep this in sync with `@bsport/api-core` until its shared stale time is exported.
const TEACHERS_STALE_TIME = 2 * 60 * 1000;

export type TeacherOption = {
  name: string;
  photo: string | null;
  associatedCoachIds: number[];
};

export const useAllTeachersQuery = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  return useQuery({
    queryKey: teacherKeys.company(companyId, { company: companyId }),
    queryFn: () => fetchFlatTeachers(fetch, { company: companyId }),
    enabled: Boolean(companyId),
    staleTime: TEACHERS_STALE_TIME,
    select: (teachers: Teacher[]): Map<number, TeacherOption> =>
      new Map(
        teachers.map((teacher) => [
          teacher.id,
          {
            name: teacher.name,
            photo: teacher.photo,
            associatedCoachIds: [
              teacher.associated_coach_id,
              ...teacher.associatedcoach_set,
            ],
          },
        ]),
      ),
  });
};
