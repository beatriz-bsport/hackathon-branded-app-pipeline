// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation, TFunction } from 'react-i18next';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PaymentByCardStripe from '../../libs/payment/components/payment-backend-stripe-deprecated/PaymentByCard.component';
import { attachPaymentToBasketId as attachPaymentAction } from '../../libs/checkout/actions';
import { fetchPaymentMethodList } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';

type Props = {
  t: TFunction,
  classes: Object,
  basketId: string,
  basketError: any,
  submitPaymentIntent: (data: any, option: OptionCallback) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchPaymentMethodList: (params: any) => void,
};

export class BasketPaymentIntent extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentMethodList({ basket: this.props.basketId });
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <PaymentByCardStripe
          hideCancelButton
          customPayStyle={{ padding: 12, width: '100%' }}
          customContainerStyle={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            flexDirection: 'column',
            height: '100%',
          }}
          submitPaymentIntent={this.props.submitPaymentIntent}
          savedPaymentMethodList={this.props.savedPaymentMethodList}
        />
        {this.props.basketError &&
          this.props.basketError.response &&
          this.props.basketError.response.status === 423 && (
            <Typography color="error">
              {this.props.t('myBasket.error.invalidBasket')}
            </Typography>
          )}
      </div>
    );
  }
}

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
    (state) => ({ savedPaymentMethodList: getSavedPaymentMethodList(state) }),
    { attachPayment: attachPaymentAction, fetchPaymentMethodList },
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
