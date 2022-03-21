// @flow

import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import {
  replace as replaceRouter,
  goBack,
  push as pushRouter,
} from 'connected-react-router';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import { withTranslation } from 'react-i18next';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group';
import {
  addItemToBasket as addItemToBasketAction,
  attachCoupon,
  removeItemFromBasket as removeItemFromBasketAction,
  fetchCurrentBasket as fetchCurrentBasketAction,
  patchCurrentBasket,
  attachPayment as attachPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
  assignInstalmentPayment as assignInstalmentPaymentAction,
} from '../../../libs/checkout/actions';
import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '../../../libs/instalment-payment-configuration/actions';
import { getInstalmentForBasketList } from '../../../libs/instalment-payment-configuration/selectors';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import Analytics from '../../../components/analytics/Analytics.component';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import CheckoutFlow from '../../../libs/checkout/components/CheckoutFlow.component';
import { getCurrentBasket } from '../../../libs/checkout/selectors';

import themeSelectors from '../../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../../libs/theme/actions';
import { getSavedPaymentMethodList } from '../../../libs/payment/selectors';
import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '../../../libs/payment/actions';

import { getShopItemFeaturedList } from '../../../libs/shop/selectors';
import { fetchShopItemFeatured } from '../../../libs/shop/actions/shopitem';

import { requestClientSecret as requestClientSecretAPI } from '../../../libs/invoice/api';
import PaymentStripe from '../../../libs/payment/components/payment-backend-stripe/PaymentStripe.component';
import { getPaymentGroupStatus as getPaymentGroupStatusAPI } from '../../../libs/payment/api';
import { validateUnpaid as validateUnpaidAPI } from '../../../libs/checkout/api';

import { auth as authActions } from '../../../actions';
import {
  snackbarError,
  snackbarWarning,
  snackbarSuccess,
} from '../../../libs/snackbar/actions';

import { fetchProfile } from '../../../libs/consumer-space/actions';

import CheckPaymentStatus from './CheckPaymentStatus.component';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import { getUsableCreditAccountBalance } from '#libs/membership/selectors';
import type { OptionCallback } from '../../../state/types';
import { fetchMember } from '#libs/member/actions';

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

  patchCurrentBasket: (data: any) => void,
  fetchPaymentMethod: (params: any) => void,
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
  auth: any,

  onSuccess: () => void,

  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,

  snackbarError: (string) => void,
  queryParams: any,
  setQueryParams: (string, string) => void,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
  useInternalAccount: (amount: number) => void,
  onRemoveInternalAccountPrepaidLine: () => void,
  creditAccountBalance: number | null,
  fetchMember: (id: number) => void,
  refreshBasket: () => void,

  instalmentPaymentConfigurationList: Array<InstalmentPayment>,
  assignInstalmentPayment: (
    basket: string,
    instalment_payment_id: number,
    options: OptionCallback<Basket>,
  ) => void,
};

export class BasketPage extends React.Component<Props> {
  state = {
    clientSecret: null,
    paymentGroupId: null,
    clientSecretLoading: false,
    nextPaymentIntentStatusCheckSeconds: 1.5,
  };

  componentWillMount() {
    this.props.refreshBasket();
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchShopItemFeatured(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId && this.props.companyId) {
      this.props.refreshBasket();
      this.props.fetchPaymentMethod({ company: this.props.companyId });
    }
    if (this.props.basket && !prevProps.basket) {
      Analytics.showBasket(this.props.basket);
      if (this.props.basket.total_price_cts) {
        this.getSecret();
      }
      if (this.props.basket.member) {
        this.props.fetchMember(this.props.basket.member);
      }
    }
    if (
      !!this.props.basket &&
      !!prevProps.basket &&
      this.props.basket.total_price_cts !== prevProps.basket.total_price_cts &&
      this.props.basket.total_price_cts
    ) {
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
    if (this.props.basket) {
      Analytics.showBasket(this.props.basket);
      if (this.props.basket.total_price_cts) {
        this.getSecret();
      }
    }
    if (this.props.auth.authenticated && this.props.basket?.member) {
      this.props.fetchMember(this.props.basket.member);
    }
    if (this.props.companyId) {
      this.props.fetchPaymentMethod({ company: this.props.companyId });
    }
  }

  onItemExpire = () => {
    const _this = this;
    setTimeout(() => {
      _this.props.refreshBasket();
    }, 1500);
  };

  onSuccess = (callback) => {
    getPaymentGroupStatusAPI(this.state.paymentGroupId)
      .then((r) => {
        if (r.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
          setTimeout(() => {
            Analytics.onPaymentSuccess(this.props.basket);
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

  attachCoupon = (code: string, options: OptionCallback) => {
    this.props.attachCoupon(code, {
      onSuccess: () => {
        if (options && options.onSuccess) {
          options.onSuccess();
        }
        this.props.refreshBasket();
      },
    });
  };

  setTermsAndConditionsAccepted = (termsAndConditionsAccepted) =>
    this.setState({ termsAndConditionsAccepted });

  onSelectInstalmentPayment = (instalment_payment, options) => {
    if (this.props.basket?.id) {
      this.props.assignInstalmentPayment(
        this.props.basket.id,
        instalment_payment,
        {
          onSuccess: () => {
            this.props.refreshBasket(options);
          },
          onError: options && options.onError,
        },
      );
    }
  };

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
      <ConsumerAppBarContainer>
        <div className={this.props.classes.container}>
          <div className={this.props.classes.checkoutFlow}>
            <CheckoutFlow
              isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
              basket={this.props.basket}
              loading={this.props.loading}
              processing={this.props.processing}
              addItemToBasket={this.props.addItemToBasket}
              addShopItemToBasket={this.props.addShopItemToBasket}
              removeItemFromBasket={this.props.removeItemFromBasket}
              attachCoupon={this.attachCoupon}
              backToCalendar={this.backToCalendar}
              shopItemList={this.props.shopItemList}
              patchBasket={this.props.patchCurrentBasket}
              savedPaymentMethodList={this.props.savedPaymentMethodList}
              termsAndConditions={this.props.theme.general_terms_and_conditions}
              setTermsAndConditionsAccepted={this.setTermsAndConditionsAccepted}
              termsAndConditionsAccepted={termsAndConditionsAccepted}
              onItemExpire={this.onItemExpire}
              validateUnpaid={this.validateUnpaid}
              onRemoveInternalAccountPrepaidLine={
                this.props.onRemoveInternalAccountPrepaidLine
              }
              paymentModule={
                <PaymentStripe
                  loading={this.props.loading || this.props.processing}
                  onCancel={this.backToCalendar}
                  basketTotalPriceCts={this.props.basket?.total_price_cts}
                  basketTotalPricePrepaidLines={
                    this.props.basket?.total_price_prepaid_lines_cts
                  }
                  instalmentPaymentConfigurationList={this.props.instalmentPaymentConfigurationList.filter(
                    (ipc) => ipc.basketId === this.props.basket?.id,
                  )}
                  instalmentPaymentSelectedId={
                    this.props.basket?.instalment_payment
                  }
                  onSelectInstalmentPayment={this.onSelectInstalmentPayment}
                  basketId={this.props.basket.id}
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
                  detachPaymentMethodLoading={
                    this.props.detachPaymentMethodLoading
                  }
                  detachPaymentMethod={this.props.detachPaymentMethod}
                  snackbarErrorMsg={this.props.snackbarErrorMsg}
                  snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                  companyId={this.props.companyId}
                  sepaDefaultName={this.props.auth.name}
                  sepaDefaultEmail={this.props.auth.username}
                  allowConsumerToUseInternalAccount={
                    this.props.theme.allow_consumer_to_use_internal_account
                  }
                  useInternalAccount={this.props.useInternalAccount}
                  creditAccountBalance={this.props.creditAccountBalance}
                />
              }
            />
          </div>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
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
    [
      'check_payment_intent',
      'payment_intent',
      'user_registration_response',
      'redirect_status',
      'context',
      'onValidation',
    ],
    'queryParams',
    'setQueryParams',
  ]),
  withTranslation(['checkout', 'payment', 'invoice', 'login']),
  connect(
    (state, { companyId }) => ({
      auth: state.auth,
      basket: getCurrentBasket(state),
      loading: state.checkout.basket.current.loading,
      processing: state.checkout.basket.current.updating,
      theme: themeSelectors.getTheme(state),
      shopItemList: getShopItemFeaturedList(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      detachPaymentMethodLoading:
        state.paymentBackend.detachPaymentMethod.loading,
      creditAccountBalance: getUsableCreditAccountBalance(state, companyId),
      instalmentPaymentConfigurationList: getInstalmentForBasketList(state),
    }),
    {
      disconnect: authActions.disconnect,
      goToUserSpace: (id) => pushRouter(`/c/${id}/`),
      fetchProfile,

      addItemToBasket: addItemToBasketAction,
      removeItemFromBasket: removeItemFromBasketAction,
      goBack,
      replace: replaceRouter,
      fetchCurrentBasket: fetchCurrentBasketAction,
      fetchInstalmentPaymentByBasket: fetchInstalmentPaymentByBasketAction,
      patchCurrentBasket,
      attachPayment: attachPaymentAction,
      assignInstalmentPayment: assignInstalmentPaymentAction,
      snackbarError,
      attachCoupon,
      fetchCompanyTheme,
      fetchShopItemFeatured,
      fetchPaymentMethod: fetchPaymentMethodList,
      detachPaymentMethodAction: detachPaymentMethod,
      snackbarErrorMsg: snackbarWarning,
      snackbarSuccessMsg: snackbarSuccess,
      createOrRefreshInternalAccountPrepaidLine:
        createOrRefreshInternalAccountPrepaidLineAction,
      fetchMember,
    },
  ),
  withHandlers({
    refreshBasket:
      ({ fetchCurrentBasket, fetchInstalmentPaymentByBasket, companyId }) =>
      (options) =>
        fetchCurrentBasket(companyId, {
          onError: options && options.onError,
          onSuccess: (basket) => {
            if (options && options.onSuccess) {
              options.onSuccess();
            }
            fetchInstalmentPaymentByBasket(basket.id);
          },
        }),
  }),

  withHandlers({
    addItemToBasket:
      ({ addItemToBasket, basket, fetchInstalmentPaymentByBasket }) =>
      (basketId, data) =>
        addItemToBasket(basketId, data, {
          onSuccess: () => fetchInstalmentPaymentByBasket(basket.id),
        }),
    removeItemFromBasket:
      ({ removeItemFromBasket, basket, fetchInstalmentPaymentByBasket }) =>
      (basketId, data) =>
        removeItemFromBasket(basketId, data, {
          onSuccess: () => fetchInstalmentPaymentByBasket(basket.id),
        }),
  }),
  withHandlers({
    addShopItemToBasket:
      ({ addItemToBasket, basket }) =>
      (shopItemId) =>
        addItemToBasket(basket.id, {
          buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
          quantity: 1,
          buyable_item_id: shopItemId,
          extra_data: {},
        }),
    onSuccess:
      ({ replace, basket, queryParams }) =>
      () => {
        replace(
          `/checkout/${basket.company}/validation/?basket=${basket.id}${
            queryParams?.context
              ? `&context=${queryParams && queryParams.context}`
              : ''
          }${
            queryParams?.user_registration_response
              ? `&user_registration_response=${
                  queryParams && queryParams.user_registration_response
                }`
              : ''
          }${
            queryParams?.onValidation
              ? `&onValidation=${queryParams && queryParams.onValidation}`
              : ''
          }`,
        );
      },
  }),
  withHandlers({
    detachPaymentMethod:
      ({ detachPaymentMethodAction, fetchPaymentMethod, companyId }) =>
      (pm_id, options) => {
        detachPaymentMethodAction(
          { company: companyId, payment_method_id: pm_id },
          {
            onSuccess: () => {
              fetchPaymentMethod({ company: companyId });
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: options && options.onError,
          },
        );
      },
  }),
  withHandlers({
    useInternalAccount:
      ({ createOrRefreshInternalAccountPrepaidLine, refreshBasket, basket }) =>
      (amount: number, options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, amount, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            refreshBasket();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
    onRemoveInternalAccountPrepaidLine:
      ({
        createOrRefreshInternalAccountPrepaidLine,
        fetchCurrentBasket,
        companyId,
        basket,
      }) =>
      (options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, 0, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchCurrentBasket(companyId);
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),
  withState('basketError', 'setBasketError', null),
)(BasketPage);
