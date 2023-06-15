import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { Divider } from '@material-ui/core';
import { OptionCallback } from '../../../../state/types';
import { NewCheckoutItemListItem } from './NewCheckoutItemListItem.component';
import {
  CheckoutItem,
  CheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
// @ts-ignore
import Analytics from '#components/analytics/Analytics.component';

type BasketSummaryProps = {
  basketSummaryCheckoutItems: Array<CheckoutItem>;
  isExcludingTax?: boolean;
  isItemEditionDisabled: boolean;
  onAddCheckoutItem: (
    handleAddCheckoutItemData: CheckoutItemData,
    options: OptionCallback,
  ) => void;
  onRemoveCheckoutItem: (onRemoveItemdata: OnRemoveCheckoutItemData) => void;
};

export const BasketSummary: React.FC<BasketSummaryProps> = ({
  basketSummaryCheckoutItems,
  isExcludingTax,
  isItemEditionDisabled,
  onAddCheckoutItem,
  onRemoveCheckoutItem,
}) => {
  const classes = useStyles();

  const trackOnAddingOne = React.useCallback((ci: CheckoutItem) => {
    const objToTrack = {
      name: ci.name,
      id: ci.buyable_item_id,
      price: Number(ci.unit_price),
    };
    switch (ci.buyable_item_identifier) {
      case BUYABLE_ITEM_PRIVATE_PASS:
        Analytics.addPrivatePassToCart(objToTrack);
        break;
      case BUYABLE_ITEM_SHOP_ITEM:
        Analytics.addShopItemToCart(objToTrack);
        break;
      case BUYABLE_ITEM_COMBO_ITEM:
        Analytics.addPackToCart(objToTrack);
        break;
      case BUYABLE_ITEM_PASS:
        Analytics.addPassToCart(objToTrack, 'payment_pack');
        break;
      default:
        break;
    }
  }, []);

  const onAddOneItem = React.useCallback(
    (checkoutItem: CheckoutItem) => {
      onAddCheckoutItem(
        {
          quantity: 1,
          buyable_item_identifier: checkoutItem.buyable_item_identifier,
          buyable_item_id: checkoutItem.buyable_item_id,
          extra_data: null,
        },
        { onSuccess: () => trackOnAddingOne(checkoutItem) },
      );
    },
    [onAddCheckoutItem, trackOnAddingOne],
  );

  return (
    <>
      {!!basketSummaryCheckoutItems.length && (
        <div className={classes.basketContainer}>
          {basketSummaryCheckoutItems?.map((checkoutItem, index) => (
            <>
              <NewCheckoutItemListItem
                key={`checkout-item-${checkoutItem.id}`}
                checkoutItem={checkoutItem}
                checkoutItemPrice={getCurrencyDisplayWithPrice(
                  checkoutItem.unit_price * checkoutItem.quantity,
                  isExcludingTax,
                  checkoutItem.tax,
                )}
                isItemEditionDisabled={isItemEditionDisabled}
                onAddOneItem={onAddOneItem}
                onRemoveItem={onRemoveCheckoutItem}
              />
              {index !== basketSummaryCheckoutItems.length - 1 && (
                <Divider variant="middle" className={classes.divider} />
              )}
            </>
          ))}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  basketContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.grey[100],
  },
  divider: {
    borderColor: theme.palette.grey[100],
    borderWidth: '1px',
    margin: theme.spacing(1),
  },
}));

export default React.memo(BasketSummary);
