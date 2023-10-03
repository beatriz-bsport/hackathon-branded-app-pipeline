import React from 'react';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ItemQuantity from '#libs/marketplace/components/@Basket/MarketplaceBasketSummaryItemCssOnly/ItemQuantity';
import { BuyableItemOptions, CheckoutItem } from '#libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import './styles.css';

export type Props = {
  checkoutItem: CheckoutItem;
  isExcludingTax: boolean;
  isItemEditionDisabled: boolean;
  onAddOneItem: (checkoutItem: CheckoutItem) => void;
  onRemoveItem: (checkoutItem: CheckoutItem) => void;
};

export const MarketplaceBasketSummaryItemCssOnly: React.FC<Props> = ({
  checkoutItem,
  isExcludingTax,
  isItemEditionDisabled,
  onAddOneItem,
  onRemoveItem,
}) => {
  // Giftcards require additionnal information when being purchase thus,
  // we disable the possibility for them to be mutliplied.
  const isAddingItemPossible =
    !checkoutItem.sub_items?.length &&
    checkoutItem.buyable_item_identifier !==
      BuyableItemOptions.BUYABLE_ITEM_GIFTCARD;

  const checkoutItemDisplayPrice = getCurrencyDisplayWithPrice(
    checkoutItem.unit_price * checkoutItem.quantity,
    isExcludingTax,
    checkoutItem.tax,
  );

  const handleAddOneItem = React.useCallback(() => {
    if (onAddOneItem) onAddOneItem(checkoutItem);
  }, [checkoutItem, onAddOneItem]);

  const onRemoveOneItem = React.useCallback(() => {
    if (onRemoveItem) onRemoveItem(checkoutItem);
  }, [checkoutItem, onRemoveItem]);

  return (
    <div className="bs-basket_summary_checkout_item--container">
      <div className="bs-basket_summary_checkout_item--title_container ">
        <p className="bs-basket_summary_checkout_item--title">
          {checkoutItem.name}
        </p>
      </div>
      <div className="bs-basket_summary_checkout_item--quantity_and_price_container">
        <ItemQuantity
          isAddingItemPossible={isAddingItemPossible}
          isItemEditionDisabled={isItemEditionDisabled}
          itemQuantity={checkoutItem.quantity}
          onAddOneItem={handleAddOneItem}
          onRemoveOneItem={onRemoveOneItem}
        />
        <p className="bs-basket_summary_checkout_item--price">
          {checkoutItemDisplayPrice}
        </p>
      </div>
    </div>
  );
};

export const MarketplaceBasketSummaryItemCssOnlyForStoryBook =
  marketplaceCssHoc()(MarketplaceBasketSummaryItemCssOnly);
export default React.memo(MarketplaceBasketSummaryItemCssOnly);
