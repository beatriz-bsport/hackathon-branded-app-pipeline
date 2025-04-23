import type { CompanyState } from "./store";

export const selectCompany = (state: CompanyState, id: number) =>
  state.byId[id];

export const selectCompanies = (state: CompanyState) => {
  const { searchIds, byId } = state;
  return searchIds.map((id) => byId[id]);
};

export const selectFeatures = (state: CompanyState) => state.features;
