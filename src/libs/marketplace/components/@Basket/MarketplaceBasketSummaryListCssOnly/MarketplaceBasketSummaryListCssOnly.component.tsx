import React from 'react';
import classNames from 'classnames';
import { BUYABLE_ITEM_COUPON } from '@bsport/common/lib/master-data/buyable-items';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MarketplaceBasketSummaryItemCssOnly from '#libs/marketplace/components/@Basket/MarketplaceBasketSummaryItemCssOnly';
import type { CheckoutItem } from '#libs/checkout/types';
import { getIsCheckoutItemApplied } from '#libs/checkout/utils';

import './styles.css';

export type Props = {
  checkoutItems: CheckoutItem[];
  isExcludingTax?: boolean;
  isItemEditionDisabled: boolean;
  onAddCheckoutItem: (checkoutItem: CheckoutItem) => void;
  onRemoveCheckoutItem: (checkoutItem: CheckoutItem) => void;
  dense?: boolean;
};

export const MarketplaceBasketSummaryListItemCssOnly: React.FC<Props> = ({
  checkoutItems,
  isExcludingTax,
  isItemEditionDisabled,
  onAddCheckoutItem,
  onRemoveCheckoutItem,
  dense,
}) => {
  const buyableItemsList = React.useMemo(
    () =>
      checkoutItems?.filter(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier !== BUYABLE_ITEM_COUPON,
      ) ?? [],
    [checkoutItems],
  );

  const discountItemsList = React.useMemo(
    () =>
      checkoutItems?.filter(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_COUPON &&
          getIsCheckoutItemApplied(checkoutItem.extra_data),
      ) ?? [],
    [checkoutItems],
  );

  return (
    <>
      {!!checkoutItems?.length && (
        <div
          className={classNames('bs-basket_summary_checkout_list--container', {
            'bs-basket_summary_checkout_list--dense': dense,
          })}
        >
          {buyableItemsList.map((checkoutItem, index) => (
            <>
              <MarketplaceBasketSummaryItemCssOnly
                key={`checkout-item-${checkoutItem.id}`}
                checkoutItem={checkoutItem}
                dense={dense}
                isExcludingTax={isExcludingTax}
                isItemEditionDisabled={isItemEditionDisabled}
                onAddOneItem={onAddCheckoutItem}
                onRemoveItem={onRemoveCheckoutItem}
              />
              {(index !== buyableItemsList.length - 1 ||
                !!discountItemsList.length) && (
                <div className="bs-basket_summary_checkout_list--divider_container ">
                  <div className="bs-basket_summary_checkout_list--divider" />
                </div>
              )}
            </>
          ))}
          {discountItemsList.map((checkoutItem, index) => (
            <>
              <MarketplaceBasketSummaryItemCssOnly
                key={`checkout-item-${checkoutItem.id}`}
                checkoutItem={checkoutItem}
                dense={dense}
                isExcludingTax={isExcludingTax}
                isItemEditionDisabled={isItemEditionDisabled}
                onAddOneItem={onAddCheckoutItem}
                onRemoveItem={onRemoveCheckoutItem}
              />
              {index !== discountItemsList.length - 1 && (
                <div className="bs-basket_summary_checkout_list--divider_container ">
                  <div className="bs-basket_summary_checkout_list--divider" />
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </>
  );
};

export const MarketplaceBasketSummaryListCssOnlyForStoryBook =
  marketplaceCssHoc()(MarketplaceBasketSummaryListItemCssOnly);

export default React.memo(MarketplaceBasketSummaryListItemCssOnly);
