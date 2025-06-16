import type { NotificationRuleState } from "./store";

export const selectAllCommunicationVariables = (state: NotificationRuleState) =>
  state.communicationVariable;

export const selectCommunicationVariablesByTagName = (
  state: NotificationRuleState,
  tagName: string,
) => state.communicationVariable[tagName];
