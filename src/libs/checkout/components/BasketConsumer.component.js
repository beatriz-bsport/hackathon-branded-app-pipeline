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
      <Typography variant="h4" className={props.classes.title}>
        {props.t('myBasket.title')}
      </Typography>
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
      <div className={props.classes.totalPrice}>
        <Typography component="p" variant="h4">
          {`${props.basket.total_price} €`}
        </Typography>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  totalPrice: {
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    backgroundColor: '#eee',
    borderRadius: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredAndPadded: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  title: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['checkout']),
)(BasketConsumer);
