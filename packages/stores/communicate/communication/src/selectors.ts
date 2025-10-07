import type { CommunicationState } from "./store";

export const selectCommunications = (state: CommunicationState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectCommunication = (state: CommunicationState, id: number) =>
  state.byId[id];

export const selectCount = (state: CommunicationState) => state.count;
