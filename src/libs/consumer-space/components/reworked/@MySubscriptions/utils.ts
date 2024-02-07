import type { TFunction } from 'i18next';
import type {
  SubscriptionInterval,
  SubscriptionREST,
} from '#libs/subscription/types';

import { getCurrencyDisplay } from '#libs/theme/selectors';
import { SubscriptionTabEnum } from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';
import { formatAsDatetimeAdapted } from '../../../../../utils/datetime';

import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';

export const getSubscriptionRecurrenceLabel = (
  recurrence: number,
  price: string,
  t: TFunction,
  subscriptionInterval: SubscriptionInterval,
) =>
  recurrence === 1
    ? t(
        'reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelPer',
        {
          price,
          currency: getCurrencyDisplay(),
          interval: subscriptionInterval,
        },
      )
    : t(
        'reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelEvery',
        {
          price,
          currency: getCurrencyDisplay(),
          interval: subscriptionInterval,
          recurrence,
        },
      );

export const getSubtitleCardDetailsDate = (
  selectedTab: SubscriptionTab,
  selectedSubscription: SubscriptionREST,
  t: TFunction,
) => {
  switch (selectedTab) {
    case SubscriptionTabEnum.ACTIVE:
      return `${t('reworked.mySubscriptions.dateLabel.active', {
        date: formatAsDatetimeAdapted(
          selectedSubscription?.first_billing_date,
          'L',
        ),
      })}${
        selectedSubscription?.auto_renewal
          ? ''
          : t('reworked.mySubscriptions.dateLabel.until', {
              date: formatAsDatetimeAdapted(
                selectedSubscription?.expiration_date,
                'L',
              ),
            })
      }`;
    case SubscriptionTabEnum.FUTURE:
      return `${t('reworked.mySubscriptions.dateLabel.future', {
        date: formatAsDatetimeAdapted(
          selectedSubscription?.first_billing_date,
          'L',
        ),
      })} ${
        selectedSubscription?.auto_renewal
          ? ''
          : t('reworked.mySubscriptions.dateLabel.until', {
              date: formatAsDatetimeAdapted(
                selectedSubscription?.expiration_date,
                'L',
              ),
            })
      }`;
    case SubscriptionTabEnum.EXPIRED:
      return t('reworked.mySubscriptions.dateLabel.expired', {
        date: formatAsDatetimeAdapted(
          selectedSubscription?.expiration_date,
          'L',
        ),
      });
    default:
      return '';
  }
};

export const getSubtitleCardDate = (
  selectedTab: SubscriptionTab,
  subscription: SubscriptionREST,
  t: TFunction,
) => {
  switch (selectedTab) {
    case SubscriptionTabEnum.ACTIVE:
      return t('reworked.mySubscriptions.dateLabel.active', {
        date: formatAsDatetimeAdapted(subscription?.first_billing_date, 'L'),
      });
    case SubscriptionTabEnum.FUTURE:
      return t('reworked.mySubscriptions.dateLabel.future', {
        date: formatAsDatetimeAdapted(subscription?.first_billing_date, 'L'),
      });
    case SubscriptionTabEnum.EXPIRED:
      return t('reworked.mySubscriptions.dateLabel.expired', {
        date: formatAsDatetimeAdapted(subscription?.expiration_date, 'L'),
      });
    default:
      return '';
  }
};
