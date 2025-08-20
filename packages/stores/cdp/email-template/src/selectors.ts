import type { EmailTemplateState } from "./store";

// ----- Email Templates Category Selector -----

export const selectCategory = (state: EmailTemplateState, id: number) =>
  state.categories.byId?.[id];

export const selectAllCategories = (state: EmailTemplateState) =>
  Object.values(state.categories.byId);

export const selectAllCategoriesMappedById = (state: EmailTemplateState) => {
  const { byId } = state.categories;
  return byId;
};

export const selectCategoriesCount = (state: EmailTemplateState) =>
  state.categories.count;

// ----- Email Templates Summary Selector -----

export const selectFlatEmailTemplateSummaries = (state: EmailTemplateState) => {
  const { flatIds, byId } = state.summaries;
  return flatIds.filter((_id) => byId[_id]).map((id) => byId[id]);
};

export const selectFuzzySearchEmailTemplateSummaries = (
  state: EmailTemplateState,
) => {
  const { fuzzyIds, byId } = state.summaries;
  return fuzzyIds.filter((_id) => byId[_id]).map((id) => byId[id]);
};

export const selectEmailTemplateSummariesCount = (state: EmailTemplateState) =>
  state.summaries.count;

export const selectAllEmailTemplateSummaries = (state: EmailTemplateState) =>
  Object.values(state.summaries.byId);

// ----- Email Templates Detail Selector -----

export const selectEmailTemplateDetail = (
  state: EmailTemplateState,
  id: number,
) => {
  return state.details.byId?.[id];
};
