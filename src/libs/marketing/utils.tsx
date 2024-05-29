import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import { TFunction } from 'i18next';
import memoize from 'memoize-one';
import type { MarketingNotification } from './types';

export const getMergeTags = memoize(
  (tags: { [tag_name: string]: string[] }, t: TFunction) => {
    if (tags) {
      return [
        ...Object.entries(tags).reduce((acc, [tagCategory, tagList]) => {
          acc.push({
            label: t(`notificationRule:tag.${tagCategory}.name`),
            options: [...tagList].map((tag) => ({
              label: t(`notificationRule:tag.${tagCategory}.tags.${tag}`),
              value: `{${tag}}`,
            })),
          });
          return acc;
        }, []),
      ];
    }
    return null;
  },
);

export const isPassNotification = (notification: MarketingNotification) =>
  [
    NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
    NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
    NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
    NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
  ].includes(notification.kind);

export const getSendingTimeNotification = (
  timeComparator: 'before' | 'after',
  periodScale: 'days' | 'hours',
  relativeTimeValue: number,
) => {
  let daysSubmit = 0;
  let hoursSubmit = 0;
  if (periodScale === 'days') {
    daysSubmit = relativeTimeValue;
  } else {
    hoursSubmit = relativeTimeValue;
  }

  if (timeComparator === 'before') {
    daysSubmit *= -1;
    hoursSubmit *= -1;
  }

  return [daysSubmit, hoursSubmit];
};

export const splitPassNotificationsByTrigger = (
  notifications: MarketingNotification[],
) => {
  const remainingCreditNotifications: MarketingNotification[] = [];
  const remainingValidityNotifications: MarketingNotification[] = [];
  const expiredValidityNotifications: MarketingNotification[] = [];

  for (const notification of notifications) {
    switch (notification.kind) {
      case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT:
      case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT:
        remainingCreditNotifications.push(notification);
        break;
      case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME:
      case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME:
        if (notification.event_rules.days_left >= 0) {
          remainingValidityNotifications.push(notification);
        } else {
          expiredValidityNotifications.push(notification);
        }
        break;
      default:
        break;
    }
  }

  return {
    remainingCreditNotifications,
    remainingValidityNotifications,
    expiredValidityNotifications,
  };
};

export const getNotificationDeletionParameters = (
  t: TFunction,
  notification: MarketingNotification,
) => {
  if (!isPassNotification(notification))
    return {
      warningText: t('marketing:notifications.deleteDialogText'),
      buttonActivationDelay: 0,
    };

  const {
    contains_all_payment_packs,
    payment_pack_ids,
    contains_all_private_passes,
    private_pass_ids,
  } = notification.event_rules;

  const hasPassesAttached =
    (contains_all_payment_packs ||
      contains_all_private_passes ||
      payment_pack_ids?.length > 0 ||
      private_pass_ids?.length > 0) ??
    false;

  const text_parts = [];
  text_parts.push(
    t('marketing:notifications.passNotificationDeleteDialog.warning.sure'),
  );

  switch (notification.kind) {
    case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT:
    case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME:
      if (hasPassesAttached) {
        text_parts.push(
          t(
            'marketing:notifications.passNotificationDeleteDialog.warning.attachedPaymentPacks',
          ),
        );
      }
      break;
    case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT:
    case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME:
      if (hasPassesAttached) {
        text_parts.push(
          t(
            'marketing:notifications.passNotificationDeleteDialog.warning.attachedPrivatePasses',
          ),
        );
      }
      break;
    default:
      break;
  }

  text_parts.push(
    t(
      'marketing:notifications.passNotificationDeleteDialog.warning.irreversible',
    ),
  );

  return {
    warningText: text_parts.join(' '),
    buttonActivationDelay: hasPassesAttached ? 3 : 0,
  };
};
