import type { WebshopState } from "./store";

export const selectWebshopItems = (state: WebshopState) => {
  const { ids, byId } = state.items;
  return ids.map((id) => byId[id]);
};

export const selectWebshopItem = (state: WebshopState, id: number) =>
  state.items.byId[id];

export const selectCountItems = (state: WebshopState) => state.items.count;
