import { useSuspenseQueries } from "@tanstack/react-query";

import { retrieveGroupActivityQueryOptions } from "@bsport/api-book";
import {
  retrieveEstablishmentQueryOptions,
  retrieveTeacherQueryOptions,
} from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

export const useRetrieveSessionDetails = (session: {
  coach_override: number | null;
  coach: number;
  meta_activity: number;
  establishment: number;
}) => {
  const [teacher, activity, establishment] = useSuspenseQueries({
    queries: [
      retrieveTeacherQueryOptions(
        fetch,
        session.coach_override ?? session.coach,
      ),
      retrieveGroupActivityQueryOptions(fetch, session.meta_activity),
      retrieveEstablishmentQueryOptions(fetch, session.establishment),
    ],
  });

  return {
    teacher: teacher.data,
    activity: activity.data,
    establishment: establishment.data,
  };
};
