import type { SessionListState } from "./store";
import { EnrichedSession, InternalEnrichedSession } from "./types";

export const selectSessions = (state: SessionListState) => {
  const { ids, byId } = state.sessions;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectSession = (state: SessionListState, id: number) =>
  state.sessions.byId[id];

export const selectSessionsByDate = (
  state: SessionListState,
): Record<string, InternalEnrichedSession[]> => {
  const { byDate, byId } = state.sessions;

  return Object.entries(byDate).reduce(
    (result, [date, sessionIds]) => {
      result[date] = sessionIds.map((id) => byId[id]).filter(Boolean);
      return result;
    },
    {} as Record<string, InternalEnrichedSession[]>,
  );
};

const processSession = (session: InternalEnrichedSession): EnrichedSession => {
  const { name_override, ...sessionWithoutOverride } = session;
  return {
    ...sessionWithoutOverride,
    name: name_override || session.name,
    color: session.meta_activity_color,
  };
};

export const selectProcessedSessions = (
  state: SessionListState,
): EnrichedSession[] => {
  const sessions = selectSessions(state);
  return sessions.map(processSession);
};

export const selectProcessedSessionsByDate = (
  state: SessionListState,
): Record<string, EnrichedSession[]> => {
  const sessionsByDate = selectSessionsByDate(state);

  return Object.entries(sessionsByDate).reduce(
    (result, [date, sessions]) => {
      result[date] = sessions.map(processSession);
      return result;
    },
    {} as Record<string, EnrichedSession[]>,
  );
};

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;
