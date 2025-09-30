import type { PassState } from "./store";

// ---------- ITEMS ----------

export const selectPassById = (state: PassState) => state.items.byId;

export const selectPass = (state: PassState, id: number) =>
  state.items.byId[id];

export const selectActivePasses = (state: PassState) => {
  const { active, byId } = state.items;
  return active.ids.map((id) => byId[id]);
};

export const selectActiveCount = (state: PassState) => state.items.active.count;

export const selectSearchedPasses = (state: PassState) => {
  const { searched, byId } = state.items;
  return searched.ids.map((id) => byId[id]);
};

export const selectSearchedCount = (state: PassState) =>
  state.items.searched.count;

// ---------- CATEGORIES ----------

export const selectCategoriesById = (state: PassState) => state.categories.byId;

export const selectCategory = (state: PassState, id: number) =>
  state.categories.byId[id];

export const selectCategories = (state: PassState) => {
  const { ids, byId } = state.categories;
  return ids.map((id) => byId[id]);
};
