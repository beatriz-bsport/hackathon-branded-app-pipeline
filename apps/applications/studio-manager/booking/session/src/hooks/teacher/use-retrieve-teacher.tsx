import { useSuspenseQuery } from "@tanstack/react-query";

import { retrieveTeacherQueryOptions } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch.js";

export const useRetrieveTeacher = (teacherId: number) => {
  if (!teacherId) {
    throw new Error("Teacher ID is required to retrieve teacher information.");
  }
  return useSuspenseQuery(retrieveTeacherQueryOptions(fetch, teacherId));
};
