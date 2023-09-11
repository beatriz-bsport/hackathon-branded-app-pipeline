import React from 'react';
import './styles.css';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { CheckoutItem } from '#libs/checkout/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import MinimalPaymentComboCard from '#marketplacecomponents/@PaymentCombo/MinimalPaymentComboCard';

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
        className={classNames('bs-checkout-items-with-payment-combo-list', {
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
