import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { ContractWithPaymentPack } from '#src/libs/subscription/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { computeProrataPriceForSubscription } from '#src/libs/subscription/utils';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './SubscriptionRecapStyles.css';

export type Props = {
  contract: ContractWithPaymentPack;
  hideCredits: boolean;
  isExcludingTax?: boolean;
};

export const ContractRecap: React.FC<Props> = (props) => {
  const { isExcludingTax, hideCredits } = props;
  const { t } = useTranslation('subscription');

  const {
    name,
    recurrent_price,
    recurrence_basis,
    interval,
    payment_pack,
    private_pass,
    payment_combo,
    tax,
    month_billing_day,
  } = props.contract;

  const getProratedPrice = useCallback(() => {
    const firstInvoiceProrataPrice = computeProrataPriceForSubscription(
      DateTime.now().toISODate(),
      month_billing_day,
      recurrent_price.toString(),
    );
    return parseFloat(firstInvoiceProrataPrice).toFixed(2);
  }, [month_billing_day, recurrent_price]);

  return (
    <div className="bs-subscription-checkout__recap__container">
      <div className="bs-subscription-checkout__recap__name-price">
        <div>{name}</div>
        <div>
          {getCurrencyDisplayWithPrice(recurrent_price, !!isExcludingTax, tax)}
        </div>
      </div>
      <div className="bs-subscription-checkout__recap__content-recurrence">
        <div>
          <ul className="bs-subscription-checkout__recap__content">
            {payment_pack && !hideCredits && (
              <li>
                {payment_pack?.credits === null
                  ? t('newCheckout.subscriptionSummary.unlimited')
                  : t('newCheckout.subscriptionSummary.credit', {
                      count: payment_pack?.credits,
                    })}
              </li>
            )}
            {private_pass && !hideCredits && (
              <li>
                {t('newCheckout.subscriptionSummary.credit', {
                  count: private_pass?.credits,
                })}
              </li>
            )}
            {payment_combo && (
              <li>
                {t('newCheckout.subscriptionSummary.item', {
                  count:
                    (payment_combo?.payment_packs.length || 0) +
                    (payment_combo?.private_passes.length || 0),
                })}
              </li>
            )}
          </ul>
        </div>
        <div>
          {t(`newCheckout.subscriptionSummary.billingInterval.${interval}`, {
            count: recurrence_basis,
          })}
        </div>
      </div>
      <div className="bs-subscription-checkout__recap__start-date">
        {month_billing_day ? (
          <div>
            {t('newCheckout.subscriptionSummary.prorataPriceText', {
              proratedPrice: getCurrencyDisplayWithPrice(
                getProratedPrice(),
                !!isExcludingTax,
                tax,
              ),
              today: DateTime.now().toFormat('D'),
              recurrentPrice: getCurrencyDisplayWithPrice(
                recurrent_price,
                !!isExcludingTax,
                tax,
              ),
              monthBillingDay: month_billing_day,
            })}
          </div>
        ) : (
          <>
            <div className="bs-subscription-checkout__recap__starting">
              {t('newCheckout.subscriptionSummary.startDate')}
            </div>
            <div>{DateTime.now().toFormat('D')}</div>
          </>
        )}
      </div>
    </div>
  );
};

export const SubscriptionRecapForStorybook = marketplaceCssHoc()(ContractRecap);

export default ContractRecap;
