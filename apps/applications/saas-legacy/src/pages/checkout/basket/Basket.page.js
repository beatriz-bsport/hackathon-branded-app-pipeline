import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { CircularProgress, type Theme, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  goBack,
  push as pushRouter,
  replace as replaceRouter,
} from 'connected-react-router';

import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_STATUS_SUCCESS,
  PAYMENT_INTENT_TYPE_BASKET,
} from '@bsport/common/lib/master-data/payment-group.js';

import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#src/libs/establishment/actions';
import {
  getDefaultEstablishmentBillingGroup,
  getEnabledEstablishmentBillingGroups,
} from '#src/libs/establishment/selectors';
import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '#src/libs/instalment-payment-configuration/actions';
import { getInstalmentForBasketList } from '#src/libs/instalment-payment-configuration/selectors';
import NewCheckoutFlow from '#src/libs/checkout/components/new-checkout-flow/NewCheckoutFlow.component';
import {
  addItemToBasket as addItemToBasketAction,
  assignInstalmentPayment as assignInstalmentPaymentAction,
  attachCoupon,
  attachPayment as attachPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
  fetchCurrentBasket as fetchCurrentBasketAction,
  monitorExpiredItemRemoval,
  patchCurrentBasket,
  removeItemFromBasket as removeItemFromBasketAction,
} from '#src/libs/checkout/actions';
import {
  BASKET_INCONSISTENT,
  PAYMENT_COMBO_CAN_NOT_BOOK_ALL_OFFERS,
  PAYMENT_PACK_CAN_NOT_BOOK_ALL_OFFERS,
} from '#src/libs/checkout/constants';
import {
  getBasketOfferList,
  getCurrentBasket,
  getCurrentBasketItemRemovalStatusLoading,
} from '#src/libs/checkout/selectors';
import {
  hasRedirectionFailed,
  removeQueryParamsFromUrl,
  shouldCheckPaymentStatus,
  shouldNotRetrieveSecret,
} from '#src/libs/checkout/utils';
import { validateUnpaid as validateUnpaidAPI } from '#src/libs/checkout/api';
import {
  detachPaymentMethod,
  fetchPaymentMethodList,
} from '#src/libs/payment/actions';
import {
  checkItemsBasket as checkItemsBasketAPI,
  createPendingBookings as createPendingBookingsAPI,
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  invalidatePendingBookings as invalidatePendingBookingsAPI,
} from '#src/libs/payment/api';
import {
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
} from '#src/libs/payment/constants';
import {
  fetchMember,
  updateDefaultEstablishmentBillingGroup as updateDefaultEstablishmentBillingGroupAction,
} from '#src/libs/member/actions';
import { fetchMembership } from '#src/libs/membership/actions';
import { getUsableCreditAccountBalance } from '#src/libs/membership/selectors';
import { CouponErrorCodes } from '#src/libs/coupon/constants';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '#src/libs/offer/actions';
import { withEstablishment, withMetaActivity } from '#src/libs/offer/selectors';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import { fetchShopItemFeatured } from '#src/libs/shop/actions/shopitem';
import { getBookedSessionListDataFromBasket } from '#src/components/analytics/utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { loadDefaultEstablishmentBillingGroup } from '#src/libs/marketplace/utils/booking';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import {
  getCheckoutValidationUrl,
  getMarketplaceRoute,
  getMemberProfileRoute,
  getUserSpaceUrl,
} from '#src/libs/marketplace/routing-utils';

// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import analyticsUtils from '#src/components/analytics/analytics';
// @ts-expect-error
import CheckPaymentStatus from './CheckPaymentStatus.component';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import CheckoutContext from './CheckoutContext';

import { requestClientSecret as requestClientSecretAPI } from '#src/libs/invoice/api';
import { fetchProfile } from '#src/libs/consumer-space/actions';
// @ts-expect-error js file
import { auth as authActions } from '#src/actions';
import {
  snackbarError,
  snackbarSuccess,
  snackbarWarning,
} from '#src/libs/snackbar/actions';

import type { BasketPageProps } from '#src/pages/checkout/basket/Basket.types';
import type { Coupon } from '#src/libs/coupon/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import type {
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
} from '#src/state/types';

export class BasketPage extends React.Component<BasketPageProps> {
  state = {
    clientSecret: null,
    paymentGroupId: null,
    paymentGroupPriceCts: null,
    customerSessionClientSecret: null,
    clientSecretLoading: false,
    paymentEngine: PAYMENT_ENGINE_STRIPE,
    nextPaymentIntentStatusCheckSeconds: 1.5,
    isEstablishmentBillingGroupSelected: true,
    selectedEstablishmentBillingGroup: null,
  };

  setSelectedEstablishmentBillingGroup = (
    establishmentBillingGroup: EstablishmentBillingGroup,
  ) => {
    this.setState({
      selectedEstablishmentBillingGroup: establishmentBillingGroup,
    });
  };

  UNSAFE_componentWillMount() {
    this.props.refreshBasket();
    this.props.fetchShopItemFeatured(this.props.companyId);
    this.props.retrieveCompanyCssConfiguration(this.props.companyId);
  }

  componentDidMount() {
    if (this.props.queryParams.get_user_registration_from_storage) {
      const rawUserRegistrationResponse = window.localStorage.getItem(
        USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
      );
      if (rawUserRegistrationResponse) {
        this.props.setQueryParams(USER_REGISTRATION_RESPONSE_QUERY_PARAM)(
          encodeURIComponent(rawUserRegistrationResponse),
        );
        window.localStorage.removeItem(
          USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
        );
      }
    }
    if (this.props.queryParams.paypalError == BASKET_INCONSISTENT) {
      this.props.snackbarError(
        this.props.t('invoice:paymentPanel.actions.basketWasInconsistent'),
      );
    }
    if (hasRedirectionFailed(this.props.queryParams)) {
      this.props.snackbarError(
        this.props.t(
          'validation.sections.confirmationStatusTitle.errors.generic',
        ),
      );

      // Remove error-related query params from the URL to avoid repeated error triggers on page refresh
      removeQueryParamsFromUrl([
        'redirect_status',
        'payment_intent',
        'payment_intent_client_secret',
        'payment_method_type',
        'check_payment_intent',
      ]);
    }
    this.props.fetchCompanyTheme(this.props.companyId, {
      onSuccess: (theme) => {
        if (theme.enable_multi_localization) {
          this.props.fetchAllEstablishmentBillingGroup({
            params: { company: this.props.companyId },
          });
        }
      },
    });
    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
    if (this.props.basket) {
      this.props.fetchInstalmentPaymentByBasket(this.props.basket.id);
      analyticsUtils.viewCart(this.props.basket);
      if (this.props.basket.total_price_cts) {
        this.getSecret(this.state.paymentEngine);
      }
    }
    if (this.props.auth.authenticated && this.props.basket?.member) {
      this.props.fetchMember(this.props.basket.member);
      this.props.fetchMembership(this.props.basket.member);
    }
    if (this.props.companyId) {
      this.props.fetchPaymentMethod(
        { company: this.props.companyId },
        {
          onSuccess: () => {
            analyticsUtils.beginCheckout(this.props.basket);
          },
        },
      );
    }
  }

  componentDidUpdate(prevProps: BasketPageProps) {
    if (prevProps.companyId !== this.props.companyId && this.props.companyId) {
      this.props.refreshBasket();
      this.props.fetchPaymentMethod({ company: this.props.companyId });
    }
    if (this.props.basket && !prevProps.basket) {
      this.props.fetchInstalmentPaymentByBasket(this.props.basket.id);
      analyticsUtils.viewCart(this.props.basket);
      if (this.props.basket.total_price_cts) {
        this.getSecret(this.state.paymentEngine);
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
      this.getSecret(this.state.paymentEngine);
    }

    loadDefaultEstablishmentBillingGroup(
      this.props.theme.enable_multi_localization,
      this.state.selectedEstablishmentBillingGroup,
      this.state.isEstablishmentBillingGroupSelected,
      this.setSelectedEstablishmentBillingGroup,
      this.setIsEstablishmentBillingGroupSelected,
      {
        defaultEstablishmentBillingGroup:
          prevProps.defaultEstablishmentBillingGroup,
        establishmentBillingGroups: prevProps.establishmentBillingGroups,
        basketOffers: prevProps.basketOffers,
      },
      {
        defaultEstablishmentBillingGroup:
          this.props.defaultEstablishmentBillingGroup,
        establishmentBillingGroups: this.props.establishmentBillingGroups,
        basketOffers: this.props.basketOffers,
      },
    );
  }

  handlePaymentEngineUpdate = (newPaymentEngine: number) => {
    if (newPaymentEngine !== this.state.paymentEngine)
      this.getSecret(newPaymentEngine);

    this.setState({ paymentEngine: newPaymentEngine });
  };

  getSecret = (paymentEngine: number) => {
    const hasPaymentEngineChanged = paymentEngine !== this.state.paymentEngine;

    if (shouldNotRetrieveSecret(this.props.queryParams)) {
      return;
    }
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_BASKET, {
      basket: this.props.basket.id,
    })
      .then((r) => {
        // To avoid race condition when changing payment engine while client secret is loading
        if (paymentEngine === this.state.paymentEngine) {
          this.setState({
            clientSecret: r.data.client_secret,
            paymentGroupId: r.data.payment_group,
            paymentGroupPriceCts: r.data.price_cts,
            customerSessionClientSecret: r.data.customer_session_id,
            clientSecretLoading: false,
          });
        }

        // TEMP: While installment payments are not available on PayPal, we remove them from the backend when creating PayPal payment attempt. So we need to refetch the basket in this case.
        // Should be removed with BS-4286
        if (hasPaymentEngineChanged) this.props.refreshBasket();
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
        onSuccess: () => {
          this.props.refreshBasket();
          options?.onSuccess?.();
        },
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
        [CouponErrorCodes.GIFTCARD_EXCEPTION]: () => {
          if (options && options[CouponErrorCodes.GIFTCARD_EXCEPTION])
            options[CouponErrorCodes.GIFTCARD_EXCEPTION]();
        },
        [CouponErrorCodes.GIFTCARD_INVALID_ACTIVATION_DATE]: () => {
          if (
            options &&
            options[CouponErrorCodes.GIFTCARD_INVALID_ACTIVATION_DATE]
          )
            options[CouponErrorCodes.GIFTCARD_INVALID_ACTIVATION_DATE]();
        },
      },
      true,
    );
  };

  setTermsAndConditionsAccepted = (termsAndConditionsAccepted) =>
    this.setState({ termsAndConditionsAccepted });

  setIsEstablishmentBillingGroupSelected = (
    isEstablishmentBillingGroupSelected,
  ) =>
    this.setState({
      isEstablishmentBillingGroupSelected:
        isEstablishmentBillingGroupSelected ||
        !this.props.theme.enable_multi_localization,
    });

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

  hasOfferData = () => {
    return (
      this.props.basket &&
      (this.props.basket.checkout_items ?? []).some(
        (checkoutItem) => checkoutItem?.extra_data?.offers_data?.length > 0,
      )
    );
  };

  createPendingBookingsIfNecessary = (
    data: { payment_group_method_identifier?: number } = {},
  ) => {
    if (!this.hasOfferData()) return;

    createPendingBookingsAPI(this.props.basket.id, data).catch((error) =>
      console.error(error),
    );
  };

  invalidatePendingBookingsIfNecessary = () => {
    if (!this.hasOfferData()) return;

    invalidatePendingBookingsAPI(this.props.basket.id).catch((error) =>
      console.error(error),
    );
  };

  render() {
    if (shouldCheckPaymentStatus(this.props.queryParams)) {
      return (
        <CheckPaymentStatus
          onFail={() => {
            this.props.setQueryParams('check_payment_intent', 'false');
            this.props.snackbarError(
              this.props.t(
                'validation.sections.confirmationStatusTitle.errors.generic',
              ),
            );
          }}
          onSuccess={this.props.onSuccess}
          paymentIntent={this.props.queryParams.payment_intent}
        />
      );
    }

    if (!this.props.basket || this.props.companyThemeLoading) {
      return (
        <div className={this.props.classes.loader}>
          <CircularProgress />
        </div>
      );
    }

    const termsAndConditionsAccepted =
      this.state.termsAndConditionsAccepted ||
      !this.props.theme.general_terms_and_conditions;

    return (
      <CheckoutContext.Provider value={true}>
        <ConsumerAppBarContainer backgroundColor="white">
          <div className={this.props.classes.container}>
            <div className={this.props.classes.checkoutFlow}>
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
                enableMultiLocalization={
                  this.props.theme?.enable_multi_localization
                }
                establishmentBillingGroups={
                  this.props.establishmentBillingGroups
                }
                goBack={this.handleGoBack}
                goToCalendar={this.props.goToCalendar}
                goToMarketplace={this.props.goToMarketplace}
                goToMyProfile={this.props.goToMyProfile}
                instalmentPaymentConfigurationList={this.props.instalmentPaymentConfigurationList.filter(
                  (ipc) => ipc.basketId === this.props.basket?.id,
                )}
                invalidatePendingBookingsIfNecessary={
                  this.invalidatePendingBookingsIfNecessary
                }
                isEstablishmentBillingGroupSelected={
                  this.state.isEstablishmentBillingGroupSelected
                }
                isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
                monitorExpiredItemRemoval={this.props.monitorExpiredItemRemoval}
                onPaymentSuccess={this.onSuccess}
                onRemoveInternalAccountPrepaidLine={
                  this.props.onRemoveInternalAccountPrepaidLine
                }
                onSelectInstalmentPayment={this.onSelectInstalmentPayment}
                patchBasket={this.props.patchCurrentBasket}
                paymentEngine={this.state.paymentEngine}
                paymentGroupId={this.state.paymentGroupId}
                paymentGroupPriceCts={this.state.paymentGroupPriceCts}
                paymentMethodChoices={
                  this.props.theme.payment_method_available_basket || []
                }
                paymentPackOrComboCanNotBookAllOffers={
                  this.props.paymentPackOrComboCanNotBookAllOffers
                }
                paymentProcessing={this.props.paymentProcessing}
                refreshBasket={this.props.refreshBasket}
                removeItemFromBasket={this.props.removeItemFromBasket}
                selectedEstablishmentBillingGroup={
                  this.state.selectedEstablishmentBillingGroup
                }
                setIsEstablishmentBillingGroupSelected={
                  this.setIsEstablishmentBillingGroupSelected
                }
                setPaymentEngine={this.handlePaymentEngineUpdate}
                setPaymentProcessing={this.props.setPaymentProcessing}
                setSelectedEstablishmentBillingGroup={
                  this.setSelectedEstablishmentBillingGroup
                }
                setTermsAndConditionsAccepted={
                  this.setTermsAndConditionsAccepted
                }
                snackbarErrorMsg={this.props.snackbarErrorMsg}
                snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                termsAndConditionsAccepted={termsAndConditionsAccepted}
                theme={this.props.theme}
                updateMemberBillingGroup={this.props.updateMemberBillingGroup}
                useInternalAccount={this.props.useInternalAccount}
                validateUnpaid={this.validateUnpaid}
              />
            </div>
          </div>
        </ConsumerAppBarContainer>
      </CheckoutContext.Provider>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    maxWidth: 1180,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
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
      'get_user_registration_from_storage',
      'basket_redirection',
      'paypalError',
    ],
    'queryParams',
    'setQueryParams',
  ]),
  withTranslation(['checkout', 'payment', 'invoice', 'login']),
  connect(
    (state, { companyId }) => {
      const basket = getCurrentBasket(state);
      return {
        auth: state.auth,
        basket,
        loading: state.checkout.basket.current.loading,
        processing: state.checkout.basket.current.updating,
        companyThemeLoading: state.theme.loading,
        theme: themeSelectors.getTheme(state),
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
        establishmentBillingGroups: withEstablishment(
          getEnabledEstablishmentBillingGroups,
        )(state),
        defaultEstablishmentBillingGroup: getDefaultEstablishmentBillingGroup(
          state,
          basket?.member,
        ),
      };
    },
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
      fetchAllEstablishmentBillingGroup:
        fetchAllEstablishmentBillingGroupAction,
      updateDefaultEstablishmentBillingGroup:
        updateDefaultEstablishmentBillingGroupAction,
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
    addItemToBasket:
      ({ addItemToBasket, basket, fetchInstalmentPaymentByBasket }) =>
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
                analyticsUtils.addItemToCart(addCheckoutItemData);
            },
            onError: options?.onError,
          },
        ),
    removeItemFromBasket:
      ({ removeItemFromBasket, basket, fetchInstalmentPaymentByBasket }) =>
      (basketId, data) =>
        removeItemFromBasket(basketId, data, {
          onSuccess: () => {
            const itemToRemove = basket?.checkout_items.find(
              (item) => item.id === data.checkout_item,
            );
            analyticsUtils.removeItemFromCart(itemToRemove);
            fetchInstalmentPaymentByBasket(basket.id);
          },
        }),
  }),
  withState(
    'paymentPackOrComboCanNotBookAllOffers',
    'setPaymentPackOrComboCanNotBookAllOffers',
    false,
  ),
  withHandlers({
    onSuccess:
      ({ replace, basket, queryParams, theme, basketOffers }) =>
      () => {
        if (basket) {
          if (basketOffers?.length > 0) {
            const bookedSessionListData = getBookedSessionListDataFromBasket(
              basket,
              basketOffers,
            );
            if (bookedSessionListData?.length > 0)
              analyticsUtils.onSessionBookingSuccess({
                offersBooked: bookedSessionListData,
              });
          }
          analyticsUtils.onPaymentSuccess(basket);
        }
        const urlParams = queryParams.basket_redirection
          ? { basket: queryParams.basket_redirection }
          : { basket: basket.id };
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
        replace(getCheckoutValidationUrl(theme.company, urlParams));
      },
    checkItemsBasket:
      ({
        snackbarErrorMsg,
        refreshBasket,
        setPaymentPackOrComboCanNotBookAllOffers,
      }) =>
      async (basketId: string) => {
        try {
          await checkItemsBasketAPI(basketId);
        } catch (error) {
          if (isErrorWithCustomCode(error) && error.response.data) {
            error.response.data.forEach((e) => {
              const { error_code } = e;
              if (
                [
                  PAYMENT_PACK_CAN_NOT_BOOK_ALL_OFFERS,
                  PAYMENT_COMBO_CAN_NOT_BOOK_ALL_OFFERS,
                ].includes(error_code)
              ) {
                setPaymentPackOrComboCanNotBookAllOffers(true);
              } else if (ALL_ERROR_CODES.includes(error_code)) {
                setPaymentPackOrComboCanNotBookAllOffers(false);
                snackbarErrorMsg(`canNotBuyErrorCode.${error_code}`);
              } else {
                setPaymentPackOrComboCanNotBookAllOffers(false);
                snackbarErrorMsg('canNotBuyErrorCode.generic');
              }
            });
            refreshBasket();
            return false;
          }
        }
        return true;
      },
    updateMemberBillingGroup:
      ({ updateDefaultEstablishmentBillingGroup, basket, theme }) =>
      (establishmentBillingGroupId: number) => {
        if (theme.enable_multi_localization && basket) {
          updateDefaultEstablishmentBillingGroup(basket.member, {
            default_establishment_billing_group: establishmentBillingGroupId,
          });
        }
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
    /** WIDGET ONLY
     *
     * When having an empty basket the redirect should be to calendar.\
     * We also want to hide the navgation app bar since widget
     */
    goToCalendar:
      ({ companyId, theme, push }) =>
      () => {
        push(
          getMarketplaceRoute(
            theme.company_name,
            companyId,
            'calendar?hideNavigation=true',
          ),
        );
      },
    goToMyProfile:
      ({ companyId, push }) =>
      () => {
        push(getMemberProfileRoute(companyId));
      },
  }),
  withState('basketError', 'setBasketError', null),
  withState('paymentProcessing', 'setPaymentProcessing', false),
  withStyles(styles),
  marketplaceCssHoc(),

  WithCustomCssProvider,
)(BasketPage);
