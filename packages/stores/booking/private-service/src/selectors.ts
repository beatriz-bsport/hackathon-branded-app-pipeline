import type { PrivateServiceState } from "./store";

export const selectPrivateServices = (state: PrivateServiceState) => {
  const { byId } = state;
  return Object.values(byId);
};

export const selectPrivateServiceById = (
  state: PrivateServiceState,
  id: number,
) => state.byId[id];

export const selectPrivateServiceCount = (state: PrivateServiceState) =>
  state.count;

export const selectSearchedPrivateServices = (state: PrivateServiceState) => {
  const { searchedResults } = state;
  return Object.values(searchedResults);
};

export const selectSearchedPrivateServicesById = (
  state: PrivateServiceState,
  id: number,
) => state.searchedResults[id];

export const selectSearchedPrivateServicesCount = (
  state: PrivateServiceState,
) => Object.keys(state.searchedResults).length;
