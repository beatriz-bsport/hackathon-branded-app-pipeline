import type { WebshopState } from "./store";

// ---------- ITEMS ----------

export const selectWebshopItemsById = (state: WebshopState) => state.items.byId;

export const selectWebshopItem = (state: WebshopState, id: number) =>
  state.items.byId[id];

export const selectActiveWebshopItems = (state: WebshopState) => {
  const { active, byId } = state.items;
  return active.ids.map((id) => byId[id]);
};

export const selectActiveWebshopItemsCount = (state: WebshopState) =>
  state.items.active.count;

export const selectSearchedWebshopItems = (state: WebshopState) => {
  const { searched, byId } = state.items;
  return searched.ids.map((id) => byId[id]);
};

export const selectSearchedWebshopItemsCount = (state: WebshopState) =>
  state.items.searched.count;

// ---------- CATEGORIES ----------

export const selectWebshopCategoriesById = (state: WebshopState) =>
  state.categories.byId;

export const selectWebshopCategories = (state: WebshopState) => {
  const { ids, byId } = state.categories;
  return ids.map((id) => byId[id]);
};

export const selectWebshopCategory = (state: WebshopState, id: number) =>
  state.categories.byId[id];

export const selectWebshopCategoriesCount = (state: WebshopState) =>
  state.categories.count;
