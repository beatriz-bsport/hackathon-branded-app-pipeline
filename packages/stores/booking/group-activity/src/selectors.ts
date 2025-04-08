import type { GroupActivityState } from "./store";

export const selectGroupActivities = (state: GroupActivityState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectGroupActivity = (state: GroupActivityState, id: number) =>
  state.byId[id];

export const selectCount = (state: GroupActivityState) => state.count;

export const selectInterrogate = (state: GroupActivityState) =>
  state.interrogate;
