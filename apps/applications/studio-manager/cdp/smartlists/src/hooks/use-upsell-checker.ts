import { useCompanyUpsell } from "#src/utils/permissions";

/** Upsell identifiers for campaign channels (update when product provides values). */
export const UPSELL_IDENTIFIER_SMS = 4;
export const UPSELL_IDENTIFIER_PUSH_NOTIFICATION = 15;
export const UPSELL_IDENTIFIER_CUSTOM_APP = 1;

/** Map campaign type (sms/push/popup) to upsell identifier for request_upsell_by_identifier API. */
export const UPSELL_IDENTIFIER_BY_CAMPAIGN_TYPE: Record<
  "sms" | "push" | "popup",
  number
> = {
  sms: UPSELL_IDENTIFIER_SMS,
  push: UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  popup: UPSELL_IDENTIFIER_CUSTOM_APP,
};

export const useUpsellChecker = () => {
  const hasSmsUpsell = useCompanyUpsell(UPSELL_IDENTIFIER_SMS);
  const hasPushNotificationUpsell = useCompanyUpsell(
    UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  );
  const hasPopupUpsell = useCompanyUpsell(UPSELL_IDENTIFIER_CUSTOM_APP);

  return {
    hasSmsUpsell,
    hasPushNotificationUpsell,
    hasPopupUpsell,
    /** Show "Add-on" chip when studio does not have the upsell for this channel. */
    showAddOnChipSms: !hasSmsUpsell,
    showAddOnChipPush: !hasPushNotificationUpsell,
    showAddOnChipPopup: !hasPopupUpsell,
  };
};
