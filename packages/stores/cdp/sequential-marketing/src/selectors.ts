import type { SequentialMarketingState } from "./store";

export const selectCadences = (state: SequentialMarketingState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectCadence = (state: SequentialMarketingState, id: number) =>
  state.byId[id];

export const selectCount = (state: SequentialMarketingState) => state.count;
