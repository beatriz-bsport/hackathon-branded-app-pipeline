// @flow

import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import {
  replace as replaceRouter,
  push,
  goBack,
  push as pushRouter,
} from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import { withTranslation } from 'react-i18next';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';
import { getTheme } from '../../theme';
import {
  addItemToBasket as addItemToBasketAction,
  attachCoupon,
  removeItemFromBasket,
  fetchCurrentBasket as fetchCurrentBasketAction,
  patchCurrentBasket,
  attachPayment as attachPaymentAction,
} from '../../libs/checkout/actions';
import withQueryParams from '../../hocs/with-query-params.hoc';
import Analytics from '../../components/analytics/Analytics.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CheckoutFlow from '../../libs/checkout/components/CheckoutFlow.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import type { Theme } from '../../libs/theme/types';

import themeSelectors from '../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList } from '../../libs/payment/actions';

import { getShopItemFeaturedList } from '../../libs/shop/selectors';
import { fetchShopItemFeatured } from '../../libs/shop/actions/shopitem';

import { requestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';
import MarketplaceAppBar from '../marketplace/MarketplaceAppBar.component';
import PaymentStripe from '../../libs/payment/components/payment-backend-stripe/PaymentStripe.component';
import { getPaymentGroupStatus as getPaymentGroupStatusAPI } from '../../libs/payment/api';
import { validateUnpaid as validateUnpaidAPI } from '../../libs/checkout/api';

import { auth as authActions } from '../../actions';
import { snackbarError } from '../../actions/snackbar.actions';

import { fetchProfile } from '../../libs/consumer-space/actions';
import WidgetUtils from '../../libs/widget/WidgetUtils';

import CheckPaymentStatus from './CheckPaymentStatus.component';

type Props = {
  basket: ?Basket,
  loading: boolean,
  processing: boolean,
  companyId: number,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  fetchCompanyTheme: (companyId: number) => void,
  goBack: () => void,
  theme: ?Theme,
  classes: Object,
  fetchCurrentBasket: (companyId: number) => void,
  patchCurrentBasket: (data: any) => void,
  fetchPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  attachCoupon: (
    code: string,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,

  shopItemList: Array<ShopItem>,
  fetchShopItemFeatured: (companyId: number) => void,

  addShopItemToBasket: (shopitemId: number) => void,
  fetchProfile: () => void,
  goToUserSpace: () => void,
  disconnect: () => void,
  auth: *,

  onSuccess: () => void,

  fetchCurrentBasket: (companyId: number) => void,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,

  snackbarError: (string) => void,
  queryParams: any,
  setQueryParams: (string, string) => void,
};

export class CheckoutPayment extends React.Component<Props> {
  state = {
    clientSecret: null,
    paymentGroupId: null,
    clientSecretLoading: false,
    nextPaymentIntentStatusCheckSeconds: 1.5,
  };

  componentWillMount() {
    this.props.fetchCurrentBasket(this.props.companyId);
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchShopItemFeatured(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId && this.props.companyId) {
      this.props.fetchCurrentBasket(this.props.companyId);
      this.props.fetchPaymentMethodList({ company: this.props.companyId });
    }
    if (
      this.props.basket &&
      !prevProps.basket &&
      !!this.props.basket.total_price_cts
    ) {
      Analytics.showBasket(this.props.basket);
      this.getSecret();
    }
    if (
      !!this.props.basket &&
      !!prevProps.basket &&
      this.props.basket.total_price_cts !== prevProps.basket.total_price_cts
    ) {
      Analytics.showBasket(this.props.basket);
      this.getSecret();
    }
  }

  getSecret = () => {
    if (
      this.props.queryParams &&
      this.props.queryParams.check_payment_intent &&
      this.props.queryParams.redirect_status === 'succeeded'
    ) {
      return;
    }
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(PAYMENT_ENGINE_STRIPE, PAYMENT_INTENT_TYPE_BASKET, {
      basket: this.props.basket.id,
    })
      .then((r) => {
        this.setState({
          clientSecret: r.data.client_secret,
          paymentGroupId: r.data.payment_group,
          clientSecretLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ clientSecretLoading: false });
      });
  };

  componentDidMount() {
    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
    if (this.props.basket && !!this.props.basket.total_price_cts) {
      Analytics.showBasket(this.props.basket);
      this.getSecret();
    }
    if (this.props.companyId) {
      this.props.fetchPaymentMethodList({ company: this.props.companyId });
    }
  }

  onSuccess = (callback) => {
    getPaymentGroupStatusAPI(this.state.paymentGroupId)
      .then((r) => {
        if (r.data >= 200) {
          setTimeout(() => {
            this.props.onSuccess();
            if (callback) callback();
          }, 2000);
        } else {
          setTimeout(
            this.onSuccess,
            this.state.nextPaymentIntentStatusCheckSeconds * 1000,
          );
        }
      })
      .catch(console.error);
  };

  validateUnpaid = (options) => {
    validateUnpaidAPI(this.props.basket.id)
      .then(() => {
        this.props.onSuccess();
        if (options && options.onSuccess) {
          options.onSuccess();
        }
      })
      .catch((err) => {
        console.error(err);
        if (options && options.onError) {
          options.onError(err);
        }
      });
  };

  backToCalendar = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location = this.props.theme.scheduleURL;
      return;
    }
    this.props.goBack();
  };

  setTermsAndConditionsAccepted = (termsAndConditionsAccepted) =>
    this.setState({ termsAndConditionsAccepted });

  render() {
    if (!this.props.basket) {
      return (
        <div className={this.props.classes.loader}>
          <CircularProgress />
        </div>
      );
    }
    if (
      this.props.queryParams &&
      this.props.queryParams.check_payment_intent === 'true'
    ) {
      if (this.props.queryParams.redirect_status === 'succeeded') {
        return (
          <CheckPaymentStatus
            paymentIntent={this.props.queryParams.payment_intent}
            onFail={() => {
              this.props.setQueryParams('check_payment_intent', 'false');
              this.props.snackbarError('payment:failed');
            }}
            onSuccess={() => {
              if (this.props.companyId) {
                this.props.goToUserSpace(this.props.companyId);
              }
            }}
          />
        );
      }
      if (this.props.queryParams.redirect_status === 'failed') {
        this.props.snackbarError('payment:failed');
      }
    }
    const termsAndConditionsAccepted =
      this.state.termsAndConditionsAccepted ||
      !this.props.theme.general_terms_and_conditions;

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.subContainer}>
          <div style={{ width: '100%' }}>
            <MarketplaceAppBar
              isWidget={WidgetUtils.isWidget()}
              paper
              auth={this.props.auth}
              logo={this.props.theme && this.props.theme.cover}
              goToUserSpace={() =>
                this.props.companyId &&
                this.props.goToUserSpace(this.props.companyId)
              }
              disconnect={() => {
                this.props.disconnect(this.props.goBack);
              }}
            />
          </div>
          <Analytics theme={this.props.theme} />
          <div className={this.props.classes.container}>
            <div className={this.props.classes.checkoutFlow}>
              <CheckoutFlow
                basket={this.props.basket}
                loading={this.props.loading}
                processing={this.props.processing}
                addItemToBasket={this.props.addItemToBasket}
                addShopItemToBasket={this.props.addShopItemToBasket}
                removeItemFromBasket={this.props.removeItemFromBasket}
                attachCoupon={this.props.attachCoupon}
                backToCalendar={this.backToCalendar}
                shopItemList={this.props.shopItemList}
                patchBasket={this.props.patchCurrentBasket}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
                termsAndConditions={
                  this.props.theme.general_terms_and_conditions
                }
                setTermsAndConditionsAccepted={
                  this.setTermsAndConditionsAccepted
                }
                termsAndConditionsAccepted={termsAndConditionsAccepted}
                validateUnpaid={this.validateUnpaid}
                paymentModule={
                  <PaymentStripe
                    onCancel={this.backToCalendar}
                    paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
                      PAYMENT_ENGINE_STRIPE
                    ].filter((pm) =>
                      (
                        this.props.theme.payment_method_available_basket || []
                      ).includes(pm),
                    )}
                    clientSecret={this.state.clientSecret}
                    termsAndConditionsAccepted={termsAndConditionsAccepted}
                    termsAndConditions={
                      this.props.theme.general_terms_and_conditions
                    }
                    setTermsAndConditionsAccepted={
                      this.setTermsAndConditionsAccepted
                    }
                    clientSecretLoading={this.state.clientSecretLoading}
                    onSuccess={this.onSuccess}
                    memberId={this.props.basket.member}
                  />
                }
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  subContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflowX: 'auto',
  },
  container: {
    width: '100vw',
    maxWidth: 920,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    paddingTop: theme.spacing(8),
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '15vh',
  },
  checkoutFlow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([
    ['check_payment_intent', 'payment_intent', 'redirect_status'],
    'queryParams',
    'setQueryParams',
  ]),
  withTranslation(['checkout', 'payment', 'invoice', 'login']),
  connect(
    (state) => ({
      auth: state.auth,
      basket: getCurrentBasket(state),
      loading: state.checkout.basket.current.loading,
      processing: state.checkout.basket.current.updating,
      theme: themeSelectors.getTheme(state),
      shopItemList: getShopItemFeaturedList(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      disconnect: authActions.disconnect,
      goToUserSpace: (id) => pushRouter(`/c/${id}/`),
      fetchProfile,

      addItemToBasket: addItemToBasketAction,
      removeItemFromBasket,
      goBack,
      push,
      replace: replaceRouter,
      fetchCurrentBasket: fetchCurrentBasketAction,
      patchCurrentBasket,
      attachPayment: attachPaymentAction,
      snackbarError,
      attachCoupon,
      fetchCompanyTheme,
      fetchShopItemFeatured,
      fetchPaymentMethodList,
    },
  ),
  withHandlers({
    addShopItemToBasket: ({ addItemToBasket, basket }) => (shopItemId) =>
      addItemToBasket(basket.id, {
        buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
        quantity: 1,
        buyable_item_id: shopItemId,
        extra_data: {},
      }),
    onSuccess: ({ replace, basket }) => () => {
      Analytics.onPaymentSuccess(basket);

      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
        return;
      }

      replace(`/c/${basket.company}/?from_basket=${basket.id}`);
    },
  }),
  withState('basketError', 'setBasketError', null),
)(CheckoutPayment);
