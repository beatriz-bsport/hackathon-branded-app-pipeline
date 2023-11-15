import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { computeProrataPriceForSubscription } from '#libs/subscription/utils';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { Contract } from '#libs/subscription/types';
import { getPrice, getTaxPrice } from '#libs/theme/utils';

import '../styles.css';

export type Props = {
  contract: Contract;
  billingStartDate: string;
  isExcludingTax?: boolean;
  voucher: number | null;
};

const MarketplaceContractPaymentPricing: React.FC<Props> = React.memo(
  ({ contract, billingStartDate, isExcludingTax, voucher }) => {
    const { t } = useTranslation('checkout');

    const getPriceDisplay = useCallback(() => {
      if (contract?.month_billing_day) {
        const firstInvoiceProrataPrice = computeProrataPriceForSubscription(
          billingStartDate,
          contract?.month_billing_day,
          (contract?.recurrent_price ?? 0).toString(),
        );
        return parseFloat(
          Math.max(
            parseFloat(firstInvoiceProrataPrice) - (voucher || 0),
            0,
          ).toString(),
        ).toFixed(2);
      }
      return parseFloat(
        (parseFloat(contract.recurrent_price) - (voucher || 0)).toString(),
      ).toFixed(2);
    }, [
      contract?.month_billing_day,
      contract?.recurrent_price,
      billingStartDate,
      voucher,
    ]);

    const contractPriceExcludingTax = useMemo(
      () =>
        getCurrencyDisplayWithPrice(
          getPrice(getPriceDisplay(), true, contract.tax),
        ),
      [contract.tax, getPriceDisplay],
    );

    const contractFlatFee = useMemo(
      () =>
        getCurrencyDisplayWithPrice(
          getPrice(contract.flat_fee, true, contract.tax),
        ),
      [contract.flat_fee, contract.tax],
    );

    const contractTaxPrice = useMemo(() => {
      return getCurrencyDisplayWithPrice(
        parseFloat(getTaxPrice(getPriceDisplay(), contract.tax).toString()) +
          parseFloat(getTaxPrice(contract.flat_fee, contract.tax).toString()),
      );
    }, [contract.flat_fee, contract.tax, getPriceDisplay]);

    const shouldDisplayFlatFee =
      !!contract?.flat_fee && parseFloat(contract?.flat_fee) > 0;

    return (
      <>
        <div className="bs-contract-payment__pricing">
          <div className="bs-contract-payment__price__tax__container">
            {isExcludingTax && (
              <div className="bs-contract-payment__tax__container">
                <div className="bs-contract-payment__tax__info__row">
                  <span className="bs-contract-payment__tax__info__row__title">
                    {t('checkout:payment.taxExcluded')}
                  </span>
                  <span className="bs-contract-payment__tax__info__row__price">
                    {contractPriceExcludingTax}
                  </span>
                </div>
                {shouldDisplayFlatFee && (
                  <div className="bs-contract-payment__tax__info__row">
                    <span className="bs-contract-payment__tax__info__row__title">
                      {t('checkout:payment.flat_fee')}
                    </span>
                    <span className="bs-contract-payment__tax__info__row__price">
                      {contractFlatFee}
                    </span>
                  </div>
                )}
                <div className="bs-contract-payment__tax__info__row">
                  <span className="bs-contract-payment__tax__info__row__title">
                    {t('checkout:payment.tax')}
                  </span>
                  <span className="bs-contract-payment__tax__info__row__price">
                    {contractTaxPrice}
                  </span>
                </div>
                <span className="bs-contract-payment__tax__total">
                  {t('checkout:payment.total')}
                </span>
              </div>
            )}

            <div className="bs-contract-payment__price__container">
              <span className="bs-contract-payment__price">
                {getCurrencyDisplayWithPrice(getPriceDisplay())}
              </span>
              {shouldDisplayFlatFee && (
                <span className="bs-contract-payment__price_fee">
                  {`+${getCurrencyDisplayWithPrice(
                    parseFloat((contract?.flat_fee ?? 0).toString()).toFixed(2),
                  )}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },
);

export const MarketplaceContractPaymentPricingForStorybook =
  marketplaceCssHoc()(MarketplaceContractPaymentPricing);

export default MarketplaceContractPaymentPricing;
