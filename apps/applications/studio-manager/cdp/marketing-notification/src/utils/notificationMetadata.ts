import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import {
  isMarketingNotificationBookingType,
  isMarketingNotificationPaymentPackCreditsType,
  isMarketingNotificationPaymentPackTimeType,
  isMarketingNotificationPrivateBookingType,
  isMarketingNotificationPrivatePassCreditsType,
  isMarketingNotificationPrivatePassTimeType,
  isMarketingNotificationSubscriptionType,
} from "#src/utils/typesGuards";

/**
 * Extracts meta activity IDs from booking notifications
 */
export const extractMetaActivityIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (isMarketingNotificationBookingType(notification)) {
      const { meta_activity_id } = notification.event_rules;
      if (meta_activity_id) {
        ids.add(meta_activity_id);
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts location IDs from booking notifications
 */
export const extractLocationIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (isMarketingNotificationBookingType(notification)) {
      const { establishment_id } = notification.event_rules;

      if (establishment_id) {
        ids.add(establishment_id);
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts establishment IDs from booking notifications
 */
export const extractEstablishmentIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (isMarketingNotificationBookingType(notification)) {
      const { establishment_group_id } = notification.event_rules;

      if (establishment_group_id) {
        ids.add(establishment_group_id);
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts private service IDs from private booking notifications
 */
export const extractPrivateServiceIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (isMarketingNotificationPrivateBookingType(notification)) {
      const { private_service_id } = notification.event_rules;
      if (private_service_id) {
        ids.add(private_service_id);
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts payment pack IDs from payment pack notifications
 */
export const extractPaymentPackIds = ({
  notifications,
  extractAllPassIds,
}: {
  notifications: MarketingNotification[];
  extractAllPassIds?: boolean;
}): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (
      isMarketingNotificationPaymentPackCreditsType(notification) ||
      isMarketingNotificationPaymentPackTimeType(notification)
    ) {
      const { payment_pack_ids } = notification.event_rules;
      if (Array.isArray(payment_pack_ids) && payment_pack_ids.length > 0) {
        if (extractAllPassIds) {
          payment_pack_ids.forEach((id) => ids.add(id));
        } else {
          ids.add(payment_pack_ids[0]);
        }
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts private pass IDs from private pass notifications
 */
export const extractPrivatePassIds = ({
  notifications,
  extractAllPassIds,
}: {
  notifications: MarketingNotification[];
  extractAllPassIds?: boolean;
}): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (
      isMarketingNotificationPrivatePassCreditsType(notification) ||
      isMarketingNotificationPrivatePassTimeType(notification)
    ) {
      const { private_pass_ids } = notification.event_rules;
      if (Array.isArray(private_pass_ids) && private_pass_ids.length > 0) {
        if (extractAllPassIds) {
          private_pass_ids.forEach((id) => ids.add(id));
        } else {
          ids.add(private_pass_ids[0]);
        }
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts subscription IDs (contract_id) from subscription notifications
 */
export const extractSubscriptionIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    if (isMarketingNotificationSubscriptionType(notification)) {
      const { contract_id } = notification.event_rules;
      if (contract_id) {
        ids.add(contract_id);
      }
    }
  }

  return Array.from(ids);
};

/**
 * Extracts email template IDs (email_design) from notifications
 */
export const extractEmailTemplateIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    const { email_design } = notification;
    if (email_design) {
      ids.add(email_design);
    }
  }

  return Array.from(ids);
};

/**
 * Extracts email template IDs (email_design) from notifications
 */
export const extractSmartlistIds = (
  notifications: MarketingNotification[],
): number[] => {
  const ids = new Set<number>();

  for (const notification of notifications) {
    const { smartlist_exclude, smartlist_include } = notification.event_rules;
    if (Array.isArray(smartlist_include)) {
      smartlist_include.forEach((id) => ids.add(id));
    }
    if (Array.isArray(smartlist_exclude)) {
      smartlist_exclude.forEach((id) => ids.add(id));
    }
  }

  // Set ensures uniqueness, so Array.from(ids) will only have unique values
  return Array.from(ids);
};

/**
 * Extracts all relevant IDs from notifications in one pass
 */
export const extractAllNotificationIds = ({
  notifications,
  extractAllPassIds,
}: {
  notifications: MarketingNotification[];
  extractAllPassIds: boolean;
}) => {
  return {
    locationIds: extractLocationIds(notifications),
    establishmentIds: extractEstablishmentIds(notifications),
    metaActivityIds: extractMetaActivityIds(notifications),
    privateServiceIds: extractPrivateServiceIds(notifications),
    paymentPackIds: extractPaymentPackIds({ notifications, extractAllPassIds }),
    privatePassIds: extractPrivatePassIds({ notifications, extractAllPassIds }),
    subscriptionIds: extractSubscriptionIds(notifications),
    emailTemplateIds: extractEmailTemplateIds(notifications),
    smartlistIds: extractSmartlistIds(notifications),
  };
};
