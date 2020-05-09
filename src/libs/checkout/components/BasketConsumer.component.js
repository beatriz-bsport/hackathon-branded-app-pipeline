// @flow
import React from 'react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import CheckoutItemListItem from './CheckoutItemListItem.component';

import type { Basket, CheckoutItemData } from '../types';

type Props = {
  basket: Basket,
  onRemoveCheckoutItem: ({ checkout_item: string, quantity: number }) => void,
  onAddCheckoutItem: (CheckoutItemData) => void,
  classes: Object,
  withPrice?: boolean,
  t: TFunction,
  loading: ?boolean,
};

export const BasketConsumer = (props: Props) => {
  if (!props.basket) {
    return (
      <div className={props.classes.centeredAndPadded}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div>
      {props.loading ? <LinearProgress /> : null}
      <List dense disablePadding>
        {props.basket.checkout_items.length ? (
          props.basket.checkout_items.map((ci) => (
            <CheckoutItemListItem
              checkout_item={ci}
              key={ci.id}
              onRemoveOne={() =>
                props.onRemoveCheckoutItem({
                  checkout_item: ci.id,
                  quantity: 1,
                })
              }
              onAddOne={() => props.onAddCheckoutItem({ ...ci, quantity: 1 })}
            />
          ))
        ) : (
          <div className={props.classes.centeredAndPadded}>
            <Typography color="textSecondary" align="center">
              {props.t('myBasket.isEmpty')}
            </Typography>
          </div>
        )}
      </List>
      {props.withPrice ? (
        <div className={props.classes.totalPrice}>
          <Typography component="p" variant="h4">
            {`${props.basket.total_price} €`}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

const styles = (theme) => ({
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
});

export default compose(
  withStyles(styles),
  withNamespaces(['checkout']),
)(BasketConsumer);
