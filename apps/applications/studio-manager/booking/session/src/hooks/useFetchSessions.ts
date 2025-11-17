import { useCallback, useEffect } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import {
  fetchManagerSessionsAction,
  selectProcessedManagerSessions,
  useSessionStore,
} from "@bsport/store-booking-session";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchSessions = () => {
  const sessions = useSessionStore(selectProcessedManagerSessions);

  const _fetchManagerSessions = useCallback(async () => {
    const today = new Date();

    return fetchManagerSessionsAction(fetch, {
      date: getIsoDateString(today), // YYYY-MM-DD
    });
  }, []);

  const [{ isLoading }, fetchManagerSessions] = useAsync<
    typeof _fetchManagerSessions
  >({
    asyncFn: _fetchManagerSessions,
    dependencies: [_fetchManagerSessions],
  });

  // -- Load data
  useEffect(() => {
    fetchManagerSessions();
  }, [fetchManagerSessions]);

  return {
    isLoading,
    sessions,
  };
};
