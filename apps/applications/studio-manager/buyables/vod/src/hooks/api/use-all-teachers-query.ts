import { useQuery } from "@tanstack/react-query";

import { type Teacher, fetchFlatTeachers, teacherKeys } from "@bsport/api-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000;

export type TeacherOption = Pick<Teacher, "id" | "name">;

export const useAllTeachersQuery = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  return useQuery({
    queryKey: teacherKeys.list([], { company: companyId }),
    queryFn: () => fetchFlatTeachers(fetch, { company: companyId }),
    enabled: Boolean(companyId),
    staleTime: TEACHERS_STALE_TIME,
    select: (teachers: Teacher[]): TeacherOption[] =>
      teachers.map((t) => ({ id: t.id, name: t.name })),
  });
};
