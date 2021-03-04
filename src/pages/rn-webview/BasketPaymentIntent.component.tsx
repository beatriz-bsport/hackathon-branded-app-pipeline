import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation, TFunction } from 'react-i18next';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchBasket as fetchBasketAction,
  attachPaymentToBasketId as attachPaymentAction,
} from '../../libs/checkout/actions';
import { fetchPaymentMethodList } from '../../libs/payment/actions';
import PaymentStripe from '../../libs/payment/components/payment-backend-stripe/PaymentStripe.component';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { getBasket } from '../../libs/checkout/selectors';
import { OptionCallback } from '../../state/types';
import { PaymentMethod } from '../../libs/payment/types';
import { unauthenticatedRequestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';

interface Props {
  t: TFunction;
  classes: Object;
  basketId: string;
  basketError: any;
  submitPaymentIntent: (data: any, option: OptionCallback) => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  fetchPaymentMethodList: (params: any) => void;
}

export class BasketPaymentIntent extends React.Component<Props> {
  state = {
    theme: null,
    clientSecretLoading: true,
  };

  componentDidMount() {
    this.props.fetchBasket(this.props.basketId, {
      onSuccess: (basket) => {
        this.props.fetchCompanyTheme(basket.company, {
          onSuccess: (theme) => this.setState({ theme }),
        });
        if (!basket.is_finalized) {
          this.getSecret();
        }
      },
    });
    this.props.fetchPaymentMethodList({ basket: this.props.basketId });
  }

  getSecret = () => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(PAYMENT_ENGINE_STRIPE, PAYMENT_INTENT_TYPE_BASKET, {
      basket: this.props.basketId,
    })
      .then((r) => {
        this.setState({
          clientSecret: r.data.client_secret,
          clientSecretLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ clientSecretLoading: false });
      });
  };

  onSuccess = () => {
    [0, 1000, 3000, 5000, 8000].forEach((i) =>
      setTimeout(() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        }
        this.props.fetchBasket(this.props.basketId);
      }, i),
    );
  };

  render() {
    if (!this.props.basket || !this.state.theme) {
      return (
        <div className={this.props.classes.container}>
          <div className={this.props.classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (this.props.basket.is_finalized) {
      return (
        <div className={this.props.classes.container}>
          <div className={this.props.classes.loadingContainer}>
            <CheckIcon
              color="primary"
              style={{ height: 128, width: 128 }}
              fontSize="large"
            />
            <Typography>{this.props.t('myBasket.isFinalized')}</Typography>
          </div>
        </div>
      );
    }

    return (
      <div className={this.props.classes.container}>
        <PaymentStripe
          paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
            PAYMENT_ENGINE_STRIPE
          ].filter((pm) =>
            (this.state.theme.payment_method_available || []).includes(pm),
          )}
          clientSecret={this.state.clientSecret}
          clientSecretLoading={this.state.clientSecretLoading}
          termsAndConditionsAccepted
          onSuccess={this.onSuccess}
          memberId={this.props.basket.member}
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

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    overflowY: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
  routerParamsToProps({ basketId: 'basketId' }),
  withState('basketError', 'setBasketError', null),
  connect(
    (state, { basketId }) => ({
      basket: getBasket(state, basketId),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      fetchBasket: fetchBasketAction,
      attachPayment: attachPaymentAction,
      fetchPaymentMethodList,
      fetchCompanyTheme,
    },
  ),
  withProps(({ attachPayment, setBasketError, basketId }) => ({
    submitPaymentIntent: (data: any, options: OptionCallback) =>
      attachPayment(data, basketId, {
        onSuccess: (response: any) => {
          if (options && options.onSuccess) options.onSuccess(response);
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        },
        onError: (error: Error) => {
          setBasketError(error);
          if (options && options.onError) options.onError(error);
        },
      }),
  })),
)(BasketPaymentIntent);
