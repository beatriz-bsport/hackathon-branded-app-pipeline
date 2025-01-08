import type { TFunction } from 'i18next';
import type {
  SubscriptionInterval,
  SubscriptionREST,
} from '#src/libs/subscription/types';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import {
  LIST_ITEM_HEIGHT,
  SubscriptionFilterEnum,
  SubscriptionStatusEnum,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import { formatAsDate } from '#src/utils/datetime';

export const getSubscriptionRecurrenceLabel = (
  recurrenceBasis: number,
  price: string,
  t: TFunction,
  subscriptionInterval: SubscriptionInterval,
) =>
  recurrenceBasis === 1
    ? t(
        'reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelPer',
        {
          price: getCurrencyDisplayWithPrice(price),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrenceBasis },
          ),
        },
      )
    : t(
        'reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelEvery',
        {
          price: getCurrencyDisplayWithPrice(price),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrenceBasis },
          ),
          recurrenceBasis,
        },
      );

export const getSubtitleCardDetailsDate = (
  selectedFilter: SubscriptionFilter,
  selectedSubscription: SubscriptionREST,
  t: TFunction,
) => {
  const shouldDisplayExpirationDate =
    !selectedSubscription?.auto_renewal ||
    selectedSubscription?.status === SubscriptionStatusEnum.STOPPED;

  switch (selectedFilter) {
    case SubscriptionFilterEnum.ACTIVE:
      return `${t('reworked.mySubscriptions.dateLabel.active', {
        date: formatAsDate(selectedSubscription?.first_billing_date),
      })}${
        shouldDisplayExpirationDate
          ? t('reworked.mySubscriptions.dateLabel.until', {
              date: formatAsDate(selectedSubscription?.expiration_date),
            })
          : ''
      }`;
    case SubscriptionFilterEnum.FUTURE:
      return `${t('reworked.mySubscriptions.dateLabel.future', {
        date: formatAsDate(selectedSubscription?.first_billing_date),
      })} ${
        shouldDisplayExpirationDate
          ? t('reworked.mySubscriptions.dateLabel.until', {
              date: formatAsDate(selectedSubscription?.expiration_date),
            })
          : ''
      }`;
    case SubscriptionFilterEnum.EXPIRED:
      return t('reworked.mySubscriptions.dateLabel.expired', {
        date: formatAsDate(selectedSubscription?.expiration_date),
      });
    default:
      return '';
  }
};

export const getSubtitleCardDate = (
  selectedFilter: SubscriptionFilter,
  subscription: SubscriptionREST,
  t: TFunction,
) => {
  switch (selectedFilter) {
    case SubscriptionFilterEnum.ACTIVE:
      return t('reworked.mySubscriptions.dateLabel.active', {
        date: formatAsDate(subscription?.first_billing_date),
      });
    case SubscriptionFilterEnum.FUTURE:
      return t('reworked.mySubscriptions.dateLabel.future', {
        date: formatAsDate(subscription?.first_billing_date),
      });
    case SubscriptionFilterEnum.EXPIRED:
      return t('reworked.mySubscriptions.dateLabel.expired', {
        date: formatAsDate(subscription?.expiration_date),
      });
    default:
      return '';
  }
};

/** For subscription details card, there is no way to know which coupon was applied.
  The only way for now is to check all the conditions below to display what we want
  * @param {string} informationToRetrieve - information to retrieve (usually last_billing_date or recurrent_price)
  * @param {SubscriptionREST} subscription - a subscription

  * @returns {string} informationToRetrieve - information to retrieve (usually last_billing_date or recurrent_price)
  * @returns {null} null if a "all before first renewal" coupon was not applied
  */
export const informationBasedOnCouponApplied = (
  subscription: SubscriptionREST,
  informationToRetrieve: string,
) => {
  if (!subscription) return null;
  return !subscription.has_been_renewed &&
    subscription.auto_renewal &&
    parseFloat(subscription.voucher) === 0 &&
    subscription.recurrent_price !==
      (subscription.price_to_display_cts / 100).toFixed(2)
    ? informationToRetrieve
    : null;
};
/** If a "all before first renewal" coupon was applied, we display some informations */
export const getSubscriptionTextBasedOnCouponApplied = (
  lastInvoiceDateBeforeRenewal: string,
  recurrenceBasis: number,
  recurrentPrice: string,
  subscriptionInterval: SubscriptionInterval,
  t: TFunction,
) => {
  if (!recurrentPrice && !lastInvoiceDateBeforeRenewal) {
    return '';
  }

  const formattedLastInvoiceDateBeforeRenewal = formatAsDate(
    lastInvoiceDateBeforeRenewal,
  );

  return recurrenceBasis === 1
    ? t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.beforeRenewalContractPricePer',
        {
          price: getCurrencyDisplayWithPrice(recurrentPrice),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrenceBasis },
          ),
          date: formattedLastInvoiceDateBeforeRenewal,
        },
      )
    : t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.beforeRenewalContractPriceEvery',
        {
          price: getCurrencyDisplayWithPrice(recurrentPrice),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrenceBasis },
          ),
          recurrenceBasis,
          date: formattedLastInvoiceDateBeforeRenewal,
        },
      );
};

export const getBillingHistoryHeight = (count: number) => {
  if (count > 0 && count <= 5) return count * LIST_ITEM_HEIGHT - 10;
  return LIST_ITEM_HEIGHT * 5 - 10;
};
