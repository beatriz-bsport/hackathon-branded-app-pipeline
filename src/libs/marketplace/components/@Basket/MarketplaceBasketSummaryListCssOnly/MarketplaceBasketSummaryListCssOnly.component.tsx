import React from 'react';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MarketplaceBasketSummaryItemCssOnly from '#libs/marketplace/components/@Basket/MarketplaceBasketSummaryItemCssOnly';
import type { CheckoutItem } from '#libs/checkout/types';
import './styles.css';

export type Props = {
  checkoutItems: CheckoutItem[];
  isExcludingTax?: boolean;
  isItemEditionDisabled: boolean;
  onAddCheckoutItem: (checkoutItem: CheckoutItem) => void;
  onRemoveCheckoutItem: (checkoutItem: CheckoutItem) => void;
};

export const MarketplaceBasketSummaryListItemCssOnly: React.FC<Props> = ({
  checkoutItems,
  isExcludingTax,
  isItemEditionDisabled,
  onAddCheckoutItem,
  onRemoveCheckoutItem,
}) => {
  return (
    <>
      {!!checkoutItems?.length && (
        <div className="bs-basket_summary_checkout_list--container">
          {checkoutItems?.map((checkoutItem, index) => (
            <>
              <MarketplaceBasketSummaryItemCssOnly
                key={`checkout-item-${checkoutItem.id}`}
                checkoutItem={checkoutItem}
                isExcludingTax={isExcludingTax}
                isItemEditionDisabled={isItemEditionDisabled}
                onAddOneItem={onAddCheckoutItem}
                onRemoveItem={onRemoveCheckoutItem}
              />
              {index !== checkoutItems.length - 1 && (
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
