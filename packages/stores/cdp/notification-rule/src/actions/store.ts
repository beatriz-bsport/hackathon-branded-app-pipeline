import { notificationRuleStore } from "#src/store";
import type { CommunicationVariable } from "#src/types";

export const setCommunicationVariables = (
  communicationVariableTagList: CommunicationVariable,
) => {
  notificationRuleStore.setState((state) => {
    if (!communicationVariableTagList) return state;
    return {
      ...state,
      communicationVariable: { ...communicationVariableTagList },
    };
  });
};
