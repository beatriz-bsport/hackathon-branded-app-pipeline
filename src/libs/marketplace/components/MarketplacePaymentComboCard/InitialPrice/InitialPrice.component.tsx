import React from 'react';

import Price from '#csscomponents/Price';
import './styles.css';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { PaymentCombo } from '#libs/payment-combo/types';

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
          tax={paymentCombo.tax}
          isExcludingTax={isExcludingTax}
          amount={sumOfPackItemsPrices}
          formatPriceWithCurrency={getCurrencyDisplayWithPrice}
          classes={{ 'bs-initial-price__price': 'bs-initial-price__price' }}
        />
      )}
    </>
  );
};
export default React.memo(InitialPrice);
