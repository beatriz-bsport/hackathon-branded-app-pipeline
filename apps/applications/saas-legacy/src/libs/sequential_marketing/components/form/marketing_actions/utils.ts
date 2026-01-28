import {
  MarketingActionKind,
  MarketingActions,
} from '#src/libs/sequential_marketing/constants';

import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#src/libs/sequential_marketing/types';

export type DraftMarketingAction = {
  type: MarketingActions;
  marketingAction?: StepMarketingActions;
};

/**
 * Retrieves partial values of the marketing step based on the marketing action type.
 *
 * @param marketingActionType - The marketing action type for which to retrieve partial marketing step values.
 * @param marketingActionId - The marketing action id.
 * @returns A partial object representing marketing action values corresponding to the marketing action type.
 */
export const getMarketingActionPartialValues = (
  marketingActionType: MarketingActions,
  marketingActionId?: number,
): Partial<StepMarketingActions> => {
  switch (marketingActionType) {
    case MarketingActions.WRITTEN_EMAIL:
      return {
        id: marketingActionId || null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          subject: '',
          email_design: null,
          communication_kind: MarketingActions.WRITTEN_EMAIL,
        },
      };
    case MarketingActions.SMS:
      return {
        id: marketingActionId || null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          subject: '',
          email_design: null,
          communication_kind: MarketingActions.SMS,
        },
      };
    case MarketingActions.PUSH_NOTIFICATION:
      return {
        id: marketingActionId || null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          subject: '',
          email_design: null,
          communication_kind: MarketingActions.PUSH_NOTIFICATION,
        },
      };
    case MarketingActions.EMAIL_TEMPLATE:
      return {
        id: marketingActionId || null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          subject: '',
          email_design: null,
          communication_kind: MarketingActions.EMAIL_TEMPLATE,
        },
      };
    case MarketingActions.ADD_TAG:
      return {
        id: marketingActionId || null,
        name: '',
        kind: MarketingActionKind.TAG,
        action_spec: {
          tag_id: null,
        },
      };
    default:
      return {};
  }
};

export const getMarketingActionType = (
  marketingAction: Partial<StepMarketingActions>,
) => {
  if (marketingAction?.kind === MarketingActionKind.COMMUNICATION) {
    const actionSpec =
      marketingAction.action_spec as StepMarketingActionsCommunicationSpec;
    return actionSpec.communication_kind;
  }
  return MarketingActions.ADD_TAG;
};
