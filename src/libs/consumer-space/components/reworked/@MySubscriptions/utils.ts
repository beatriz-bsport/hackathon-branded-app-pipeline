import type { TFunction } from 'i18next';
import type { SubscriptionInterval } from '#libs/subscription/types';
import { getCurrencyDisplay } from '#libs/theme/selectors';

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
