import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { RootState } from '#src/reducers';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
// eslint-disable-next-line
import { useSelector } from 'react-redux';

/**
 * This hook checks the status of upsell features for push notifications and SMS.
 * Be aware that this hook assumes that the feature flags have already been fetched and are available in the Redux store.
 * If the feature flags are not yet available, the returned values may not be accurate.
 * @returns An object containing two boolean properties:
 * - isPushNotificationUpsellActive: Indicates if the push notification upsell feature is active.
 * - isSmsUpsellActive: Indicates if the SMS upsell feature is active.
 */
export const useCommunicationUpsellCheck = () => {
  const allowAudienceSmsMarketingActions = useSafeFlag(
    FeatureFlags.AUDIENCE_SMS_MARKETING_ACTIONS,
  );
  const featureFlagList = useSelector(
    (state: RootState) => state.company.feature.data,
  );

  const isPushNotificationUpsellActive = hasUpsell(
    featureFlagList,
    UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  );
  const isSmsUpsellActive =
    hasUpsell(featureFlagList, UPSELL_IDENTIFIER_SMS) &&
    allowAudienceSmsMarketingActions;

  return {
    isPushNotificationUpsellActive,
    isSmsUpsellActive,
  };
};
