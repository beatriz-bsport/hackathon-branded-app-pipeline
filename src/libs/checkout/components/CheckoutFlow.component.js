// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import BasketConsumer from './BasketConsumer.component';
import type { Basket } from '../types';

import BasketFinalizer from './BasketFinalizer.component';

type Props = {
  basket: Basket,
  loading: boolean,
  processing: boolean,
  termsAndConditions: string,

  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  onBasketFinalized: () => void,
  submitPayment: (data: *) => void,
  classes: Object,
  patchBasket: (data: *) => void,
  backToCalendar: () => void,
};

export const CheckoutFlow = (props: Props) => (
  <div className={props.classes.container}>
    <BasketConsumer
      basket={props.basket}
      loading={props.loading}
      onRemoveCheckoutItem={(data) =>
        props.removeItemFromBasket(props.basket.id, data)
      }
      onAddCheckoutItem={(data) => props.addItemToBasket(props.basket.id, data)}
    />
    <BasketFinalizer
      basket={props.basket}
      submitPayment={props.submitPayment}
      availablePaymentMethods={props.basket.available_payment_methods}
      onBasketFinalized={props.onBasketFinalized}
      patchBasket={props.patchBasket}
      processing={props.processing}
      termsAndConditions={props.termsAndConditions}
      backToCalendar={props.backToCalendar}
    />
  </div>
);

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    minWidth: '400px',
  },
});
export default withStyles(styles)(CheckoutFlow);
