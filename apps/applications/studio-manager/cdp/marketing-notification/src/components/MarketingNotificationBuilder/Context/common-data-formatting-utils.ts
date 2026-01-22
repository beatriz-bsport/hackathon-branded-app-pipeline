import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { extractEntityId } from "#src/utils/marketingNotificationTriggerCondition";

/**
 * Extracts common base form data shared across all notification types
 */
export const extractBaseFormData = (
  marketingNotification: MarketingNotification,
) => {
  const itemIds = extractEntityId(marketingNotification);
  const eventRules = marketingNotification.event_rules;

  const shouldContainAllPasses =
    ("contains_all_payment_packs" in eventRules &&
      eventRules.contains_all_payment_packs) ||
    ("contains_all_private_passes" in eventRules &&
      eventRules.contains_all_private_passes);

  const isPushNotificationSetUp =
    !!marketingNotification.push_notification_content ||
    !!marketingNotification.push_notification_title;

  const isEmailNotificationSetUp = !!marketingNotification.email_design;

  return {
    itemIds,
    eventRules,
    shouldContainAllPasses,
    triggerType: {
      draftMarketingNotificationId: marketingNotification.id,
      itemIds,
      shouldContainAllPasses,
    },
    content: {
      isEmailNotificationChecked: isEmailNotificationSetUp,
      isPushNotificationChecked: isPushNotificationSetUp,
      emailTemplateId: marketingNotification.email_design ?? undefined,
      pushNotificationContent:
        marketingNotification.push_notification_content ?? undefined,
      pushNotificationTitle:
        marketingNotification.push_notification_title ?? undefined,
    },
  };
};

/**
 * Extracts smartlist filtering configuration
 */
export const extractSmartlistConfig = (
  eventRules: MarketingNotification["event_rules"],
) => {
  const hasIncludedSmartlistsFiltering =
    eventRules.smartlist_include?.length > 0;
  const hasExcludedSmartlistsFiltering =
    eventRules.smartlist_exclude?.length > 0;

  return {
    excludedSmartlists: eventRules.smartlist_exclude,
    includedSmartlists: eventRules.smartlist_include,
    toggleExcludedSmartlists: hasExcludedSmartlistsFiltering,
    toggleIncludedSmartlists: hasIncludedSmartlistsFiltering,
  };
};
