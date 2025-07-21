import { useTranslation } from 'react-i18next';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { SubscriptionInterval } from '#src/libs/subscription/types';

/**
 * Generates a subscription label with price and recurrence information.
 *
 * @param recurrenceBasis The number of times the subscription recurs.
 * @param price The price of the subscription as a string.
 * @param subscriptionInterval The interval of the subscription (e.g., "month", "year").
 * @returns An object with formatted price and interval information for the subscription label.
 */
const useConsumerSubscriptionRecurrenceLabel = (
  recurrenceBasis: number,
  price: string,
  subscriptionInterval: SubscriptionInterval,
) => {
  const { t } = useTranslation(['subscription', 'consumerSpace']);
  return recurrenceBasis === 1
    ? {
        price: getCurrencyDisplayWithPrice(price),
        interval: t(
          'consumerSpace:reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelPer',
          {
            interval: t(
              `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
              { count: recurrenceBasis },
            ),
          },
        ),
      }
    : {
        price: getCurrencyDisplayWithPrice(price),
        interval: t(
          'consumerSpace:reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelEvery',
          {
            interval: t(
              `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
              { count: recurrenceBasis },
            ),
            recurrence: recurrenceBasis,
          },
        ),
      };
};
export default useConsumerSubscriptionRecurrenceLabel;
