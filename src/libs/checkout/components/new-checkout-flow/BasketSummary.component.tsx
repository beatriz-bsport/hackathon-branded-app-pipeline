import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { NewCheckoutItemListItem } from './NewCheckoutItemListItem.component';
import {
  CheckoutItem,
  HandleAddCheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type BasketSummaryProps = {
  basketSummaryCheckoutItems: Array<CheckoutItem>;
  isExcludingTax?: boolean;
  isItemEditionDisabled: boolean;
  onAddCheckoutItem: (
    handleAddCheckoutItemData: HandleAddCheckoutItemData,
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

  const onAddOneItem = React.useCallback(
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
