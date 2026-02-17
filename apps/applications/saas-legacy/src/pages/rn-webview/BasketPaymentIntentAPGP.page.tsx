import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose, withHandlers, withState } from 'recompose';
import { loadStripe } from '@stripe/stripe-js';
import isNil from 'lodash/isNil';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import Alert from '@material-ui/lab/Alert';

import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group.js';

import {
  assignInstalmentPayment as assignInstalmentPaymentAction,
  attachPaymentToBasketId as attachPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
  fetchBasket as fetchBasketAction,
} from '#src/libs/checkout/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '#src/libs/instalment-payment-configuration/actions';
import {
  fetchMember as fetchMemberAction,
  updateDefaultEstablishmentBillingGroup as updateDefaultEstablishmentBillingGroupAction,
} from '#src/libs/member/actions';
import { fetchMembershipByBasket } from '#src/libs/membership/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '#src/libs/offer/actions';
import {
  fetchPaymentGroupStatus as fetchPaymentGroupStatusAction,
  fetchPaymentMethodList as fetchPaymentMethodListAction,
} from '#src/libs/payment/actions';
import {
  snackbarError,
  snackbarSuccess,
  snackbarWarning,
} from '#src/libs/snackbar/actions';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#src/libs/establishment/actions';

import {
  checkItemsBasket as checkItemsBasketAPI,
  createPendingBookingsAndBlockBasket as createPendingBookingsAndBlockBasketAPI,
  invalidatePendingBookingsAndUnblockBasket as invalidatePendingBookingsAndUnblockBasketAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';
import { validateUnpaid as validateUnpaidAPI } from '#src/libs/checkout/api';
import { BasketPaymentProvider } from '#src/libs/checkout/components/new-checkout-flow-unified/BasketPaymentContext';
import { OnlinePaymentBasketUnified } from '#src/libs/checkout/components/new-checkout-flow-unified/OnlinePaymentBasketUnified.component';
import BasketTaxInfo from '#src/libs/checkout/components/BasketTaxInfo.component';
import PrepaidLineListItem from '#src/libs/checkout/components/PrepaidLineListItem.component';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import {
  BASKET_INCONSISTENT,
  PAYMENT_COMBO_CAN_NOT_BOOK_ALL_OFFERS,
  PAYMENT_PACK_CAN_NOT_BOOK_ALL_OFFERS,
} from '#src/libs/checkout/constants';
import {
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
} from '#src/libs/payment/constants';
import {
  getBasket,
  getOffersListFromBasket,
} from '#src/libs/checkout/selectors';
import {
  getDefaultEstablishmentBillingGroup,
  getEnabledEstablishmentBillingGroups,
} from '#src/libs/establishment/selectors';
import { withEstablishment, withMetaActivity } from '#src/libs/offer/selectors';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { Basket, PrepaidLine } from '#src/libs/checkout/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import type { StripeInit } from '#src/libs/payment/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import {
  getSubTotal,
  hasRedirectionFailed,
  shouldCheckPaymentStatus,
} from '#src/libs/checkout/utils';
import { loadDefaultEstablishmentBillingGroup } from '#src/libs/marketplace/utils/booking';
import { isErrorWithCustomCode } from '#src/libs/utils';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import type { RootState } from '#src/reducers';
import type { OptionCallback } from '#src/state/types';
import { MaterialStyleType } from '#src/utils/types';

// @ts-expect-error
import CheckPaymentStatus from '../checkout/basket/CheckPaymentStatus.component';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';

type Props = {
  basket: Basket<number, PrepaidLine>;
  basketId: string;
  basketError: any;
  queryParams: Record<string, string>;
  setQueryParams: (paramName: string) => (value: string) => void;
  fetchPaymentMethodList: (params: any) => void;
  fetchInstalmentPaymentByBasket: (basketId: number) => void;
  fetchPaymentGroupStatus: (
    paymentGroupId: number,
    options: OptionCallback,
  ) => void;
  assignInstalmentPayment: (
    basket: string,
    instalment_payment_id: number,
    options: OptionCallback<Basket>,
  ) => void;
  refreshBasket: (options: OptionCallback) => void;
  onRemoveInternalAccountPrepaidLine: (options?: OptionCallback) => void;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  paymentProcessing: boolean;
  setPaymentProcessing: (process: boolean) => void;
  paymentPackOrComboCanNotBookAllOffers: boolean;
  setPaymentPackOrComboCanNotBookAllOffers: (value: boolean) => void;
} & ConnectedProps<typeof connector> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  theme: CompanyTheme | null;
  clientSecretLoading: boolean;
  clientSecret: string | null;
  selfProcessing: boolean;
  paymentGroupId: number;
  paymentGroupPriceCts: number;
  isEstablishmentBillingGroupSelected: boolean;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  hideEstablishmentBillingGroupSelector: boolean;
  stripePromise: StripeInit | null;
  paymentEngine: number;
};

export class BasketPaymentIntent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: null,
      clientSecretLoading: true,
      clientSecret: null,
      selfProcessing: false,
      paymentGroupId: null,
      paymentGroupPriceCts: null,
      isEstablishmentBillingGroupSelected: true,
      selectedEstablishmentBillingGroup: null,
      hideEstablishmentBillingGroupSelector: false,
      stripePromise: null,
      paymentEngine: PAYMENT_ENGINE_STRIPE,
    };
  }

  setSelectedEstablishmentBillingGroup = (
    selectedEstablishmentBillingGroup: EstablishmentBillingGroup,
  ) => {
    this.setState({
      selectedEstablishmentBillingGroup,
    });
  };

  setIsEstablishmentBillingGroupSelected = (
    // @ts-expect-error
    isEstablishmentBillingGroupSelected,
  ) => {
    this.setState({
      isEstablishmentBillingGroupSelected,
    });
  };

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
    if (hasRedirectionFailed(this.props.queryParams)) {
      this.props.snackbarError(
        this.props.t(
          'validation.sections.confirmationStatusTitle.errors.generic',
        ),
      );
    }
    if (this.props.queryParams.paypalError == BASKET_INCONSISTENT) {
      this.props.snackbarError(
        this.props.t('invoice:paymentPanel.actions.basketWasInconsistent'),
      );
    }
    this.props.fetchBasket(this.props.basketId, {
      onSuccess: (basket) => {
        this.props.fetchCompanyTheme(basket.company, {
          onSuccess: (theme) => {
            if (theme.enable_multi_localization) {
              this.props.fetchAllEstablishmentBillingGroup({
                params: { company: basket.company },
              });
            }
            this.setState({
              theme,
              stripePromise: loadStripe(theme.stripe_pk_key),
            });
          },
        });

        this.props.fetchInstalmentPaymentByBasket(this.props.basketId);

        if (!basket.is_finalized) {
          this.props.fetchMembershipByBasket(
            {
              basket_uuid: this.props.basketId,
            },
            {
              onSuccess: (data) => {
                // @ts-expect-error
                this.props.fetchMember(data.id, {
                  onError: () => {
                    this.setState({
                      hideEstablishmentBillingGroupSelector: true,
                      isEstablishmentBillingGroupSelected: true,
                    });
                  },
                });
              },
            },
          );
        }
      },
    });
    this.props.fetchPaymentMethodList({ basket: this.props.basketId });
    // @ts-expect-error
    this.props.refreshBasket();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.state.hideEstablishmentBillingGroupSelector) {
      loadDefaultEstablishmentBillingGroup(
        this.state.theme?.enable_multi_localization,
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
  }

  onSelectInstalmentPayment = (
    instalment_payment_id: number,
    options: OptionCallback,
  ) => {
    if (this.props.basket?.id) {
      this.props.assignInstalmentPayment(
        this.props.basket.id,
        instalment_payment_id,
        {
          onSuccess: () => {
            this.props.refreshBasket(options);
          },
          onError: options && options.onError,
        },
      );
    }
  };

  onFail = () => {
    this.props.snackbarError(
      this.props.t(
        'validation.sections.confirmationStatusTitle.errors.generic',
      ),
    );
    // @ts-expect-error
    this.props.setQueryParams('check_payment_intent', 'false');
  };

  fetchPaymentGroupBasket = () => {
    // Making a request to get the payment group status	instead of the whole basket avoid monopolizing the basket lock,
    // needed to fully acknowledge the payment group success and finalize the basket
    if (!this.state.paymentGroupId) return;
    this.props.fetchPaymentGroupStatus(this.state.paymentGroupId, {
      onSuccess: (paymentGroupStatus: number) => {
        if (paymentGroupStatus >= PAYMENT_INTENT_STATUS_SUCCESS) {
          this.props.fetchBasket(this.props.basketId);
        }
      },
    });
  };

  onSuccess = () => {
    const delays = [
      0, 1000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
    ];
    const sendMessage = (i: number) => {
      setTimeout(() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        }

        // Stop polling if basket is finalized (component will show success screen)
        if (this.props.basket?.is_finalized) return;

        // Fetch basket to check if it's finalized
        this.props.fetchBasket(this.props.basketId);
        // Also try fetchPaymentGroupBasket if paymentGroupId is available
        this.fetchPaymentGroupBasket();
        if (i < delays.length) {
          sendMessage(i + 1);
        }
      }, delays[i]);
    };

    sendMessage(0);
  };

  validateUnpaid = () => {
    this.setState({ selfProcessing: true }, async () => {
      const basketIsValid = await this.props.checkItemsBasket(
        this.props.basketId,
      );
      if (!basketIsValid) {
        this.setState({ selfProcessing: false });
      }

      if (this.state.selectedEstablishmentBillingGroup) {
        this.updateMemberBillingGroup(
          this.state.selectedEstablishmentBillingGroup.id,
        );
      }

      const { data } = await verifyPriceBasketAPI(this.props.basket.id);
      if (
        (!!this.props.basket.total_price_cts ||
          // @ts-expect-error
          parseFloat(this.props.basket.total_price_cts) === 0) &&
        // @ts-expect-error
        parseFloat(this.props.basket.total_price_cts) !== data
      ) {
        this.setState({ selfProcessing: false });

        window.alert(this.props.t('myBasket.error.inconsistentBasket'));
        window.location.reload();
      } else {
        validateUnpaidAPI(this.props.basketId)
          .then(() => {
            this.onSuccess();
            // @ts-expect-error
            this.props.refreshBasket();
            this.setState({ selfProcessing: false });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ selfProcessing: false });
          });
      }
    });
  };
  createPendingBookingsAndBlockBasket = (
    data: { payment_group_method_identifier?: number } = {},
  ) => {
    if (!this.props.basket) return;
    createPendingBookingsAndBlockBasketAPI(this.props.basket.id, data).catch(
      (error) => console.error(error),
    );
  };

  invalidatePendingBookingsAndUnblockBasket = () => {
    if (!this.props.basket) return;
    invalidatePendingBookingsAndUnblockBasketAPI(this.props.basket.id).catch(
      (error) => console.error(error),
    );
  };

  updateMemberBillingGroup = (establishmentBillingGroupId: number) => {
    if (this.state.theme?.enable_multi_localization) {
      this.props.updateDefaultEstablishmentBillingGroup(
        this.props.basket.member,
        { default_establishment_billing_group: establishmentBillingGroupId },
      );
    }
  };

  render() {
    const { classes, t } = this.props;
    if (!this.props.basket || !this.state.theme) {
      return (
        <div className={classes.container}>
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    // Check if basket is finalized first - if so, show success screen
    // This prevents useless payment status check loop
    if (this.props.basket.is_finalized) {
      return (
        <div className={classes.container}>
          <div className={classes.loadingContainer}>
            <CheckIcon
              color="primary"
              fontSize="large"
              style={{ height: 128, width: 128 }}
            />
            <Typography>{t('myBasket.isFinalized')}</Typography>
          </div>
        </div>
      );
    }

    // Only show payment status check if basket is not yet finalized
    if (shouldCheckPaymentStatus(this.props.queryParams)) {
      return (
        <CheckPaymentStatus
          onFail={this.onFail}
          onSuccess={this.onSuccess}
          paymentIntent={this.props.queryParams.payment_intent}
        />
      );
    }

    const basketPriceExcludingTax = getSubTotal(this.props.basket);
    const taxPrice = (
      parseFloat(this.props.basket.total_price) -
      parseFloat(basketPriceExcludingTax)
    ).toFixed(2);

    const showBillingGroupSelector =
      isNil(this.props.basket.total_price_cts) ||
      !(
        (this.props.basket.total_price_cts || 0) -
        (this.props.basket.total_price_prepaid_lines_cts || 0)
      );

    return (
      <div className={classes.container}>
        {this.props.paymentPackOrComboCanNotBookAllOffers && (
          <Alert className={classes.basketAlert} severity="error">
            {t('myBasket.error.unavailableSessions')}
          </Alert>
        )}
        {this.state.theme.is_tax_excluded_in_marketplace && (
          <BasketTaxInfo
            excludingTaxPrice={basketPriceExcludingTax}
            taxPrice={taxPrice}
          />
        )}
        <div className={classes.totalPrice}>
          <Typography component="p" variant="h4">
            {`${getCurrencyDisplayWithPrice(
              parseFloat(this.props.basket.total_price) -
                parseFloat(this.props.basket.total_price_prepaid_lines),
            )}`}
          </Typography>
        </div>
        {(this.props.loading ||
          this.props.processing ||
          this.props.paymentProcessing) && <LinearProgress color="primary" />}
        {this.props.basket?.prepaid_lines.map((pl) => (
          <PrepaidLineListItem
            key={pl.id}
            divider
            onRemove={this.props.onRemoveInternalAccountPrepaidLine}
            prepaid_line={pl}
          />
        ))}

        {showBillingGroupSelector ? (
          <>
            <div className={classes.billingGroupSelector}>
              <CheckoutBillingGroupSelector
                enableMultiLocalization={
                  this.state.theme?.enable_multi_localization
                }
                establishmentBillingGroups={
                  !this.state.hideEstablishmentBillingGroupSelector
                    ? this.props.establishmentBillingGroups
                    : []
                }
                selectedEstablishmentBillingGroup={
                  !this.state.hideEstablishmentBillingGroupSelector
                    ? this.state.selectedEstablishmentBillingGroup
                    : null
                }
                setIsEstablishmentBillingGroupSelected={
                  this.setIsEstablishmentBillingGroupSelected
                }
                setSelectedEstablishmentBillingGroup={
                  this.setSelectedEstablishmentBillingGroup
                }
              />
            </div>
            <div className={classes.innerContainer}>
              <Button
                color="primary"
                disabled={
                  this.state.selfProcessing ||
                  this.props.basket?.checkout_items?.length === 0
                }
                onClick={() => this.validateUnpaid()}
                variant="contained"
              >
                {t('myBasket.actions.payZero')}
                {this.state.selfProcessing && (
                  <CircularProgress
                    className={classes.circularProgress}
                    color="inherit"
                    size={24}
                  />
                )}
              </Button>
            </div>
          </>
        ) : (
          <BasketPaymentProvider
            basketId={this.props.basketId}
            initialTermsAccepted={true}
          >
            <OnlinePaymentBasketUnified
              basketId={this.props.basketId}
              companyId={this.props.basket.company}
              onConfirmPaymentSuccess={this.onSuccess}
              payerContext={{
                memberId: this.props.basket.member,
                fromApp: true,
                termsAndConditionsAccepted: true,
              }}
              stripePaymentElementConfig={{
                isDefaultForRegion: this.state.theme.is_default_for_region,
                stripeId: this.state.theme.stripe_id,
              }}
            />
          </BasketPaymentProvider>
        )}

        {this.props.basketError &&
          this.props.basketError.response &&
          this.props.basketError.response.status === 423 && (
            <Typography color="error">
              {t('myBasket.error.invalidBasket')}
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
    paddingBottom: theme.spacing(2),
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
  innerContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  billingGroupSelector: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  circularProgress: {
    marginLeft: theme.spacing(2),
  },
  basketAlert: {
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
});

const connector = connect(
  (state: RootState, { basketId }: { basketId: string }) => {
    const basket = getBasket(state, basketId);
    return {
      basket,
      loading:
        state.checkout.basket.current.loading || state.checkout.basket.loading,
      processing: state.checkout.basket.current.updating,
      establishmentBillingGroups: withEstablishment(
        getEnabledEstablishmentBillingGroups,
      )(state),
      defaultEstablishmentBillingGroup: getDefaultEstablishmentBillingGroup(
        state,
        basket?.member,
      ),
      basketOffers: withMetaActivity(
        withEstablishment((state_) =>
          getOffersListFromBasket(state_, basketId),
        ),
      )(state),
    };
  },
  {
    fetchPaymentGroupStatus: fetchPaymentGroupStatusAction,
    fetchBasket: fetchBasketAction,
    attachPayment: attachPaymentAction,
    fetchPaymentMethodList: fetchPaymentMethodListAction,
    fetchInstalmentPaymentByBasket: fetchInstalmentPaymentByBasketAction,
    assignInstalmentPayment: assignInstalmentPaymentAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
    snackbarError,
    createOrRefreshInternalAccountPrepaidLine:
      createOrRefreshInternalAccountPrepaidLineAction,
    fetchMembershipByBasket,
    snackbarErrorMsg: snackbarWarning,
    snackbarSuccessMsg: snackbarSuccess,
    fetchOfferBulk: fetchOfferBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    updateDefaultEstablishmentBillingGroup:
      updateDefaultEstablishmentBillingGroupAction,
    fetchMember: fetchMemberAction,
  },
);
export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['checkout']),
  // @ts-expect-error
  routerParamsToProps({ basketId: 'basketId' }),
  withState('basketError', 'setBasketError', null),
  withState(
    'paymentPackOrComboCanNotBookAllOffers',
    'setPaymentPackOrComboCanNotBookAllOffers',
    false,
  ),
  withState('paymentProcessing', 'setPaymentProcessing', false),
  connector,

  withQueryParams([
    [
      'check_payment_intent',
      'payment_intent',
      'redirect_status',
      'get_user_registration_from_storage',
      'user_registration_response',
      'paypalError',
    ],
    'queryParams',
    'setQueryParams',
  ]),
  withHandlers({
    fetchOfferWithEstablishmentAndActivityBulk:
      ({ fetchOfferBulk, fetchEstablishmentBulk }) =>
      // @ts-expect-error
      (ids) => {
        fetchOfferBulk(ids, {
          // @ts-expect-error
          onSuccess: (offerList) => {
            fetchEstablishmentBulk(
              // @ts-expect-error
              offerList?.map((b) => b.establishment) || [],
            );
          },
        });
      },
    refreshBasket:
      ({ fetchBasket, basketId, fetchOfferWithEstablishmentAndActivityBulk }) =>
      (options: OptionCallback) =>
        fetchBasket(basketId, {
          // @ts-expect-error
          onSuccess: (basket) => {
            options?.onSuccess?.();
            const offerIdsList =
              basket.checkout_items
                ?.filter(
                  // @ts-expect-error
                  (checkoutItem) =>
                    checkoutItem?.extra_data?.offers_data?.length,
                )
                // @ts-expect-error
                ?.map((checkoutItem) =>
                  checkoutItem.extra_data.offers_data.map(
                    // @ts-expect-error
                    (offerData) => offerData?.offer_id,
                  ),
                )
                // @ts-expect-error
                ?.filter((offerId) => !!offerId)
                ?.flat() || [];
            fetchOfferWithEstablishmentAndActivityBulk(offerIdsList);
          },
        }),
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
            error.response.data.forEach((exc: { error_code: number }) => {
              const { error_code } = exc;
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
    onRemoveInternalAccountPrepaidLine:
      ({
        createOrRefreshInternalAccountPrepaidLine,
        fetchInstalmentPaymentByBasket,
        fetchBasket,
        basket,
      }) =>
      (options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, 0, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchBasket(basket.id, {
              onSuccess: () => {
                fetchInstalmentPaymentByBasket(basket.id);
              },
            });
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),
)(BasketPaymentIntent);
