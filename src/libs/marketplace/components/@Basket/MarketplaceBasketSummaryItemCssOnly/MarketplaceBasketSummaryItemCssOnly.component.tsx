import React from 'react';
import classNames from 'classnames';
import { BUYABLE_ITEM_COUPON } from '@bsport/common/lib/master-data/buyable-items';
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
  dense?: boolean;
};

export const MarketplaceBasketSummaryItemCssOnly: React.FC<Props> = ({
  checkoutItem,
  isExcludingTax,
  isItemEditionDisabled,
  onAddOneItem,
  onRemoveItem,
  dense,
}) => {
  // Giftcards require additionnal information when being purchase thus,
  // we disable the possibility for them to be mutliplied.
  const isAddingItemPossible =
    !checkoutItem.sub_items?.length &&
    ![
      BuyableItemOptions.BUYABLE_ITEM_GIFTCARD,
      BuyableItemOptions.BUYABLE_ITEM_CREDIT,
      BuyableItemOptions.BUYABLE_ITEM_COUPON,
      BuyableItemOptions.BUYABLE_ITEM_FEE,
    ].includes(checkoutItem.buyable_item_identifier);

  const checkoutItemDisplayPrice = getCurrencyDisplayWithPrice(
    checkoutItem.unit_price * checkoutItem.quantity,
    isExcludingTax,
    checkoutItem.tax,
  );

  const isReferralItem =
    checkoutItem.buyable_item_identifier === BUYABLE_ITEM_COUPON;

  const handleAddOneItem = React.useCallback(() => {
    if (onAddOneItem) onAddOneItem(checkoutItem);
  }, [checkoutItem, onAddOneItem]);

  const onRemoveOneItem = React.useCallback(() => {
    if (onRemoveItem) onRemoveItem(checkoutItem);
  }, [checkoutItem, onRemoveItem]);

  return (
    <div
      className={classNames(
        isReferralItem
          ? 'bs-basket_summary_referral_checkout_item--container'
          : 'bs-basket_summary_checkout_item--container',
        {
          'bs-basket_summary_checkout_item--dense': dense,
        },
      )}
    >
      <div className="bs-basket_summary_checkout_item--title_container ">
        <p
          className={classNames('bs-basket_summary_checkout_item--title', {
            'bs-basket_summary_checkout_item--title_dense': dense,
          })}
        >
          {checkoutItem.name}
        </p>
      </div>
      <div className="bs-basket_summary_checkout_item--quantity_and_price_container">
        {!isReferralItem && (
          <ItemQuantity
            isAddingItemPossible={isAddingItemPossible}
            isItemEditionDisabled={isItemEditionDisabled}
            itemQuantity={checkoutItem.quantity}
            onAddOneItem={handleAddOneItem}
            onRemoveOneItem={onRemoveOneItem}
          />
        )}
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
