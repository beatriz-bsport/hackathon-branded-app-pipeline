import type { PassState } from "./store";

export const selectPasses = (state: PassState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectPass = (state: PassState, id: number) => state.byId[id];

export const selectCount = (state: PassState) => state.count;
