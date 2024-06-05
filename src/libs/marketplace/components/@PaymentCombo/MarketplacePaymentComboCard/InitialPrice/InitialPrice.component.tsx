import React from 'react';

import Price from '#src/components/css-only/Price';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { PaymentCombo } from '#src/libs/payment-combo/types';

import './styles.css';

export type Props = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
};

export const InitialPrice: React.FC<Props> = ({
  paymentCombo,
  isExcludingTax,
}) => {
  const totalPricePaymentPacks =
    paymentCombo?.payment_packs?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0,
    ) ?? 0;
  const totalPricePrivatePasses =
    paymentCombo?.private_passes?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0,
    ) ?? 0;
  const totalPriceShopItems =
    paymentCombo?.shop_items?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0,
    ) ?? 0;
  const sumOfPackItemsPrices =
    totalPricePaymentPacks + totalPricePrivatePasses + totalPriceShopItems;

  return (
    <>
      {sumOfPackItemsPrices > paymentCombo?.price && (
        <Price
          amount={sumOfPackItemsPrices}
          classes={{ 'bs-initial-price__price': 'bs-initial-price__price' }}
          formatPriceWithCurrency={getCurrencyDisplayWithPrice}
          isExcludingTax={isExcludingTax}
          tax={paymentCombo.tax}
        />
      )}
    </>
  );
};
export default React.memo(InitialPrice);
