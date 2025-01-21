import React from 'react';
import clsx from 'clsx';
import { CheckoutItem } from '#src/libs/checkout/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MarketplaceProductItem from '../MarketplaceProductItem';

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
        className={clsx('bs-product-item-list', {
          ...classes,
        })}
      >
        {items.map((item) => {
          return (
            <MarketplaceProductItem
              key={item.id}
              isLoading={isLoading}
              name={item.name}
              pdfLink={item.extra_data.pdf_link}
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
