import type { SmartlistState } from "./store";

export const selectSmartlists = (state: SmartlistState) => {
  const { ids, byId } = state;

  return ids.map((id) => byId[id]);
};

export const selectSmartlist = (state: SmartlistState, id: number) =>
  state.byId[id];

export const selectCount = (state: SmartlistState) => state.count;
