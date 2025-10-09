import type { PassState } from "./store";

// ---------- ITEMS ----------

export const selectPassesById = (state: PassState) => state.items.byId;

export const selectPass = (state: PassState, id: number) =>
  state.items.byId[id];

export const selectActivePasses = (state: PassState) => {
  const { active, byId } = state.items;
  return active.ids.map((id) => byId[id]);
};

export const selectActivePassesCount = (state: PassState) =>
  state.items.active.count;

export const selectSearchedPasses = (state: PassState) => {
  const { searched, byId } = state.items;
  return searched.ids.map((id) => byId[id]);
};

export const selectSearchedPassesCount = (state: PassState) =>
  state.items.searched.count;

// ---------- CATEGORIES ----------

export const selectPassCategoriesById = (state: PassState) =>
  state.categories.byId;

export const selectPassCategory = (state: PassState, id: number) =>
  state.categories.byId[id];

export const selectPassCategories = (state: PassState) => {
  const { ids, byId } = state.categories;
  return ids.map((id) => byId[id]);
};

export const selectPassCategoriesCount = (state: PassState) =>
  state.categories.count;
