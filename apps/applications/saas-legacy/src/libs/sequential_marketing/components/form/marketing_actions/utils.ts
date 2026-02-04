import {
  MarketingActionKind,
  MarketingActions,
  TagActionType,
} from '#src/libs/sequential_marketing/constants';

import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
  StepMarketingActionsTagSpec,
} from '#src/libs/sequential_marketing/types';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';

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
          tag_action_type: TagActionType.ADD,
        },
      };
    case MarketingActions.REMOVE_TAG:
      return {
        id: marketingActionId || null,
        name: '',
        kind: MarketingActionKind.TAG,
        action_spec: {
          tag_id: null,
          tag_action_type: TagActionType.REMOVE,
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
      marketingAction?.action_spec as StepMarketingActionsCommunicationSpec;
    return actionSpec.communication_kind;
  } else {
    const actionSpec =
      marketingAction?.action_spec as StepMarketingActionsTagSpec;
    return actionSpec?.tag_action_type === TagActionType.REMOVE
      ? MarketingActions.REMOVE_TAG
      : MarketingActions.ADD_TAG;
  }
};

/**
 * Filters out tags that are already used in other marketing actions.
 * When editing a marketing action, the currently selected tag remains available.
 *
 * @param tagList - Complete list of available tags
 * @param marketingActionList - List of marketing actions in the current step
 * @param currentMarketingActionId - ID of the marketing action being edited (optional)
 * @returns Filtered list of tags that haven't been used yet
 */
export const filterUnusedTags = (
  tagList: Tag<TagGroupAPI>[],
  marketingActionList?: StepMarketingActions[],
  currentMarketingActionId?: number,
): Tag<TagGroupAPI>[] => {
  if (!marketingActionList || marketingActionList.length === 0) {
    return tagList;
  }

  // Extract tag IDs from all TAG-type marketing actions (excluding the current one)
  const usedTagIds = marketingActionList
    .filter(
      (action) =>
        action.kind === MarketingActionKind.TAG &&
        (!currentMarketingActionId || action.id !== currentMarketingActionId),
    )
    .map((action) => (action.action_spec as StepMarketingActionsTagSpec).tag_id)
    .filter((tagId): tagId is number => tagId !== null);

  // Return only tags that haven't been used yet
  return tagList.filter((tag) => !usedTagIds.includes(tag.id));
};
