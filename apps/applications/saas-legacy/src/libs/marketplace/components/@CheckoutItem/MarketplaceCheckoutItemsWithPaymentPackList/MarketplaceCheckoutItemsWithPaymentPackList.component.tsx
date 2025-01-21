import React from 'react';
import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { CheckoutItem } from '#src/libs/checkout/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import MinimalPaymentPackCard from '#src/libs/marketplace/components/@PaymentPack/MinimalPaymentPackCard';

import './styles.css';

export type Props = {
  items: CheckoutItem[];
  paymentPacksById: { [key: number]: PaymentPack };
  isLoading: boolean;
  classes?: { [key: string]: string | boolean };
};

const MarketplaceCheckoutItemsWithPaymentPackList: React.FC<Props> = ({
  items,
  paymentPacksById,
  isLoading,
  classes,
}) => {
  if (items && items.length > 0 && !!paymentPacksById) {
    return (
      <ul
        className={clsx('bs-checkout-items-with-payment-pack-list', {
          ...classes,
        })}
      >
        {items.map((item) => {
          const paymentPack = paymentPacksById[item.buyable_item_id];
          return (
            <MinimalPaymentPackCard
              key={`minimal-payment-pack-id-${paymentPack?.id}`}
              isLoading={isLoading}
              paymentPack={paymentPack}
              quantity={item.quantity}
            />
          );
        })}
      </ul>
    );
  }
  return null;
};

export const MarketplaceCheckoutItemsWithPaymentPackListForStorybook =
  marketplaceCssHoc()(MarketplaceCheckoutItemsWithPaymentPackList);

export default React.memo(MarketplaceCheckoutItemsWithPaymentPackList);
