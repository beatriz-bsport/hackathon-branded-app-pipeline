import React from 'react';
import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { CheckoutItem } from '#src/libs/checkout/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import MinimalPaymentComboCard from '#src/libs/marketplace/components/@PaymentCombo/MinimalPaymentComboCard';

import './styles.css';

export type Props = {
  items: CheckoutItem[];
  paymentComboById: { [key: number]: PaymentCombo };
  isLoading: boolean;
  classes?: { [key: string]: string | boolean };
};

const MarketplaceCheckoutItemsWithPaymentComboList: React.FC<Props> = ({
  items,
  paymentComboById,
  isLoading,
  classes,
}) => {
  if (items && items.length > 0 && !!paymentComboById) {
    return (
      <ul
        className={clsx('bs-checkout-items-with-payment-combo-list', {
          ...classes,
        })}
      >
        {items.map((item) => {
          const paymentCombo = paymentComboById[item.buyable_item_id];
          return (
            <MinimalPaymentComboCard
              key={`minimal-payment-combo-id-${paymentCombo?.id}`}
              isLoading={isLoading}
              paymentCombo={paymentCombo}
            />
          );
        })}
      </ul>
    );
  }
  return null;
};

export const MarketplaceCheckoutItemsWithPaymentComboListForStorybook =
  marketplaceCssHoc()(MarketplaceCheckoutItemsWithPaymentComboList);

export default React.memo(MarketplaceCheckoutItemsWithPaymentComboList);
