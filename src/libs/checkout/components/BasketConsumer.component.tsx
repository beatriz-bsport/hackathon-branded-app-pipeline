// @ts-nocheck
import React from 'react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import CheckoutItemListItem from './CheckoutItemListItem.component';
import PrepaidLineListItem from './PrepaidLineListItem.component';

import { CheckoutItem, Basket, CheckoutItemData, PrepaidLine } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { getSubTotal } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
  centeredAndPadded: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  totalPrice: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#eee',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
}));

type Props = {
  basket: Basket<string, PrepaidLine>;
  onRemoveCheckoutItem: ({
    checkout_item,
    quantity,
  }: {
    checkout_item: string;
    quantity: number;
  }) => void;
  onAddCheckoutItem: (data: CheckoutItemData) => void;
  withPrice?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onItemExpire: (item: CheckoutItem) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  isExcludingTax?: boolean;
  basketIsEmpty: boolean;
};

export const BasketConsumer = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['checkout']);
  if (!props.basket) {
    return (
      <div className={classes.centeredAndPadded}>
        <CircularProgress />
      </div>
    );
  }
  const basketTotalPrice = props.isExcludingTax
    ? getSubTotal(props.basket)
    : props.basket.total_price;

  return (
    <div className={props.fullWidth === true ? classes.fullWidth : ''}>
      {props.loading ? <LinearProgress /> : null}
      <List dense disablePadding>
        {!props.basketIsEmpty ? (
          <>
            {props.basket.checkout_items.map((checkoutItem) => (
              <CheckoutItemListItem
                key={checkoutItem.id}
                checkout_item={checkoutItem}
                isExcludingTax={props.isExcludingTax}
                loading={props.loading}
                onAddOne={() => {
                  props.onAddCheckoutItem({
                    quantity: 1,
                    buyable_item_identifier:
                      checkoutItem.buyable_item_identifier,
                    buyable_item_id: checkoutItem.buyable_item_id,
                    extra_data: null,
                    name: checkoutItem.name,
                    price: Number(checkoutItem.unit_price),
                  });
                }}
                onItemExpire={props.onItemExpire}
                onRemoveOne={
                  props.onRemoveCheckoutItem
                    ? () =>
                        props.onRemoveCheckoutItem({
                          checkout_item: checkoutItem.id,
                          quantity: 1,
                        })
                    : null
                }
              />
            ))}
            {props.basket.prepaid_lines.map((pl) => (
              <PrepaidLineListItem
                key={pl.id}
                divider
                onRemove={props.onRemoveInternalAccountPrepaidLine}
                prepaid_line={pl}
              />
            ))}
          </>
        ) : (
          <div className={classes.centeredAndPadded}>
            <Typography align="center" color="textSecondary">
              {t('myBasket.isEmpty')}
            </Typography>
          </div>
        )}
      </List>
      {props.withPrice ? (
        <div className={classes.totalPrice}>
          <Typography component="p" variant="h4">
            {getCurrencyDisplayWithPrice(
              parseFloat(basketTotalPrice.toString()) -
                parseFloat(props.basket.total_price_prepaid_lines.toString()),
            )}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default BasketConsumer;
