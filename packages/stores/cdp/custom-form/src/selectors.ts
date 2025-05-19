import type { CustomFormState } from "./store";

export const selectCustomForms = (state: CustomFormState) => {
  const { ids, byId } = state;
  return ids.filter((_id) => byId[_id]).map((id) => byId[id]);
};

export const selectCustomForm = (state: CustomFormState, id: number) =>
  state.byId[id];

export const selectCount = (state: CustomFormState) => state.count;
