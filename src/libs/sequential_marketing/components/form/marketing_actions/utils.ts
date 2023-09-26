import type { TFunction } from 'i18next';
import Immutable from 'seamless-immutable';

import {
  MarketingActionKind,
  MarketingActions,
  CADENCE_MARKETING_ACTION_CHOICES,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

import { marketingActionIconDict } from '#libs/sequential_marketing/components/helpers/utils';
import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#libs/sequential_marketing/types';

export type DraftMarketingAction = {
  type: MarketingActions;
  marketingAction?: StepMarketingActions;
};

export const getDefaultValues = (type: MarketingActions) => {
  switch (type) {
    case MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL:
      return {
        id: null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          subject: '',
          communication_kind:
            MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
        },
      };
    case MarketingActions.CADENCE_MARKETING_ACTION_SMS:
      return {
        id: null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
        },
      };
    case MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION:
      return {
        id: null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          text_content: '',
          subject: '',
          communication_kind:
            MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
        },
      };
    case MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE:
      return {
        id: null,
        name: '',
        kind: MarketingActionKind.COMMUNICATION,
        action_spec: {
          email_design: null,
          communication_kind:
            MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
        },
      };
    case MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT:
      return {
        id: null,
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

export const getMarketingActionOptions = (
  t: TFunction,
  addMarketingAction: (type: MarketingActions) => void,
) => {
  const handleAddMarketingAction = (type: MarketingActions) => () =>
    addMarketingAction?.(type);

  const marketingActionList = CADENCE_MARKETING_ACTION_CHOICES.map(
    (marketingAction) => ({
      label: t(`cadence.form.marketing_action.${marketingAction}`),
      icon: marketingActionIconDict[marketingAction],
      onClick: handleAddMarketingAction(marketingAction),
      customColor: SequentialMarketingColors.INNER_STEP_COLOR,
    }),
  );

  return Immutable(marketingActionList);
};

export const getMarketingActionType = (
  marketingAction: StepMarketingActions,
) => {
  if (marketingAction?.kind === MarketingActionKind.COMMUNICATION) {
    const actionSpec =
      marketingAction.action_spec as StepMarketingActionsCommunicationSpec;
    return actionSpec.communication_kind;
  }
  return MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT;
};

export const getMarketingActionsAsDraft = (
  marketingActions?: StepMarketingActions[],
) => {
  const initialMarketingActionsAsDraft: DraftMarketingAction[] =
    marketingActions?.map((marketingAction) => ({
      type: getMarketingActionType(marketingAction),
      marketingAction,
    })) ?? [];
  return initialMarketingActionsAsDraft;
};
