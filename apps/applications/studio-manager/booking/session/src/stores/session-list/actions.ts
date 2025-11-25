import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";
import type { ManagerSession } from "@bsport/store-booking-session";

import { fetchManagerSessionsAPI } from "./api";
import { sessionListStore } from "./store";

type FetchSessionsResponse = {
  results: ManagerSession[];
};

export const setSessionsForDate = ({
  date,
  sessions,
}: {
  date: string;
  sessions: ManagerSession[];
}) => {
  const byId: Record<number, ManagerSession> = {};
  const ids: number[] = [];

  sessions.forEach((session) => {
    byId[session.id] = session;
    ids.push(session.id);
  });

  sessionListStore.setState((state) => ({
    ...state,
    sessions: {
      ...state.sessions,
      byId: { ...state.sessions.byId, ...byId },
      ids,
      byDate: {
        ...state.sessions.byDate,
        [date]: ids,
      },
    },
  }));
};

export const fetchSessionsAction: Action<
  { date: string },
  FetchSessionsResponse
> = async (fetch, params) => {
  const [uri, init] = fetchManagerSessionsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      if (Array.isArray(data)) {
        setSessionsForDate({
          date: params.date,
          sessions: data,
        });
      } else {
        setSessionsForDate({
          date: params.date,
          sessions: data.results,
        });
      }

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch sessions",
        params,
      }),
  );
};
