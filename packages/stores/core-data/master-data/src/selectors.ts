import type { sctState } from "./store";

export const selectScts = (state: sctState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};
export const selectSct = (state: sctState, id: number) => state.byId[id];
