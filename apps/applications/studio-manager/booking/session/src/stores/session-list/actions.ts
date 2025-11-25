import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";
import type { ManagerSession } from "@bsport/store-booking-session";
import type { Establishment } from "@bsport/store-core-data-establishment";
import type { Teacher } from "@bsport/store-core-data-teacher";

import { fetchManagerSessionsAPI } from "./api";
import { type EnrichedSession, sessionListStore } from "./store";

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
  const byId: Record<number, EnrichedSession> = {};
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

export const enrichSessionsWithRelatedData = ({
  teachersById,
  establishmentsById,
}: {
  teachersById: Record<number, Teacher>;
  establishmentsById: Record<number, Establishment>;
}) => {
  sessionListStore.setState((state) => {
    const enrichedById: Record<number, EnrichedSession> = {};

    Object.entries(state.sessions.byId).forEach(([id, session]) => {
      const teacher = teachersById[session.coach];
      const teacherOverride = session.coach_override
        ? teachersById[session.coach_override]
        : undefined;
      const establishment = establishmentsById[session.establishment];

      enrichedById[Number(id)] = {
        ...session,
        teacherName: teacherOverride?.name ?? teacher?.name,
        originalTeacherName: teacher?.name,
        establishmentName: establishment?.title,
      };
    });

    return {
      ...state,
      sessions: {
        ...state.sessions,
        byId: enrichedById,
      },
    };
  });
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

export const setCalendarView = (calendarView: "range" | "daily") => {
  sessionListStore.setState({
    calendarView,
  });
};
