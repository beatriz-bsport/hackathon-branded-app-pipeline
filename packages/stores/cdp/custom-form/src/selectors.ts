import type { CustomFormState } from "./store";

export const selectCustomForms = (state: CustomFormState) => {
  const { ids, byId } = state.customForms;
  return ids.filter((_id) => byId[_id]).map((id) => byId[id]);
};

export const selectCustomFormStatistics = (state: CustomFormState) => {
  const { ids, byId } = state.statistics;
  return ids.filter((_id) => byId[_id]).map((id) => byId[id]);
};

export const selectCustomForm = (state: CustomFormState, id: number) =>
  state.customForms.byId[id];

export const selectCustomFormStatistic = (state: CustomFormState, id: number) =>
  state.statistics.byId[id];

export const selectCustomFormCount = (state: CustomFormState) =>
  state.customForms.count;
