import type { sportCategoryState } from "./store";

export const selectSportCategories = (state: sportCategoryState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};
export const selectSportCategory = (state: sportCategoryState, id: number) =>
  state.byId[id];
