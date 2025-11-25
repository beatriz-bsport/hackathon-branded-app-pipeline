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
  const result: Record<string, InternalEnrichedSession[]> = {};
  const { byDate, byId } = state.sessions;

  Object.entries(byDate).forEach(([date, sessionIds]) => {
    result[date] = sessionIds.map((id) => byId[id]).filter(Boolean);
  });

  return result;
};

export const selectProcessedSessions = (
  state: SessionListState,
): EnrichedSession[] => {
  const sessions = selectSessions(state);
  return sessions.map((session) => {
    const { name_override, ...sessionWithoutOverride } = session;
    return {
      ...sessionWithoutOverride,
      name: name_override || session.name,
      color: session.meta_activity_color,
    };
  });
};

export const selectProcessedSessionsByDate = (
  state: SessionListState,
): Record<string, EnrichedSession[]> => {
  const sessionsByDate = selectSessionsByDate(state);
  const result: Record<string, EnrichedSession[]> = {};

  Object.entries(sessionsByDate).forEach(([date, sessions]) => {
    result[date] = sessions.map((session) => {
      const { name_override, ...sessionWithoutOverride } = session;
      return {
        ...sessionWithoutOverride,
        name: name_override || session.name,
        color: session.meta_activity_color,
      };
    });
  });
  return result;
};

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;
