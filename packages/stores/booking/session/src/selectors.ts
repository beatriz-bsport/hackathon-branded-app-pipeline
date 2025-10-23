import type { SessionState } from "./store";

export const selectManagerSessions = (state: SessionState) => {
  const { ids, byId } = state.managerSessions;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectManagerSession = (state: SessionState, id: number) =>
  state.managerSessions.byId[id];

export const selectManagerSessionsCount = (state: SessionState) =>
  state.managerSessions.count;
