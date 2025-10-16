import type { SubstitutionState } from "./store";

export const selectSubstitutionRequests = (state: SubstitutionState) => {
  const { ids, byId } = state.requests;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectSubstitutionRequest = (
  state: SubstitutionState,
  id: number,
) => state.requests.byId[id];
