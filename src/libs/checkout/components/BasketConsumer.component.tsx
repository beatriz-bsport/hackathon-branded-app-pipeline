// @ts-nocheck
import React from 'react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { OptionCallback } from '../../../state/types';

import CheckoutItemListItem from './CheckoutItemListItem.component';
import PrepaidLineListItem from './PrepaidLineListItem.component';

import { CheckoutItem, Basket, CheckoutItemData, PrepaidLine } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { getBasketTotalPriceExcludingTax } from '../utils';
import Analytics from '#components/analytics/Analytics.component';

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
  onAddCheckoutItem: (data: CheckoutItemData, options?: OptionCallback) => void;
  withPrice?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onItemExpire: (item: CheckoutItem) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  isExcludingTax?: boolean;
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
    ? getBasketTotalPriceExcludingTax(props.basket)
    : props.basket.total_price;

  const trackOnAddingOne = (ci: CheckoutItem) => {
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
  };

  return (
    <div className={props.fullWidth === true ? classes.fullWidth : ''}>
      {props.loading ? <LinearProgress /> : null}
      <List dense disablePadding>
        {props.basket.checkout_items.length ? (
          <>
            {props.basket.checkout_items.map((ci) => (
              <CheckoutItemListItem
                isExcludingTax={props.isExcludingTax}
                checkout_item={ci}
                key={ci.id}
                loading={props.loading}
                onRemoveOne={
                  props.onRemoveCheckoutItem
                    ? () =>
                        props.onRemoveCheckoutItem({
                          checkout_item: ci.id,
                          quantity: 1,
                        })
                    : null
                }
                onAddOne={() => {
                  props.onAddCheckoutItem(
                    {
                      quantity: 1,
                      buyable_item_identifier: ci.buyable_item_identifier,
                      buyable_item_id: ci.buyable_item_id,
                      extra_data: null,
                    },
                    { onSuccess: () => trackOnAddingOne(ci) },
                  );
                }}
                onItemExpire={props.onItemExpire}
              />
            ))}
            {props.basket.prepaid_lines.map((pl) => (
              <PrepaidLineListItem
                divider
                prepaid_line={pl}
                key={pl.id}
                onRemove={props.onRemoveInternalAccountPrepaidLine}
              />
            ))}
          </>
        ) : (
          <div className={classes.centeredAndPadded}>
            <Typography color="textSecondary" align="center">
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
