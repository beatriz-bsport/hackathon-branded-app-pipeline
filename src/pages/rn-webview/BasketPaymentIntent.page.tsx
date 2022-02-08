import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import LinearProgress from '@material-ui/core/LinearProgress';
import type { Theme } from '@material-ui/core/styles';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';

import { withTranslation, WithTranslation } from 'react-i18next';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchBasket as fetchBasketAction,
  attachPaymentToBasketId as attachPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
} from '../../libs/checkout/actions';
import { fetchPaymentMethodList } from '../../libs/payment/actions';
import PaymentStripe from '../../libs/payment/components/payment-backend-stripe/PaymentStripe.component';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { getBasket } from '../../libs/checkout/selectors';
import { OptionCallback } from '../../state/types';
import { PaymentMethod } from '../../libs/payment/types';
import { unauthenticatedRequestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';
import { getUsableCreditAccountBalance } from '#libs/membership/selectors';
import { Basket, PrepaidLine } from '#libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import PrepaidLineListItem from '#libs/checkout/components/PrepaidLineListItem.component';
import type { CompanyTheme } from '#libs/theme/types';
import type { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';

type Props = {
  basket: Basket<number, PrepaidLine>;
  basketId: string;
  basketError: any;
  submitPaymentIntent: (data: any, option: OptionCallback) => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  fetchPaymentMethodList: (params: any) => void;
  useInternalAccount: (amount: number, options: OptionCallback) => void;
  onRemoveInternalAccountPrepaidLine: (options?: OptionCallback) => void;
  creditAccountBalance: number | null;
} & ConnectedProps<typeof connector> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  theme: CompanyTheme | null;
  clientSecretLoading: boolean;
  clientSecret: string | null;
};
export class BasketPaymentIntent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: null,
      clientSecretLoading: true,
      clientSecret: null,
    };
  }

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
        <div className={this.props.classes.totalPrice}>
          <Typography component="p" variant="h4">
            {`${getCurrencyDisplayWithPrice(
              parseFloat(this.props.basket.total_price) -
                parseFloat(this.props.basket.total_price_prepaid_lines),
            )}`}
          </Typography>
        </div>
        {(this.props.loading || this.props.processing) && (
          <LinearProgress color="primary" />
        )}
        {this.props.basket?.prepaid_lines.map((pl) => (
          <PrepaidLineListItem
            divider
            prepaid_line={pl}
            key={pl.id}
            onRemove={this.props.onRemoveInternalAccountPrepaidLine}
          />
        ))}
        <PaymentStripe
          loading={this.props.loading || this.props.processing}
          paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
            PAYMENT_ENGINE_STRIPE
          ].filter((pm) =>
            (this.state.theme.payment_method_available_basket || []).includes(
              pm,
            ),
          )}
          basketTotalPriceCts={this.props.basket.total_price_cts}
          basketTotalPricePrepaidLines={
            this.props.basket.total_price_prepaid_lines
          }
          basketId={this.props.basketId}
          clientSecret={this.state.clientSecret}
          clientSecretLoading={this.state.clientSecretLoading}
          termsAndConditionsAccepted
          onSuccess={this.onSuccess}
          memberId={this.props.basket.member}
          allowConsumerToUseInternalAccount={
            this.state.theme.allow_consumer_to_use_internal_account
          }
          useInternalAccount={this.props.useInternalAccount}
          creditAccountBalance={this.props.creditAccountBalance}
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

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    minHeight: '100vh',
    overflowY: 'auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(4),
  },
  totalPrice: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    backgroundColor: '#eee',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const connectUsablecreditAccount = connect(
  (state: RootState, { basket }: { basket: Basket<number, PrepaidLine> }) => ({
    creditAccountBalance: getUsableCreditAccountBalance(state, basket?.company),
  }),
  null,
);
const connector = connect(
  (state: RootState, { basketId }: { basketId: string }) => ({
    basket: getBasket(state, basketId),
    savedPaymentMethodList: getSavedPaymentMethodList(state),
    loading: state.checkout.basket.current.loading,
    processing: state.checkout.basket.current.updating,
  }),
  {
    fetchBasket: fetchBasketAction,
    attachPayment: attachPaymentAction,
    fetchPaymentMethodList,
    fetchCompanyTheme,
    createOrRefreshInternalAccountPrepaidLine:
      createOrRefreshInternalAccountPrepaidLineAction,
  },
);
export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
  routerParamsToProps({ basketId: 'basketId' }),
  withState('basketError', 'setBasketError', null),
  connector,
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
  withHandlers({
    useInternalAccount:
      ({ createOrRefreshInternalAccountPrepaidLine, fetchBasket, basket }) =>
      (amount: number, options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, amount, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchBasket(basket.id);
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
    onRemoveInternalAccountPrepaidLine:
      ({ createOrRefreshInternalAccountPrepaidLine, fetchBasket, basket }) =>
      (options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, 0, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchBasket(basket.id);
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),
  connectUsablecreditAccount,
)(BasketPaymentIntent);
