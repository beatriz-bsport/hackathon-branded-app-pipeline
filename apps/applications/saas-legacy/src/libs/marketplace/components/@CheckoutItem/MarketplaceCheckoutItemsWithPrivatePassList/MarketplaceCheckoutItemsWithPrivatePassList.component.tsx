import React from 'react';
import './styles.css';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import type { CheckoutItem } from '#src/libs/checkout/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import MinimalPrivatePassCard from '#src/libs/marketplace/components/@PrivatePass/MinimalPrivatePassCard';

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
