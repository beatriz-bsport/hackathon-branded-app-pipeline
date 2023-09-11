import React from 'react';
import './styles.css';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type { CheckoutItem } from '#libs/checkout/types';
import type { PrivatePass } from '#libs/private-service/types';
import MinimalPrivatePassCard from '#marketplacecomponents/@PrivatePass/MinimalPrivatePassCard';

export type Props = {
  items: CheckoutItem[];
  privatePassById: { [key: number]: PrivatePass };
  isLoading: boolean;
  classes?: { [key: string]: string | boolean };
};

const MarketplaceCheckoutItemsWithPrivatePassList: React.FC<Props> = ({
  items,
  privatePassById,
  isLoading,
  classes,
}) => {
  if (items && items.length > 0 && !!privatePassById) {
    return (
      <ul
        className={classNames('bs-checkout-items-with-private-pass-list', {
          ...classes,
        })}
      >
        {items.map((item) => {
          const privatePass = privatePassById[item.buyable_item_id];
          return (
            <MinimalPrivatePassCard
              key={`minimal-private-pass-card-id-${privatePass?.id}`}
              isLoading={isLoading}
              privatePass={privatePass}
              quantity={item.quantity}
            />
          );
        })}
      </ul>
    );
  }
  return null;
};

export const MarketplaceCheckoutItemsWithPrivatePassListForStorybook =
  marketplaceCssHoc()(MarketplaceCheckoutItemsWithPrivatePassList);

export default React.memo(MarketplaceCheckoutItemsWithPrivatePassList);
