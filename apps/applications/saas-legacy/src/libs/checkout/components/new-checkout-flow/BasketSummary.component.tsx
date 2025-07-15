import React, { Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  CheckoutItem,
  HandleAddCheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#src/libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { NewCheckoutItemListItem } from './NewCheckoutItemListItem.component';

type BasketSummaryProps = {
  basketSummaryCheckoutItems: Array<CheckoutItem>;
  isExcludingTax?: boolean;
  isItemEditionDisabled: boolean;
  onAddCheckoutItem: (
    handleAddCheckoutItemData: HandleAddCheckoutItemData,
  ) => void;
  onRemoveCheckoutItem: (onRemoveItemdata: OnRemoveCheckoutItemData) => void;
  displayBasketTitle?: boolean;
  noPriceBackground?: boolean;
};

export const BasketSummary: React.FC<BasketSummaryProps> = ({
  basketSummaryCheckoutItems,
  isExcludingTax,
  isItemEditionDisabled,
  onAddCheckoutItem,
  onRemoveCheckoutItem,
  displayBasketTitle = false,
  noPriceBackground,
}) => {
  const classes = useStyles({ displayBasketTitle });
  const { t } = useTranslation('checkout');

  const onAddOneItem = useCallback(
    (checkoutItem: CheckoutItem) => {
      onAddCheckoutItem({
        quantity: 1,
        buyable_item_identifier: checkoutItem.buyable_item_identifier,
        buyable_item_id: checkoutItem.buyable_item_id,
        extra_data: {},
        name: checkoutItem.name,
        price: Number(checkoutItem.unit_price),
      });
    },
    [onAddCheckoutItem],
  );

  return (
    <>
      {displayBasketTitle && (
        <div className={classes.basketTitle}>
          <Typography variant="h6">{t('myBasket.title')}</Typography>
        </div>
      )}

      {!!basketSummaryCheckoutItems.length && (
        <div className={classes.basketContainer}>
          {basketSummaryCheckoutItems.map((checkoutItem, index) => (
            <Fragment key={`checkout-item-${checkoutItem.id}`}>
              <NewCheckoutItemListItem
                checkoutItem={checkoutItem}
                checkoutItemPrice={getCurrencyDisplayWithPrice(
                  checkoutItem.unit_price * checkoutItem.quantity,
                  isExcludingTax,
                  checkoutItem.tax,
                )}
                isItemEditionDisabled={isItemEditionDisabled}
                noPriceBackground={noPriceBackground}
                onAddOneItem={onAddOneItem}
                onRemoveItem={onRemoveCheckoutItem}
              />
              {index !== basketSummaryCheckoutItems.length - 1 && (
                <Divider
                  key={`divider-${checkoutItem.id}`}
                  className={classes.divider}
                  variant="middle"
                />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles<Theme, { displayBasketTitle: boolean }>(
  (theme) => ({
    basketTitle: {
      borderColor: theme.palette.grey[100],
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '12px 12px 0 0',
      borderBottom: 'none',
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    basketContainer: ({ displayBasketTitle }) => ({
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: theme.palette.grey[100],
      ...(displayBasketTitle ? { borderTop: undefined } : {}),
    }),
    divider: {
      borderColor: theme.palette.grey[100],
      borderWidth: '1px',
      margin: theme.spacing(1),
    },
  }),
);

export default React.memo(BasketSummary);
