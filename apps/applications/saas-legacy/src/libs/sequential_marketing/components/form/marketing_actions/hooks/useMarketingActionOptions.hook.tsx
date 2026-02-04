import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';

import {
  CADENCE_MARKETING_ACTION_CHOICES,
  MarketingActions,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import { marketingActionIconDict } from '#src/libs/sequential_marketing/components/helpers/utils';
import type { MenuAction } from '#src/components/menu/types';
import { useCommunicationUpsellCheck } from '#src/libs/sequential_marketing/components/graph/hooks/useCommunicationUpsellCheck';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

type Props = {
  addMarketingAction: (kind: MarketingActions) => void;
  marketingActionToExclude?: MarketingActions[];
  customColor?: string;
};

/**
 * Returns an array of MarketingActions that should be excluded based on feature flags
 * and additional exclusions passed via props.
 * Add new feature flag conditions here to control which specific actions are hidden.
 */
const getExcludedMarketingActions = (
  featureFlags: {
    showRemoveTagMarketingAction: boolean;
  },
  marketingActionToExclude?: MarketingActions[],
): MarketingActions[] => {
  const excludedMarketingActions: MarketingActions[] = [
    ...(marketingActionToExclude ?? []),
  ];

  if (!featureFlags.showRemoveTagMarketingAction) {
    excludedMarketingActions.push(MarketingActions.REMOVE_TAG);
  }

  return excludedMarketingActions;
};

export const useMarketingActionOptions = ({
  addMarketingAction,
  marketingActionToExclude,
  customColor,
}: Props) => {
  const { t } = useTranslation('marketing');

  const { isPushNotificationUpsellActive, isSmsUpsellActive } =
    useCommunicationUpsellCheck();

  const showRemoveTagMarketingAction = useSafeFlag(
    FeatureFlags.AUDIENCE_REMOVE_TAG_MARKETING_ACTION,
  );

  const handleAddMarketingAction = React.useCallback(
    (type: MarketingActions) => () => addMarketingAction?.(type),
    [addMarketingAction],
  );

  const excludedMarketingActions = getExcludedMarketingActions(
    { showRemoveTagMarketingAction },
    marketingActionToExclude,
  );

  const marketingActionList: MenuAction[] =
    CADENCE_MARKETING_ACTION_CHOICES.filter(
      (marketingActionKind) =>
        !excludedMarketingActions.includes(marketingActionKind),
    )?.map((marketingActionKind) => ({
      label: t(`cadence.form.marketing_action.${marketingActionKind}`),
      icon: marketingActionIconDict[marketingActionKind],
      onClick: handleAddMarketingAction(marketingActionKind),
      customColor:
        customColor || SequentialMarketingColors.MARKETING_ACTION_COLOR,
      // MVP: for now we want to restrict access to SMS action
      isDisabled:
        (marketingActionKind === MarketingActions.SMS && !isSmsUpsellActive) ||
        (marketingActionKind === MarketingActions.PUSH_NOTIFICATION &&
          !isPushNotificationUpsellActive),
    })) ?? [];

  return Immutable(marketingActionList);
};

export default useMarketingActionOptions;
