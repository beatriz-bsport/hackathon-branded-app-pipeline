import React from 'react';
import classNames from 'classnames';
import { CheckoutItem } from '#libs/checkout/types';
import MarketplaceProductItem from '../MarketplaceProductItem';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  items: CheckoutItem[];
  classes?: { [key: string]: string | boolean };
  isLoading: boolean;
};

const MarketplaceProductItemList: React.FC<Props> = ({
  items,
  classes,
  isLoading,
}) => {
  if (items && items.length > 0) {
    return (
      <ul
        className={classNames('bs-product-item-list', {
          ...classes,
        })}
      >
        {items.map((item) => {
          return (
            <MarketplaceProductItem
              key={item.id}
              isLoading={isLoading}
              name={item.name}
              price={item.unit_price}
              quantity={item.quantity}
              tax={item.tax}
            />
          );
        })}
      </ul>
    );
  }
  return null;
};

export const MarketplaceProductItemListForStorybook = marketplaceCssHoc()(
  MarketplaceProductItemList,
);

export default React.memo(MarketplaceProductItemList);
