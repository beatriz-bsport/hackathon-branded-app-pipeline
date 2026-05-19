import { useSuspenseQuery } from "@tanstack/react-query";

import { retrieveTeacherQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useRetrieveTeacher = (teacherId: number) => {
  if (!teacherId) {
    throw new Error("Teacher ID is required to retrieve teacher information.");
  }
  return useSuspenseQuery(retrieveTeacherQueryOptions(fetch, teacherId));
};
