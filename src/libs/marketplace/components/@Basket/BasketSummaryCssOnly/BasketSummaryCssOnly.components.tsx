import React from 'react';
import { getBasketTotalPriceExcludingTax } from '#libs/checkout/utils';
import MarketplaceBasketSummaryListCssOnly from '#libs/marketplace/components/@Basket/MarketplaceBasketSummaryListCssOnly';
import MarketplaceBasketSummaryPrepaidLineList from '#libs/marketplace/components/@Basket/MarketplaceBasketSummaryPrepaidLineList';
import CircularProgress from '#components/css-only/CircularProgress';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type {
  CheckoutItem,
  Basket,
  PrepaidLine,
  HandleAddCheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';

import type { OptionCallback } from '../../../../../state/types';

import './styles.css';

export type Props = {
  basket: Basket<string, PrepaidLine>;
  onRemoveCheckoutItem: (
    checkoutItemBeingRemoved: OnRemoveCheckoutItemData,
  ) => void;
  onAddCheckoutItem: (
    data: HandleAddCheckoutItemData,
    options?: OptionCallback,
  ) => void;
  withPrice?: boolean;
  loading?: boolean;
  isExcludingTax?: boolean;
};

export const BasketSummaryCssOnly: React.FC<Props> = ({
  basket,
  isExcludingTax,
  onRemoveCheckoutItem,
  onAddCheckoutItem,
  loading,
}) => {
  const basketTotalPrice = React.useMemo(
    () =>
      isExcludingTax
        ? getBasketTotalPriceExcludingTax(basket)
        : basket?.total_price,
    [isExcludingTax, basket],
  );

  const handleAddOneItem = React.useCallback(
    (checkoutItem: CheckoutItem) => {
      onAddCheckoutItem({
        quantity: 1,
        buyable_item_identifier: checkoutItem.buyable_item_identifier,
        buyable_item_id: checkoutItem.buyable_item_id,
        extra_data: null,
        name: checkoutItem.name,
        price: Number(checkoutItem.unit_price),
      });
    },
    [onAddCheckoutItem],
  );

  const handleRemoveCheckoutItem = React.useCallback(
    (checkoutItem: CheckoutItem) =>
      onRemoveCheckoutItem({ checkout_item: checkoutItem.id, quantity: 1 }),
    [onRemoveCheckoutItem],
  );

  if (!basket) {
    return (
      <div className="bs-basket_summary_loading--container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="bs-basket_summary--container">
      <div className="bs-basket_summary__checkout_item_list--container">
        <MarketplaceBasketSummaryListCssOnly
          checkoutItems={basket.checkout_items}
          isExcludingTax={isExcludingTax}
          isItemEditionDisabled={loading}
          onAddCheckoutItem={handleAddOneItem}
          onRemoveCheckoutItem={handleRemoveCheckoutItem}
        />
      </div>
      {basket.prepaid_lines?.length > 0 && (
        <div className="bs-basket_summary--divider_container ">
          <div className="bs-basket_summary--divider" />
        </div>
      )}
      <div className="bs-basket_summary__prepaid_line_list--container">
        <MarketplaceBasketSummaryPrepaidLineList
          prePaidLines={basket.prepaid_lines}
        />
      </div>
      <div className="bs-basket_summary__total_price--container">
        <p className="bs-basket_summary__total_price--text">
          {getCurrencyDisplayWithPrice(basketTotalPrice)}
        </p>
      </div>
    </div>
  );
};

export default React.memo(BasketSummaryCssOnly);
