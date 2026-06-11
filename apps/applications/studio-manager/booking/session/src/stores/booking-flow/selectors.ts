import { BookingFlowState } from "./types";

export const selectSessionIdsAsString = (state: BookingFlowState) =>
  state.sessionIds.map(String);
