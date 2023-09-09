import React from 'react';
import './styles.css';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { CheckoutItem } from '#libs/checkout/types';
import { PaymentPack } from '#libs/payment-packs/types';
import MinimalPaymentPackCard from '#libs/marketplace/components/MinimalPaymentPackCard';

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
        className={classNames('bs-checkout-items-with-payment-pack-list', {
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
