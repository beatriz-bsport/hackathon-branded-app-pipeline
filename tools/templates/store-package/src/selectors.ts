import type { ModelState } from "./store";

export const selectModels = (state: ModelState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectModel = (state: ModelState, id: number) => state.byId[id];

export const selectCount = (state: ModelState) => state.count;
