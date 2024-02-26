import type { TFunction } from 'i18next';
import type {
  SubscriptionInterval,
  SubscriptionREST,
} from '#libs/subscription/types';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
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
          price: getCurrencyDisplayWithPrice(price),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrence },
          ),
        },
      )
    : t(
        'reworked.mySubscriptions.consumerSubscriptionCard.recurrenceLabelEvery',
        {
          price: getCurrencyDisplayWithPrice(price),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrence },
          ),
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

/** For subscription details card, the mobile version has a different display depending on if its desktop or mobile
   * @param {boolean} isMobile - If the user is on mobile
   * @param {SubscriptionREST} selectedSubscription - When selectedSubscription is defined, display mobile version if one subscription is selected
   * @param {MobileContent} mobileContent - Mobile content to display 
   * @param {DesktopContent} desktopContent - Desktop content to display

   * @returns {MobileContent} mobileContent - Mobile content to display 
   * @returns {DesktopContent} desktopContent - Desktop content to display
   */
export const mobileDetailsDisplay = <MobileContent, DesktopContent>(
  isMobile: boolean,
  selectedSubscription: SubscriptionREST,
  mobileContent: MobileContent,
  desktopContent: DesktopContent,
) => {
  if (isMobile && !!selectedSubscription?.id) {
    return mobileContent;
  }
  return desktopContent;
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
) =>
  subscription &&
  !subscription.has_been_renewed &&
  subscription.auto_renewal &&
  parseFloat(subscription.voucher) !== 0 &&
  subscription.recurrent_price !== subscription.price_to_display_cts
    ? informationToRetrieve
    : null;

/** If a "all before first renewal" coupon was applied, we display some informations */
export const getSubscriptionTextBasedOnCouponApplied = (
  lastInvoiceDateBeforeRenewal: string,
  recurrence: number,
  recurrentPrice: string,
  subscriptionInterval: SubscriptionInterval,
  t: TFunction,
) => {
  if (!recurrentPrice && !lastInvoiceDateBeforeRenewal) {
    return '';
  }

  return recurrence === 1
    ? t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.beforeRenewalContractPricePer',
        {
          price: getCurrencyDisplayWithPrice(recurrentPrice),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrence },
          ),
          date: lastInvoiceDateBeforeRenewal,
        },
      )
    : t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.beforeRenewalContractPriceEvery',
        {
          price: getCurrencyDisplayWithPrice(recurrentPrice),
          interval: t(
            `subscription:contract.form.recurrence_basis.intervalName.${subscriptionInterval}`,
            { count: recurrence },
          ),
          recurrence,
          date: lastInvoiceDateBeforeRenewal,
        },
      );
};
