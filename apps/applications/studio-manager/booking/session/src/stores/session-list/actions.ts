import { Result } from "typescript-result";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import { type Action, createErrorWithContext } from "@bsport/store-base";
import type { ManagerSession } from "@bsport/store-booking-session";
import type { Establishment } from "@bsport/store-core-data-establishment";
import type { Teacher } from "@bsport/store-core-data-teacher";

import { fetchManagerSessionsAPI } from "./api";
import { CalendarView, sessionListStore } from "./store";
import type { InternalEnrichedSession } from "./types";

export type FetchSessionsResponse = {
  results: ManagerSession[];
};

type SetSessionsParams = {
  sessions: ManagerSession[];
};

// Action to set sessions in the store, organizing them by ID and date
// This is overriding the existing sessions in the store
export const setSessionsForDateRange = ({ sessions }: SetSessionsParams) => {
  const byId: Record<number, InternalEnrichedSession> = {};
  const ids: number[] = [];
  const byDate: Record<string, number[]> = {};

  sessions.forEach((session) => {
    byId[session.id] = session;
    ids.push(session.id);

    // Extract date from session's date_start (format: "YYYY-MM-DDTHH:mm:ss")
    const sessionDate = getIsoDateString(new Date(session.date_start));
    if (!byDate[sessionDate]) {
      byDate[sessionDate] = [];
    }
    byDate[sessionDate].push(session.id);
  });

  sessionListStore.setState((state) => ({
    ...state,
    sessions: {
      byId,
      ids,
      byDate,
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
    const enrichedById: Record<number, InternalEnrichedSession> = {};

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
  { minDate: string; maxDate: string },
  FetchSessionsResponse
> = async (fetch, params) => {
  const [uri, init] = fetchManagerSessionsAPI({
    min_date: params.minDate,
    max_date: params.maxDate,
  });

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      const sessions = Array.isArray(data) ? data : data.results;

      setSessionsForDateRange({
        sessions,
      });

      return { results: sessions };
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch sessions",
        params,
      }),
  );
};

export const setCalendarView = (calendarView: CalendarView) => {
  const currentSelectedDate = sessionListStore.getState().selectedDate;
  if (
    calendarView === CalendarView.DAILY &&
    currentSelectedDate.type === "range" &&
    currentSelectedDate.minDate
  ) {
    sessionListStore.setState({
      calendarView,
      selectedDate: {
        type: "single",
        date: currentSelectedDate.minDate,
      },
    });
    return;
  }
  sessionListStore.setState({
    calendarView,
  });
};

export const setSelectedDate = (date: Date | [Date | null, Date | null]) => {
  if (Array.isArray(date)) {
    sessionListStore.setState({
      selectedDate: { type: "range", minDate: date[0], maxDate: date[1] },
    });
  } else {
    sessionListStore.setState({
      selectedDate: { type: "single", date },
    });
  }
};

export const setUniqueDate = (date: Date) => {
  sessionListStore.setState({
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date },
  });
};
