import { useCallback } from "react";

import {
  fetchFlatTeachersAction,
  selectFlatTeachers,
  useTeacherStore,
} from "@bsport/store-core-data-teacher";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchTeachers = () => {
  const teachers = useTeacherStore(selectFlatTeachers);
  const handleFetchTeachers = useCallback(
    async ({ teacherIds }: { teacherIds: number[] }) => {
      return fetchFlatTeachersAction(fetch, {
        id__in: teacherIds,
      });
    },
    [],
  );

  const [{ isLoading }, fetchTeachers] = useAsync<typeof handleFetchTeachers>({
    asyncFn: handleFetchTeachers,
    dependencies: [handleFetchTeachers],
    onFailure: console.error,
  });

  return {
    isLoading,
    teachers,
    fetchTeachers,
  };
};
