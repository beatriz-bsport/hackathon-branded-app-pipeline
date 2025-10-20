import type { SessionState } from "./store";

export const selectSessions = (state: SessionState) => {
  const { ids, byId } = state.sessions;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectSession = (state: SessionState, id: number) =>
  state.sessions.byId[id];

export const selectSessionsCount = (state: SessionState) =>
  state.sessions.count;
