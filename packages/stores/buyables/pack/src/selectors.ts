import type { PackState } from "./store";

export const selectPacks = (state: PackState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectFuzzyPacks = (state: PackState) => {
  const { fuzzyIds, byId } = state;
  return fuzzyIds.map((id) => byId[id]);
};

export const selectPack = (state: PackState, id?: number) =>
  id ? state.byId[id] : undefined;

export const selectCount = (state: PackState) => state.count;
