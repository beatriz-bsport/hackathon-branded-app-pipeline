import type { EstablishmentState } from "../store";

// Establishment Group Selectors
export const selectEstablishmentGroups = (state: EstablishmentState) => {
  return Object.values(state.establishmentGroup.byId);
};

export const selectEstablishmentGroupMappedById = (
  state: EstablishmentState,
) => {
  return state.establishmentGroup.byId;
};

export const selectEstablishmentGroupById = (
  state: EstablishmentState,
  id: number,
) => state.establishmentGroup.byId[id];

export const selectSearchedEstablishmentGroups = (
  state: EstablishmentState,
) => {
  return state.establishmentGroup.searchedIds.map(
    (id) => state.establishmentGroup.byId[id],
  );
};

export const selectEstablishmentGroupCount = (state: EstablishmentState) =>
  state.establishmentGroup.count;
