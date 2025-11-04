import type { GroupActivityState } from "./store";

export const selectGroupActivities = (state: GroupActivityState) => {
  const { byId } = state.groupActivity;
  return Object.values(byId);
};

export const selectGroupActivitiesMappedById = (state: GroupActivityState) => {
  const { byId } = state.groupActivity;
  return byId;
};

export const selectCurrentGroupActivities = (state: GroupActivityState) => {
  const { ids, byId } = state.groupActivity;
  return ids.map((id) => byId[id]);
};

export const selectSearchedGroupActivities = (state: GroupActivityState) => {
  const { searchedIds, byId } = state.groupActivity;
  return searchedIds.map((id) => byId[id]);
};

export const selectGroupActivity = (state: GroupActivityState, id: number) =>
  state.groupActivity.byId[id];

export const selectCount = (state: GroupActivityState) =>
  state.groupActivity.count;

export const selectInterrogate = (state: GroupActivityState) =>
  state.groupActivity.interrogate;
