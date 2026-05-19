import type { EstablishmentState } from "../store";

// Establishment Selectors
export const selectEstablishments = (state: EstablishmentState) => {
  return Object.values(state.establishment.byId);
};

export const selectEstablishmentMappedById = (state: EstablishmentState) => {
  return state.establishment.byId;
};

export const selectEstablishmentById = (
  state: EstablishmentState,
  id: number,
) => state.establishment.byId[id];

export const selectSearchedEstablishments = (state: EstablishmentState) => {
  return state.establishment.searchedIds.map(
    (id) => state.establishment.byId[id],
  );
};

export const selectEstablishmentCount = (state: EstablishmentState) =>
  state.establishment.count;
