// @flow

import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { Basket } from '../types';
import BasketConsumer from './BasketConsumer.component';

import BasketFinalizer from './BasketFinalizer.component';
import ShopItemFeaturedBanner from './ShopItemFeaturedBanner.component';

type Props = {
  basket: Basket,
  loading: boolean,
  processing: boolean,
  termsAndConditions: string,

  shopItemList: Array<ShopItem>,
  addShopItemToBasket: (id: number) => void,

  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,

  onBasketFinalized: () => void,
  submitPayment: (data: *) => void,
  attachCoupon: (code: string) => void,
  patchBasket: (data: *) => void,

  backToCalendar: () => void,

  classes: Object,
  t: TFunction,
};

export const CheckoutFlow = (props: Props) => (
  <div className={props.classes.container}>
    <Typography variant="h4" className={props.classes.title}>
      {props.t('myBasket.title')}
    </Typography>
    <Paper square>
      <BasketConsumer
        basket={props.basket}
        loading={props.loading}
        onRemoveCheckoutItem={(data) =>
          props.removeItemFromBasket(props.basket.id, data)
        }
        onAddCheckoutItem={(data) =>
          props.addItemToBasket(props.basket.id, data)
        }
      />
    </Paper>
    {props.shopItemList.length ? (
      <div className={props.classes.featureBanner}>
        <ShopItemFeaturedBanner
          onAddShopItem={props.addShopItemToBasket}
          shopItemList={props.shopItemList}
        />
      </div>
    ) : null}
    {props.basket.checkout_items.length ? (
      <Paper square className={props.classes.paper}>
        <BasketFinalizer
          withPrice
          basket={props.basket}
          submitPayment={props.submitPayment}
          attachCoupon={props.attachCoupon}
          availablePaymentMethods={props.basket.available_payment_methods}
          onBasketFinalized={props.onBasketFinalized}
          patchBasket={props.patchBasket}
          processing={props.processing}
          loading={props.loading}
          termsAndConditions={props.termsAndConditions}
          backToCalendar={props.backToCalendar}
        />
      </Paper>
    ) : null}
  </div>
);

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    minWidth: '40vw',
    maxWidth: '700px',
  },
  title: {
    padding: theme.spacing(2),
    paddingLeft: 0,
  },
  featureBanner: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    maxWidth: '90vw',
  },
  paper: {
    padding: theme.spacing(2),
  },
});
export default compose(
  withTranslation(['checkout']),
  withStyles(styles),
)(CheckoutFlow);
