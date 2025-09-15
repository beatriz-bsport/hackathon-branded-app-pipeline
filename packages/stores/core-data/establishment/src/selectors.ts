import type { EstablishmentState } from "./store";

export const selectEstablishments = (state: EstablishmentState) => {
  const { byId } = state;
  return Object.values(byId);
};

export const selectEstablishmentById = (
  state: EstablishmentState,
  id: number,
) => state.byId[id];

export const selectSearchedEstablishments = (state: EstablishmentState) => {
  const { search, byId } = state;
  return search.ids.map((id) => byId[id]);
};

export const selectSearchedEstablishmentCount = (state: EstablishmentState) =>
  state.search.count;

export const selectEstablishmentsList = (state: EstablishmentState) => {
  const { list, byId } = state;
  return list.ids.map((id) => byId[id]);
};

export const selectEstablishmentListCount = (state: EstablishmentState) =>
  state.list.count;
