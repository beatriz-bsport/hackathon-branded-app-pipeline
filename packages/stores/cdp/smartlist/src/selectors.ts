import type { SmartlistState } from "./store";

export const selectSmartlists = (state: SmartlistState) => {
  const { ids, fuzzySearchIds, byId, page, pageSize } = state;

  /**
   * Why?
   * For the time being the API doesn't support pagination
   * We want to implement pagination in the UI in the meantime
   * In any case we are loading all the smartlists at once
   */
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const activeIds = fuzzySearchIds.length > 0 ? fuzzySearchIds : ids;

  return activeIds.slice(start, end).map((id) => byId[id]);
};

export const selectSmartlist = (state: SmartlistState, id: number) =>
  state.byId[id];

export const selectCount = (state: SmartlistState) => {
  return state.fuzzySearchIds.length > 0
    ? state.fuzzySearchIds.length
    : state.count;
};

export const selectAllMappedSmartlists = (state: SmartlistState) => {
  return state.byId;
};

export const selectSearchedSmartlists = (state: SmartlistState) => {
  const { byId, fuzzySearchIds } = state;
  return fuzzySearchIds.map((id) => byId[id]);
};
