import { useCallback } from "react";

import {
  PaginatedFetchSessionsParams,
  fetchSessionsAPI,
} from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fetchManagerSessionsAction } from "@bsport/store-booking-session";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useCompanyTimezone } from "#src/utils/stores-interface";

export const useFetchSessions = (params: {
  onSuccess: ({
    teacherIds,
    sessionIds,
  }: {
    teacherIds: number[];
    sessionIds: number[];
  }) => void;
}) => {
  const companyTimezone = useCompanyTimezone();

  const handleFetchManagerSessions = useCallback(async () => {
    // 1) Probe: fetch the next upcoming session only
    // 2) Fetch: load the full list of manager sessions for that session's day
    //    (or fall back to today's upcoming if there's no next session at all)
    let nextSessionDateStart: string | null = null;
    try {
      // Use the paginated offer list endpoint as a probe to fetch exactly the next upcoming session.
      const probeParams: PaginatedFetchSessionsParams = {
        only_future_strict: true,
        available: true,
        ordering: "date_start",
        page_size: 1,
      };

      const probeResult = await fetchSessionsAPI(fetch, probeParams);
      nextSessionDateStart = probeResult.results[0]?.date_start ?? null;
    } catch (error) {
      console.error(error);
      nextSessionDateStart = null;
    }

    const todayUTC = new Date();
    const nextSessionCompanyDate = formatDateTime(
      nextSessionDateStart ? nextSessionDateStart : todayUTC.toISOString(),
      DATETIME_FORMATS.ISO_DATE,
      { timeZone: companyTimezone },
    );

    return fetchManagerSessionsAction(fetch, {
      only_future_strict: true,
      available: true,
      date: nextSessionCompanyDate,
    });
  }, [companyTimezone]);

  const [{ isLoading }, fetchManagerSessions] = useAsync<
    typeof handleFetchManagerSessions
  >({
    asyncFn: handleFetchManagerSessions,
    dependencies: [handleFetchManagerSessions],
    onSuccess: ({ value }) => {
      const sessions = value;

      // Retrieve teacher ids to fetch related data
      const teacherIds = new Set<number>();
      sessions.forEach((session) => {
        if (session.coach) {
          teacherIds.add(session.coach);
        }

        if (session.coach_override) {
          teacherIds.add(session.coach_override);
        }
      });

      params?.onSuccess({
        teacherIds: Array.from(teacherIds),
        sessionIds: sessions.map((session) => session.id),
      });
    },
    onFailure: console.error,
  });

  return {
    isLoading,
    fetchManagerSessions,
  };
};
