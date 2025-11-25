import type { SessionListState } from "./store";

export const selectSessions = (state: SessionListState) => {
  const { ids, byId } = state.sessions;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectSession = (state: SessionListState, id: number) =>
  state.sessions.byId[id];

export const selectProcessedSessions = (state: SessionListState) => {
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

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;
