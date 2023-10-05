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
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { withTranslation } from 'react-i18next';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group';
import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { marketplaceCssHoc } from '../../../hocs/marketplace-css.hoc';
import {
  addItemToBasket as addItemToBasketAction,
  attachCoupon,
  removeItemFromBasket as removeItemFromBasketAction,
  fetchCurrentBasket as fetchCurrentBasketAction,
  patchCurrentBasket,
  attachPayment as attachPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
  assignInstalmentPayment as assignInstalmentPaymentAction,
  monitorExpiredItemRemoval,
} from '../../../libs/checkout/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../../libs/establishment/actions';
import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '../../../libs/instalment-payment-configuration/actions';
import { getInstalmentForBasketList } from '../../../libs/instalment-payment-configuration/selectors';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import Analytics from '../../../components/analytics/Analytics.component';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import CheckoutFlow from '../../../libs/checkout/components/CheckoutFlow.component';
import NewCheckoutFlow from '#libs/checkout/components/new-checkout-flow/NewCheckoutFlow.component';
import {
  getCurrentBasket,
  getBasketOfferList,
  getCurrentBasketItemRemovalStatusLoading,
} from '../../../libs/checkout/selectors';
import {
  withMetaActivity,
  withEstablishment,
} from '../../../libs/offer/selectors';

import { WidgetUtils } from '../../../libs/widget/WidgetUtils';

import themeSelectors from '../../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../../libs/theme/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '../../../libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../../libs/meta-activity/actions';
import { getSavedPaymentMethodList } from '../../../libs/payment/selectors';
import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '../../../libs/payment/actions';

import { getShopItemFeaturedList } from '../../../libs/shop/selectors';
import { fetchShopItemFeatured } from '../../../libs/shop/actions/shopitem';

import { requestClientSecret as requestClientSecretAPI } from '../../../libs/invoice/api';
import PaymentStripe from '../../../libs/payment/components/payment-backend-stripe/PaymentStripe.component';
import {
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  checkItemsBasket as checkItemsBasketAPI,
  createPendingBookings as createPendingBookingsAPI,
} from '../../../libs/payment/api';
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
import type {
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
  APIPollOptionCallback,
} from '../../../state/types';
import { fetchMember } from '#libs/member/actions';
import { BasketAddress } from '#libs/checkout/types';
import { fetchMembership } from '#libs/membership/actions';
import { CheckoutContext } from './CheckoutContext';
import {
  getCheckoutValidationUrl,
  getUserSpaceUrl,
  getMarketplaceRoute,
} from '../../../libs/marketplace/routing-utils';
import { CouponErrorCodes } from '#libs/coupon/constants';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#libs/exportable-components/actions';
import WithCustomCssProvider from '#hocs/company-custom-css.hoc';

type Props = {
  basket: ?Basket,
  loading: boolean,
  processing: boolean,
  companyId: number,
  removeItemFromBasket: (basketId: string, data: any) => void,
  companyThemeLoading: boolean,
  fetchCompanyTheme: (companyId: number) => void,
  goBack: () => void,
  theme: ?Theme,
  companyCountry: ?string,
  classes: Object,

  patchCurrentBasket: (
    basketAddress: BasketAddress,
    options: OptionCallback,
  ) => void,
  fetchPaymentMethod: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  attachCoupon: (
    basketId: string,
    code: string,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
    hideSnackBar?: boolean,
  ) => void,

  shopItemList: Array<ShopItem>,
  fetchShopItemFeatured: (companyId: number) => void,
  basketItemRemovalStatusLoading: boolean,
  monitorExpiredItemRemoval: (
    companyId: number,
    checkoutItemId: string,
    pollOptionCallback?: APIPollOptionCallback,
  ) => void,

  addShopItemToBasket: (shopitemId: number) => void,
  fetchProfile: () => void,
  goToUserSpace: () => void,
  auth: any,

  onSuccess: () => void,

  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (
    basketId: string,
    data: any,
    options?: OptionCallback,
  ) => void,

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
  fetchMembership: (id: number) => void,
  refreshBasket: () => void,
  checkItemsBasket: (basketId: string) => boolean,

  paymentProcessing: boolean,
  setPaymentProcessing: (process: boolean) => void,

  instalmentPaymentConfigurationList: Array<InstalmentPayment>,
  assignInstalmentPayment: (
    basket: string,
    instalment_payment_id: number,
    options: OptionCallback<Basket>,
  ) => void,
  basketOffers: Array<Offer<number, Establishment, MetaActivity>>,
  isNewCheckoutFlow?: boolean,
  fetchInstalmentPaymentByBasket: (basketId: string) => void,
  goToMarketplace: () => void,
  retrieveCompanyCssConfiguration: (companyid: number) => void,
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
    this.props.fetchShopItemFeatured(this.props.companyId);
    this.props.retrieveCompanyCssConfiguration(this.props.companyId);
  }

  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.companyId);
    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
    if (this.props.basket) {
      this.props.fetchInstalmentPaymentByBasket(this.props.basket.id);
      Analytics.showBasket(this.props.basket);
      if (this.props.basket.total_price_cts) {
        this.getSecret();
      }
    }
    if (this.props.auth.authenticated && this.props.basket?.member) {
      this.props.fetchMember(this.props.basket.member);
      this.props.fetchMembership(this.props.basket.member);
    }
    if (this.props.companyId) {
      this.props.fetchPaymentMethod({ company: this.props.companyId });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId && this.props.companyId) {
      this.props.refreshBasket();
      this.props.fetchPaymentMethod({ company: this.props.companyId });
    }
    if (this.props.basket && !prevProps.basket) {
      this.props.fetchInstalmentPaymentByBasket(this.props.basket.id);
      Analytics.showBasket(this.props.basket);
      if (this.props.basket.total_price_cts) {
        this.getSecret();
      }
      if (this.props.basket.member) {
        this.props.fetchMember(this.props.basket.member);
        this.props.fetchMembership(this.props.basket.member);
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
        Analytics.onPaymentSuccess(this.props.basket);
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
      let url = this.props.theme.scheduleURL;
      if (!url.startsWith('https://')) {
        url = this.props.theme.scheduleURL.replace(/^http/, 'https');
        if (!url.match(/^https/)) url = `https://${url}`;
      }
      window.location = url;
      return;
    }
    this.props.goBack();
  };

  handleGoBack = () => {
    WidgetUtils.handleGoBackNavigation();
    this.props.goBack();
  };

  attachCoupon = (
    code: string,
    options: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => {
    this.props.attachCoupon(
      this.props.basket.id,
      code,
      {
        onSuccess: options?.onSuccess,
        onError: () => {
          if (options?.onError) {
            options.onError();
          }
        },
        [CouponErrorCodes.COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS]:
          () => {
            if (
              options &&
              options[
                CouponErrorCodes
                  .COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS
              ]
            )
              options[
                CouponErrorCodes
                  .COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS
              ]();
          },
      },
      this.props.isNewCheckoutFlow,
    );
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

  createPendingBookingsIfNecessary = (
    data: { payment_group_method_identifier?: number } = {},
  ) => {
    if (!this.props.basket) return;

    const basketHasOfferData = (this.props.basket.checkout_items || []).some(
      (checkoutItem) => checkoutItem?.extra_data?.offers_data?.length > 0,
    );

    if (basketHasOfferData) {
      createPendingBookingsAPI(this.props.basket.id, data).catch((error) =>
        console.error(error),
      );
    }
  };

  render() {
    if (!this.props.basket || this.props.companyThemeLoading) {
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
      if (
        ['succeeded', 'pending'].includes(
          this.props.queryParams.redirect_status,
        )
      ) {
        return (
          <CheckPaymentStatus
            onFail={() => {
              this.props.setQueryParams('check_payment_intent', 'false');
              this.props.snackbarError('payment:failed');
            }}
            onSuccess={() => {
              if (this.props.companyId) {
                this.props.goToUserSpace(this.props.companyId);
              }
            }}
            paymentIntent={this.props.queryParams.payment_intent}
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
      <CheckoutContext.Provider value={this.props.isNewCheckoutFlow}>
        <ConsumerAppBarContainer
          backgroundColor={this.props.isNewCheckoutFlow ? 'white' : null}
        >
          <div className={this.props.classes.container}>
            <div className={this.props.classes.checkoutFlow}>
              {!this.props.isNewCheckoutFlow ? (
                <CheckoutFlow
                  addItemToBasket={this.props.addItemToBasket}
                  addShopItemToBasket={this.props.addShopItemToBasket}
                  attachCoupon={this.attachCoupon}
                  backToCalendar={this.backToCalendar}
                  basket={this.props.basket}
                  checkItemsBasket={this.props.checkItemsBasket}
                  companyCountry={this.props.companyCountry}
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  loading={this.props.loading || this.props.paymentProcessing}
                  onItemExpire={this.onItemExpire}
                  onRemoveInternalAccountPrepaidLine={
                    this.props.onRemoveInternalAccountPrepaidLine
                  }
                  patchBasket={this.props.patchCurrentBasket}
                  paymentModule={
                    <PaymentStripe
                      allowConsumerToUseInternalAccount={
                        this.props.theme.allow_consumer_to_use_internal_account
                      }
                      basketId={this.props.basket.id}
                      basketTotalPriceCts={this.props.basket?.total_price_cts}
                      basketTotalPricePrepaidLines={
                        this.props.basket?.total_price_prepaid_lines_cts
                      }
                      cardBillingDetailsMandatory={
                        this.props.theme.force_billing_details_on_cards
                      }
                      checkItemsBasket={this.props.checkItemsBasket}
                      clientSecret={this.state.clientSecret}
                      clientSecretLoading={this.state.clientSecretLoading}
                      companyId={this.props.companyId}
                      createPendingBookingsIfNecessary={
                        this.createPendingBookingsIfNecessary
                      }
                      creditAccountBalance={this.props.creditAccountBalance}
                      detachPaymentMethod={this.props.detachPaymentMethod}
                      detachPaymentMethodLoading={
                        this.props.detachPaymentMethodLoading
                      }
                      instalmentPaymentConfigurationList={this.props.instalmentPaymentConfigurationList.filter(
                        (ipc) => ipc.basketId === this.props.basket?.id,
                      )}
                      instalmentPaymentSelectedId={
                        this.props.basket?.instalment_payment
                      }
                      loading={
                        this.props.loading ||
                        this.props.processing ||
                        this.props.paymentProcessing
                      }
                      memberId={this.props.basket.member}
                      onCancel={this.backToCalendar}
                      onSelectInstalmentPayment={this.onSelectInstalmentPayment}
                      onSuccess={this.onSuccess}
                      paymentGroupId={this.state.paymentGroupId}
                      paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
                        PAYMENT_ENGINE_STRIPE
                      ].filter((pm) =>
                        (
                          this.props.theme.payment_method_available_basket || []
                        ).includes(pm),
                      )}
                      paymentProcessing={this.props.paymentProcessing}
                      sepaDefaultEmail={this.props.auth.username}
                      sepaDefaultName={this.props.auth.name}
                      setPaymentProcessing={this.props.setPaymentProcessing}
                      setTermsAndConditionsAccepted={
                        this.setTermsAndConditionsAccepted
                      }
                      snackbarErrorMsg={this.props.snackbarErrorMsg}
                      snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                      stripeId={this.props.theme.stripe_id}
                      termsAndConditions={
                        this.props.theme.general_terms_and_conditions
                      }
                      termsAndConditionsAccepted={termsAndConditionsAccepted}
                      useInternalAccount={this.props.useInternalAccount}
                    />
                  }
                  processing={this.props.processing}
                  removeItemFromBasket={this.props.removeItemFromBasket}
                  savedPaymentMethodList={this.props.savedPaymentMethodList}
                  setTermsAndConditionsAccepted={
                    this.setTermsAndConditionsAccepted
                  }
                  shopItemList={this.props.shopItemList}
                  termsAndConditions={
                    this.props.theme.general_terms_and_conditions
                  }
                  termsAndConditionsAccepted={termsAndConditionsAccepted}
                  validateUnpaid={this.validateUnpaid}
                />
              ) : (
                <NewCheckoutFlow
                  addItemToBasket={this.props.addItemToBasket}
                  allowConsumerToUseInternalAccount={
                    this.props.theme.allow_consumer_to_use_internal_account
                  }
                  attachCoupon={this.attachCoupon}
                  auth={this.props.auth}
                  basket={this.props.basket}
                  basketItemRemovalStatusLoading={
                    this.props.basketItemRemovalStatusLoading
                  }
                  basketLoading={this.props.loading || this.props.processing}
                  basketOffers={this.props.basketOffers}
                  cardBillingDetailsMandatory={
                    this.props.theme.force_billing_details_on_cards
                  }
                  checkItemsBasket={this.props.checkItemsBasket}
                  clientSecret={this.state.clientSecret}
                  companyId={this.props.companyId}
                  createPendingBookingsIfNecessary={
                    this.createPendingBookingsIfNecessary
                  }
                  creditAccountBalance={this.props.creditAccountBalance}
                  detachPaymentMethod={this.props.detachPaymentMethod}
                  detachPaymentMethodLoading={
                    this.props.detachPaymentMethodLoading
                  }
                  goBack={this.handleGoBack}
                  goToMarketplace={this.props.goToMarketplace}
                  instalmentPaymentConfigurationList={this.props.instalmentPaymentConfigurationList.filter(
                    (ipc) => ipc.basketId === this.props.basket?.id,
                  )}
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  monitorExpiredItemRemoval={
                    this.props.monitorExpiredItemRemoval
                  }
                  onPaymentSuccess={this.onSuccess}
                  onRemoveInternalAccountPrepaidLine={
                    this.props.onRemoveInternalAccountPrepaidLine
                  }
                  onSelectInstalmentPayment={this.onSelectInstalmentPayment}
                  patchBasket={this.props.patchCurrentBasket}
                  paymentGroupId={this.state.paymentGroupId}
                  paymentProcessing={this.props.paymentProcessing}
                  refreshBasket={this.props.refreshBasket}
                  removeItemFromBasket={this.props.removeItemFromBasket}
                  setPaymentProcessing={this.props.setPaymentProcessing}
                  setTermsAndConditionsAccepted={
                    this.setTermsAndConditionsAccepted
                  }
                  snackbarErrorMsg={this.props.snackbarErrorMsg}
                  snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                  termsAndConditionsAccepted={termsAndConditionsAccepted}
                  theme={this.props.theme}
                  useInternalAccount={this.props.useInternalAccount}
                  validateUnpaid={this.validateUnpaid}
                />
              )}
            </div>
          </div>
        </ConsumerAppBarContainer>
      </CheckoutContext.Provider>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
    maxWidth: (props) => (props?.isNewCheckoutFlow ? '1180px' : 920),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingTop: (props) =>
      props?.isNewCheckoutFlow ? theme.spacing(4) : theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      paddingTop: (props) => (props?.isNewCheckoutFlow ? 0 : theme.spacing(8)),
    },
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
      companyThemeLoading: state.theme.loading,
      theme: themeSelectors.getTheme(state),
      companyCountry: state.theme.theme?.locale?.split('_')[1],
      shopItemList: getShopItemFeaturedList(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      detachPaymentMethodLoading:
        state.paymentBackend.detachPaymentMethod.loading,
      creditAccountBalance: getUsableCreditAccountBalance(state, companyId),
      instalmentPaymentConfigurationList: getInstalmentForBasketList(state),
      basketOffers: withMetaActivity(
        withEstablishment((state_) => getBasketOfferList(state_)),
      )(state),
      customConfiguration: state.exportableComponents.customCss,
      basketItemRemovalStatusLoading:
        getCurrentBasketItemRemovalStatusLoading(state),
    }),
    {
      disconnect: authActions.disconnect,
      goToUserSpace: (id) => pushRouter(getUserSpaceUrl(id)),
      fetchProfile,

      addItemToBasket: addItemToBasketAction,
      removeItemFromBasket: removeItemFromBasketAction,
      goBack,
      replace: replaceRouter,
      push: pushRouter,
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
      fetchMembership,
      fetchOfferBulk: fetchOfferBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
      monitorExpiredItemRemoval,
    },
  ),
  withHandlers({
    fetchOfferWithEstablishmentAndActivityBulk:
      ({ fetchOfferBulk, fetchEstablishmentBulk, fetchMetaActivityBulk }) =>
      (ids) => {
        fetchOfferBulk(ids, {
          onSuccess: (offerList) => {
            fetchMetaActivityBulk(offerList.map((b) => b.meta_activity));
            fetchEstablishmentBulk([offerList.map((b) => b.establishment)]);
          },
        });
      },
  }),
  withHandlers({
    refreshBasket:
      ({
        fetchCurrentBasket,
        fetchInstalmentPaymentByBasket,
        companyId,
        fetchOfferWithEstablishmentAndActivityBulk,
      }) =>
      (options) =>
        fetchCurrentBasket(companyId, {
          onError: options && options.onError,
          onSuccess: (basket) => {
            if (options && options.onSuccess) {
              options.onSuccess();
            }
            fetchInstalmentPaymentByBasket(basket.id);
            const offerIdsList = basket.checkout_items
              ?.filter(
                (checkoutItem) =>
                  checkoutItem.extra_data?.offers_data &&
                  checkoutItem.extra_data.offers_data.length,
              )
              .map((checkoutItem) =>
                checkoutItem.extra_data.offers_data.map(
                  (offerData) => offerData.offer_id,
                ),
              )
              .flat();
            fetchOfferWithEstablishmentAndActivityBulk(offerIdsList);
          },
        }),
  }),
  withHandlers({
    trackOnAddingOne:
      () => (checkoutItemAnalyticsData: CheckoutItemAnalytics) => {
        switch (checkoutItemAnalyticsData.buyable_item_identifier) {
          case BUYABLE_ITEM_PRIVATE_PASS:
            Analytics.addPrivatePassToCart(
              checkoutItemAnalyticsData.checkoutItemToTrack,
            );
            break;
          case BUYABLE_ITEM_SHOP_ITEM:
            Analytics.addShopItemToCart(
              checkoutItemAnalyticsData.checkoutItemToTrack,
            );
            break;
          case BUYABLE_ITEM_COMBO_ITEM:
            Analytics.addPackToCart(
              checkoutItemAnalyticsData.checkoutItemToTrack,
            );
            break;
          case BUYABLE_ITEM_PASS:
            Analytics.addPassToCart(
              checkoutItemAnalyticsData.checkoutItemToTrack,
              'payment_pack',
            );
            break;
          default:
            break;
        }
      },
  }),
  withHandlers({
    addItemToBasket:
      ({
        addItemToBasket,
        basket,
        fetchInstalmentPaymentByBasket,
        trackOnAddingOne,
      }) =>
      (basketId, addCheckoutItemData, options) =>
        addItemToBasket(
          basketId,
          {
            quantity: addCheckoutItemData.quantity,
            buyable_item_identifier:
              addCheckoutItemData.buyable_item_identifier,
            buyable_item_id: addCheckoutItemData.buyable_item_id,
            extra_data: addCheckoutItemData.extra_data,
          },
          {
            onSuccess: () => {
              fetchInstalmentPaymentByBasket(basket.id);
              if (options && options.onSuccess) options.onSuccess();
              if (addCheckoutItemData.name && addCheckoutItemData.price)
                trackOnAddingOne({
                  checkoutItemToTrack: {
                    name: addCheckoutItemData.name,
                    id: addCheckoutItemData.buyable_item_id,
                    price: addCheckoutItemData.price,
                  },
                  buyable_item_identifier:
                    addCheckoutItemData.buyable_item_identifier,
                });
            },
            onError: options?.onError,
          },
        ),
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
      ({ replace, basket, isNewCheckoutFlow, queryParams }) =>
      () => {
        const urlParams = { basket: basket.id };
        if (queryParams?.context) {
          urlParams.context = queryParams.context.toString();
        }
        if (queryParams?.user_registration_response) {
          urlParams.user_registration_response = encodeURIComponent(
            queryParams.user_registration_response,
          );
        }
        if (queryParams?.onValidation) {
          urlParams.onValidation = queryParams.onValidation;
        }
        replace(
          getCheckoutValidationUrl(
            basket.company,
            isNewCheckoutFlow,
            urlParams,
          ),
        );
      },
    checkItemsBasket:
      ({ snackbarErrorMsg, refreshBasket }) =>
      async (basketId: string) => {
        try {
          await checkItemsBasketAPI(basketId);
        } catch (error) {
          if (error.response?.status === 499 && error.response?.data) {
            error.response.data.forEach((e) => {
              const { error_code } = e;
              if (ALL_ERROR_CODES.includes(error_code)) {
                snackbarErrorMsg(`canNotBuyErrorCode.${error_code}`);
              } else {
                snackbarErrorMsg('canNotBuyErrorCode.generic');
              }
            });
            refreshBasket();
            return false;
          }
        }
        return true;
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
        fetchInstalmentPaymentByBasket,
        companyId,
        basket,
      }) =>
      (options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, 0, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchCurrentBasket(companyId, {
              onSuccess: () => fetchInstalmentPaymentByBasket(basket.id),
            });
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
    goToMarketplace:
      ({ companyId, theme, push }) =>
      () => {
        push(getMarketplaceRoute(theme.company_name, companyId));
      },
  }),
  withState('basketError', 'setBasketError', null),
  withState('paymentProcessing', 'setPaymentProcessing', false),
  withStyles(styles),
  marketplaceCssHoc(),

  WithCustomCssProvider,
)(BasketPage);
