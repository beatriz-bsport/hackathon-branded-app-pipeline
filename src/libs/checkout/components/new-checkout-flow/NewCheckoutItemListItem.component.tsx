import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  BuyableItemOptions,
  CheckoutItem,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';
import { ItemQuantity } from './ItemQuantity.component';

type NewCheckoutItemListItemProps = {
  checkoutItem: CheckoutItem;
  checkoutItemPrice: string;
  isItemEditionDisabled: boolean;
  onAddOneItem: (checkoutItem: CheckoutItem) => void;
  onRemoveItem: (onRemoveItemdata: OnRemoveCheckoutItemData) => void;
  noPriceBackground?: boolean;
};

export const NewCheckoutItemListItem: React.FC<
  NewCheckoutItemListItemProps
> = ({
  checkoutItem,
  checkoutItemPrice,
  isItemEditionDisabled,
  onAddOneItem,
  onRemoveItem,
  noPriceBackground,
}) => {
  const classes = useStyles({ noPriceBackground });

  // Cannot increase quantity for giftcard checkout items, because each giftcard item requires
  // information about the recipient
  const isAddingItemPossible =
    !checkoutItem.sub_items?.length &&
    checkoutItem.buyable_item_identifier !==
      BuyableItemOptions.BUYABLE_ITEM_GIFTCARD;

  const handleAddOneItem = React.useCallback(() => {
    onAddOneItem(checkoutItem);
  }, [checkoutItem, onAddOneItem]);

  const onDeleteCheckoutItem = React.useCallback(() => {
    if (onRemoveItem)
      onRemoveItem({
        checkout_item: checkoutItem.id,
        quantity: checkoutItem.quantity,
      });
  }, [checkoutItem.id, checkoutItem.quantity, onRemoveItem]);

  const onRemoveOneItem = React.useCallback(() => {
    if (onRemoveItem)
      onRemoveItem({
        checkout_item: checkoutItem.id,
        quantity: 1,
      });
  }, [checkoutItem.id, onRemoveItem]);

  return (
    <div className={classes.checkoutItemContainer}>
      <div className={classes.subContainer}>
        <Typography className={classes.checkoutItemName} variant="subtitle2">
          {checkoutItem.name}
        </Typography>
        {!!onDeleteCheckoutItem && (
          <IconButton
            className={classes.removeIconButton}
            disabled={isItemEditionDisabled}
            onClick={onDeleteCheckoutItem}
          >
            <DeleteIcon className={classes.deleteIcon} />
          </IconButton>
        )}
      </div>
      <div className={classes.subContainer}>
        <ItemQuantity
          isAddingItemPossible={isAddingItemPossible}
          isItemEditionDisabled={isItemEditionDisabled}
          itemQuantity={checkoutItem.quantity}
          onAddOneItem={handleAddOneItem}
          onRemoveOneItem={onRemoveOneItem}
        />
        <Typography
          className={classes.checkoutItemPriceClass}
          variant="subtitle2"
        >
          {checkoutItemPrice}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles<Theme, { noPriceBackground?: boolean }>(
  (theme) => ({
    checkoutItemContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: theme.spacing(1),
      gap: theme.spacing(1),
    },
    checkoutItemName: { fontWeight: 500 },
    checkoutItemPriceClass: {
      fontWeight: 500,
      backgroundColor: ({ noPriceBackground }) =>
        noPriceBackground ? 'unset' : theme.palette.grey[100],
      borderRadius: theme.spacing(1),
      padding: `2px ${theme.spacing(1)}px 2px ${theme.spacing(1)}px`,
    },
    deleteIcon: { color: theme.palette.grey[600] },
    subContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    removeIconButton: { padding: '0' },
  }),
);

export default React.memo(NewCheckoutItemListItem);
