// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PaymentByPaymentIntent from '../../libs/payment/components/PaymentByPaymentIntent.component';
import { attachPaymentToBasketId as attachPaymentAction } from '../../libs/checkout/actions';

type Props = {
  t: TFunction,
  classes: Object,
  basketError: any,
  submitPaymentIntent: (data: any, option: OptionCallback) => void,
};

export const BasketPaymentIntent = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <PaymentByPaymentIntent
        hideCancelButton
        customPayStyle={{ padding: 12, width: '100%' }}
        customContainerStyle={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          flexDirection: 'column',
          height: '100%',
        }}
        submitPaymentIntent={props.submitPaymentIntent}
      />
      {props.basketError &&
        props.basketError.response &&
        props.basketError.response.status === 423 && (
          <Typography color="error">
            {props.t('myBasket.error.invalidBasket')}
          </Typography>
        )}
    </div>
  );
};

const styles = () => ({
  container: {
    width: '100%',
    height: '100vh',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
  routerParamsToProps({ basketId: 'basketId' }),
  withState('basketError', 'setBasketError', null),
  connect(
    null,
    { attachPayment: attachPaymentAction },
  ),
  withProps(({ attachPayment, setBasketError, basketId }) => ({
    submitPaymentIntent: (data, options) =>
      attachPayment(data, basketId, {
        onSuccess: (response) => {
          if (options && options.onSuccess) options.onSuccess(response);
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        },
        onError: (error) => {
          setBasketError(error);
          if (options && options.onError) options.onError(error);
        },
      }),
  })),
)(BasketPaymentIntent);
