// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';

import { MarketingActions } from '#src/libs/sequential_marketing/constants';
import { getCompanyFeatureList } from '#src/libs/company/selectors';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';

import type { StepMarketingActions } from '#src/libs/sequential_marketing/types';

type UpsellCheckResult = {
  isPushNotification: boolean;
  isSms: boolean;
  hasPushNotificationUpsell: boolean;
  hasSmsUpsell: boolean;
};

export const useMarketingActionUpsellCheck = (
  marketingAction: StepMarketingActions,
): UpsellCheckResult => {
  const featureList = useSelector(getCompanyFeatureList);

  const communicationKind =
    'communication_kind' in marketingAction.action_spec
      ? marketingAction.action_spec.communication_kind
      : null;

  const isPushNotification =
    communicationKind ===
    MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION;
  const isSms =
    communicationKind === MarketingActions.CADENCE_MARKETING_ACTION_SMS;

  const hasPushNotificationUpsell = hasUpsell(
    featureList,
    UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  );
  const hasSmsUpsell = hasUpsell(featureList, UPSELL_IDENTIFIER_SMS);

  return {
    isPushNotification,
    isSms,
    hasPushNotificationUpsell,
    hasSmsUpsell,
  };
};
