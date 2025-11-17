import type { SessionState } from "./store";

export const selectManagerSessions = (state: SessionState) => {
  const { ids, byId } = state.managerSessions;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectManagerSession = (state: SessionState, id: number) =>
  state.managerSessions.byId[id];

export const selectManagerSessionsCount = (state: SessionState) =>
  state.managerSessions.count;

export const selectProcessedManagerSessions = (state: SessionState) => {
  const sessions = selectManagerSessions(state);
  return sessions.map((session) => {
    const { name_override, ...sessionWithoutOverride } = session;
    return {
      ...sessionWithoutOverride,
      name: name_override || session.name,
      color: session.meta_activity_color,
    };
  });
};
