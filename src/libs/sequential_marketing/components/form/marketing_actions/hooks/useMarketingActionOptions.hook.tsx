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
import Config from '../../../../../../config';

type Props = {
  addMarketingAction: (kind: MarketingActions) => void;
  marketingActionToExclude?: MarketingActions[];
  customColor?: string;
  isPushNotificationUpsellActive?: boolean;
};

export const useMarketingActionOptions = ({
  addMarketingAction,
  marketingActionToExclude,
  customColor,
  isPushNotificationUpsellActive,
}: Props) => {
  const { t } = useTranslation('marketing');

  const handleAddMarketingAction = React.useCallback(
    (type: MarketingActions) => () => addMarketingAction?.(type),
    [addMarketingAction],
  );

  const marketingActionList: MenuAction[] =
    CADENCE_MARKETING_ACTION_CHOICES.filter(
      (marketingActionKind) =>
        !marketingActionToExclude.includes(marketingActionKind),
    )?.map((marketingActionKind) => ({
      label: t(`cadence.form.marketing_action.${marketingActionKind}`),
      icon: marketingActionIconDict[marketingActionKind],
      onClick: handleAddMarketingAction(marketingActionKind),
      customColor:
        customColor || SequentialMarketingColors.MARKETING_ACTION_COLOR,
      // MVP: for now we want to restrict access to SMS action
      isDisabled:
        (marketingActionKind ===
          MarketingActions.CADENCE_MARKETING_ACTION_SMS &&
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'production') ||
        (marketingActionKind ===
          MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION &&
          !isPushNotificationUpsellActive),
    })) ?? [];

  return Immutable(marketingActionList);
};

export default useMarketingActionOptions;
