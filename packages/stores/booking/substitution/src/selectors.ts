import type { SubstitutionState } from "#src/store";
import type { SubstitutionRequest } from "#src/types";

export const selectSubstitutionRequests = (state: SubstitutionState) => {
  const { ids, byId } = state.requests;
  return ids.map((id) => byId[id]).filter(Boolean);
};

export const selectSubstitutionRequest = (
  state: SubstitutionState,
  id: number,
) => state.requests.byId[id];

export const selectSubstitutionRequestsBySessionId = (
  state: SubstitutionState,
) => {
  const sessionToRequestsMap = new Map<number, SubstitutionRequest[]>();
  Object.values(state.requests.byId).forEach((request) => {
    const sessionId = request.offer;
    const currentList = sessionToRequestsMap.get(sessionId);
    sessionToRequestsMap.set(
      sessionId,
      currentList ? [...currentList, request] : [request],
    );
  });
  return sessionToRequestsMap;
};
