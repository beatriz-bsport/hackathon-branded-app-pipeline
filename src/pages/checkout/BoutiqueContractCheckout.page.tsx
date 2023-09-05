import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import {
  replace as replaceAction,
  push as pushRouter,
} from 'connected-react-router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import moment from 'moment-timezone';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import { CONTRACT_IS_ALREADY_SUBSCRIBED } from '@bsport/common/lib/master-data/error-codes/subscription';
import { getOfferFeature } from '@bsport/common/lib/master-data/available-payment';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { consumerAppBarHOC } from '#hocs/consumer-app-bar.hoc';
import {
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
} from '#libs/marketplace/constants';
import { buildDataForUserRegistration } from '#libs/marketplace/utils';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import { RootState } from '../../reducers';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import themeSelectors, { getStripePkKey } from '#libs/theme/selectors';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '#libs/payment/actions';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import { WithHandlerType } from '../../utils/types';
// @ts-expect-error
import Analytics from '#components/analytics/Analytics.component';
import Button, { ButtonVariant } from '#components/css-only/Button';

import type { Contract } from '#libs/subscription/types';
import { getSavedPaymentMethodList } from '#libs/payment/selectors';

import {
  retrieveOffer as retrieveOfferAction,
  fetchOfferStatus as fetchOfferStatusAction,
  offerUserRegistration as offerUserRegistrationAction,
  fetchOfferById as fetchOfferByIdAction,
} from '#libs/offer/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import { invalidatePendingBooking as invalidatePendingBookingAPI } from '#libs/offer/api';
import {
  getOfferById,
  withMetaActivity,
  withEstablishment,
} from '#libs/offer/selectors';
import {
  fetchContractDetail,
  registerContractBackground,
  downloadPDFContractTermsForContract as downloadPDFContractTermsForContractAction,
} from '#libs/subscription/actions';
import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchMarketplacePacks,
} from '#libs/payment-packs/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivatePassAsConsumerList,
} from '#libs/private-service/actions';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
// @ts-expect-error
import { getContract, withPaymentPack } from '#libs/subscription/selectors';
import type { OptionCallback } from '../../state/types';
import { getMarketplaceEnabledPaymentMethods } from '#libs/payment/utils';

import './BoutiqueContractCheckout.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MarketplaceSubscriptionPayment from '#libs/checkout/components/new-checkout-flow/SubscriptionPayment';
import SubscriptionTerms from '#libs/subscription/components/new-checkout-flow/SubscriptionTerms';
import SubscriptionBasketSummary from '#libs/subscription/components/new-checkout-flow/SubscriptionBasketSummary';
import SubscriptionBillingInfo from '#libs/subscription/components/new-checkout-flow/SubscriptionBillingInfo';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchMetaActivityDetails as fetchMetaActivityDetailsAction } from '#libs/meta-activity/actions';
import { PrepaidLine } from '#libs/checkout/types';
import MarketplaceContractTermsModal from '#libs/marketplace/components/MarketplaceContractTermsModal';
import { appliesToContract } from '#libs/coupon/api';
import { computeProrataPriceForSubscription } from '#libs/subscription/utils';
import { ProcessingPaymentDialogPortal } from '#libs/subscription/components/new-checkout-flow/ProcessingPaymentDialog';
import SubscriptionErrorDialog from '#libs/subscription/components/new-checkout-flow/SubscriptionErrorDialog';
import MarketplaceContractCooldownModal from '#libs/marketplace/components/MarketplaceContractCooldownModal';
import { BookerItem } from '#libs/booker-module/types';
import { getOfferBookerUrl } from '#libs/marketplace/routing-utils';

type RouterProps = {
  companyId: number;
  contractId: number;
  queryParams: {
    force: string;
    offerId: string;
    selectedSpotId: string | null;
  };
};

type WithProps = {
  offerId: number;
  selectedSpotId: number | null;
};

type HandlersProps = WithHandlerType<typeof stripeHandlers> &
  WithHandlerType<typeof handlers>;

type OwnProps = {
  companyId: number;
  contractLoading: boolean;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectedProps &
  RouterProps &
  WithProps &
  HandlersProps &
  WithTranslation;

type State = {
  processing: boolean;
  stripePromise: Promise<Stripe> | null;
  openContractTermsDialog: boolean;
  isContractCooldownDialogOpen: boolean;
  billingStartDate: string;
  isContractLegalTermsAccepted: boolean;
  validCoupon: { voucher: number; couponCode: string } | null;
  showCouponInput: boolean;
  selectedSavedPaymentMethodId: string | null;
  registerBackgroundServerErrorOccured: boolean;
  userRegistrationserverErrorOccured: boolean;
};

export class MarketplaceNewSubscriptionCheckout extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      processing: false,
      stripePromise: null,
      billingStartDate: moment().format(),
      isContractCooldownDialogOpen: false,
      openContractTermsDialog: false,
      isContractLegalTermsAccepted: false,
      validCoupon: null,
      showCouponInput: true,
      selectedSavedPaymentMethodId: null,
      registerBackgroundServerErrorOccured: false,
      userRegistrationserverErrorOccured: false,
    };
  }

  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchPaymentMethodList();
    this.props.retrieveOfferAndFetchStatus();

    if (this.props.contractId) {
      this.props.fetchContractDetail(this.props.contractId, {
        onSuccess: (contract: Contract) => {
          if (contract?.payment_pack) {
            this.props.fetchPaymentPackBulk([contract.payment_pack]);
          }
          if (contract?.private_pass) {
            this.props.fetchPrivatePassBulk([contract.private_pass]);
          }
          if (contract?.payment_combo) {
            this.props.fetchPaymentComboList({
              id__in: [contract.payment_combo],
              company: this.props.companyId,
              ignore_new_member_only: true,
            });
          }
        },
      });
    }

    if (this.props.theme) {
      this.loadStripe();
    }
  }

  loadStripe = () => {
    this.setState({ stripePromise: loadStripe(getStripePkKey()) });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !prevProps.theme?.id &&
      !!this.props.theme?.id &&
      !prevState.stripePromise
    ) {
      this.loadStripe();
    }
  }

  setSelectedSavedPaymentMethodId = (
    selectedSavedPaymentMethodId: string | null,
  ) => this.setState({ selectedSavedPaymentMethodId });

  handleOpenContractTermsDialog = () =>
    this.setState({ openContractTermsDialog: true });

  handleCloseContractTermsDialog = () =>
    this.setState({ openContractTermsDialog: false });

  handleDetachPaymentMethod = async (
    paymentMethodId: number,
    options: OptionCallback,
  ) => {
    try {
      await this.props.detachPaymentMethod(paymentMethodId.toString());
      this.props.fetchPaymentMethodList();
      options.onSuccess && options.onSuccess();
    } catch (err) {
      options.onError && options.onError();
    }
  };

  goToValidationPage = (success: boolean) => {
    this.props.push(
      `/checkout/${this.props.companyId}/subscription/${this.props.contractId}/validation?success=${success}`,
    );
  };

  getIsTaxExcluded = () => {
    return this.props.theme.is_tax_excluded_in_marketplace;
  };

  handleAcceptContract = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isContractLegalTermsAccepted: event.target.checked });
  };

  handleApplyCoupon = async (
    formCouponCode: string,
    options: OptionCallback,
  ) => {
    await appliesToContract({
      coupon_code: formCouponCode,
      contract: this.props?.contract?.id,
      with_prorata: !!this.props?.contract?.month_billing_day,
      from_timestamp: moment(this.state.billingStartDate).unix(),
    })
      .then(({ data }) => {
        if (data.can_be_applied) {
          this.setState({
            validCoupon: { voucher: data.voucher, couponCode: formCouponCode },
            showCouponInput: false,
          });
          if (options && options.onSuccess) options.onSuccess();
        } else if (options && options.onError) options.onError();
      })
      .catch(() => {
        if (options && options.onError) options.onError();
      });
  };

  handleRemoveCoupon = () => {
    this.setState({ validCoupon: null, showCouponInput: true });
  };

  getCouponItem = () => ({
    quantity: 1,
    id: this.state.validCoupon.couponCode,
    unit_price: Math.abs(this.state.validCoupon.voucher) * -1,
    name: this.state.validCoupon.couponCode,
    buyable_item_identifier: BUYABLE_ITEM_COUPON,
    buyable_item_id: this.state.validCoupon.couponCode,
    editable: false,
    clearable: true,
    tax: 0,
    extra_data: {},
  });

  getPrice = () => {
    if (!this.props.contract) return null;

    return this.props.contract.month_billing_day
      ? computeProrataPriceForSubscription(
          moment(),
          this.props?.contract?.month_billing_day,
          this.props?.contract?.recurrent_price.toString(),
        )
      : this.props.contract.recurrent_price;
  };

  getContractItemContent = () => {
    if (!this.props.contract) return null;

    return {
      quantity: 1,
      id: 'subscription_'.concat(this.props.contract.id),
      unit_price: this.getPrice(),
      name: this.props.contract.name,
      buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
      buyable_item_id: 'subscription_'.concat(this.props.contract.id),
      editable: false,
      clearable: false,
      tax: this.props.contract.tax,
      extra_data: {},
    };
  };

  getFlatFeeItem = () => {
    if (!this.props.contract) return null;

    return {
      quantity: 1,
      id: 'flatFee_'.concat(this.props.contract.id),
      unit_price: this.props.contract.flat_fee,
      name: 'Flat fee',
      buyable_item_identifier: CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
      buyable_item_id: 'flatFee_'.concat(this.props.contract.id),
      editable: false,
      clearable: false,
      tax: this.props.contract.tax,
      extra_data: {},
    };
  };

  getCheckoutItems = () => {
    if (!this.props.contract) return [];

    const checkoutItems = [];

    this.state.validCoupon && checkoutItems.push(this.getCouponItem());
    this.props.contract.flat_fee && checkoutItems.push(this.getFlatFeeItem());
    this.props.contract && checkoutItems.push(this.getContractItemContent());

    return checkoutItems;
  };

  getTotalPrice = () => {
    if (!this.props.contract) return null;

    if (this.props.contract.month_billing_day) {
      const firstInvoiceProrataPrice = computeProrataPriceForSubscription(
        moment(),
        this.props.contract.month_billing_day,
        this.props.contract.recurrent_price.toString(),
      );
      return Math.max(
        parseFloat(firstInvoiceProrataPrice) +
          (parseFloat(this.props.contract.flat_fee) || 0) -
          (this.state.validCoupon?.voucher || 0),
        0,
      ).toFixed(2);
    }
    return (
      parseFloat(this.props.contract.recurrent_price) +
      (parseFloat(this.props.contract.flat_fee) || 0) -
      (this.state.validCoupon?.voucher || 0)
    ).toFixed(2);
  };

  getSubscriptionPseudoBasketFromContract = () => {
    if (!this.props.contract) return null;

    return {
      id: this.props.contractId,
      is_finalized: false,
      total_price: this.getTotalPrice(),
      total_price_cts: parseFloat(this.getTotalPrice()) * 100,
      checkout_items: this.getCheckoutItems(),
      company: this.props.companyId,
      total_price_prepaid_lines: '0',
      total_price_prepaid_lines_cts: 0,
      prepaid_lines: [] as PrepaidLine[],
      instalment_payment: null as null,
    };
  };

  handleCloseErrorDialog = () => {
    if (this.state.userRegistrationserverErrorOccured) {
      this.props.replace(`/c/${this.props.companyId}/subscription/`);
    }
    this.setState({
      registerBackgroundServerErrorOccured: false,
      userRegistrationserverErrorOccured: false,
    });
  };

  handleSubmitContractPayment = (
    _: unknown,
    payment_method_id: string,
    _isPaymentMethodForPastInvoicesSaved: boolean,
    _paymentMethodPastInvoicesId: number,
    options: OptionCallback,
    coupon?: string,
  ) => {
    Analytics.contractShowPayment(this.props.contractId);
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.state.billingStartDate,
      ).unix();
      this.props.registerContractBackground(
        this.props.contractId,
        {
          payment_method_id,
          first_billing_timestamp,
          coupon,
          with_prorata: !!this.props?.contract?.month_billing_day,
          offer_id: this.props.offerId,
        },
        {
          onError: (
            err: Error & { response?: { data: { error_code: number } } },
          ) => {
            if (
              err.response?.data?.error_code === CONTRACT_IS_ALREADY_SUBSCRIBED
            ) {
              this.setState({ isContractCooldownDialogOpen: true });
              return;
            }
            this.setState({
              processing: false,
              registerBackgroundServerErrorOccured: true,
            });
          },
          onBackgroundError: () =>
            this.setState({
              processing: false,
              registerBackgroundServerErrorOccured: true,
            }),
          onBackgroundSuccess: (taskReturnValue) => {
            try {
              Analytics.contractPaymentSuccess(this.props?.contract);
            } catch (err) {
              console.error(err);
            }

            // First we invalidate the pending booking
            invalidatePendingBookingAPI(this.props.offer.id)
              .then(() => {
                const { compatible_consumer_payment_pack_id } = taskReturnValue;

                // If no compatible_consumer_payment_pack_id, then we cannot proceed with user_registration
                // In this case, display the error dialog, which will handle redirection
                if (!compatible_consumer_payment_pack_id) {
                  this.setState({
                    processing: false,
                    userRegistrationserverErrorOccured: true,
                  });
                  return;
                }

                this.props.formatPayloadAndPerformUserRegistrationAndRedirection(
                  compatible_consumer_payment_pack_id,
                  {
                    onError: () =>
                      this.setState({
                        processing: false,
                        userRegistrationserverErrorOccured: true,
                      }),
                    onSuccess: () => this.setState({ processing: false }),
                  },
                );
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  processing: false,
                  userRegistrationserverErrorOccured: true,
                });
              });
          },
        },
        false, // noAuth
        true, // hide snackbars
      );
    } catch (err) {
      console.error(err);
      this.goToValidationPage(false);
      if (options && options.onError) {
        options.onError(err);
      }
    }
    if (options && options.onSuccess) {
      options.onSuccess();
    }
  };

  handlePayNow = () => {
    this.handleSubmitContractPayment(
      null,
      this.state.selectedSavedPaymentMethodId,
      null,
      null,
      {},
      this.state.validCoupon?.couponCode ?? null,
    );
  };

  handleCloseContractCooldownDialog = () => {
    this.setState({ isContractCooldownDialogOpen: false });
  };

  render() {
    if (
      this.props.contractLoading ||
      (this.props.contractId && !this.props.contract) ||
      !this.props.theme
    ) {
      return <LinearProgress />;
    }

    return (
      <MemberShipValidationWrapper companyId={this.props.companyId}>
        <div className="bs-boutique-contract-checkout-page">
          <div className="bs-contract-new-checkout__container__page">
            <div className="bs-contract-new-checkout__container">
              <div className="bs-contract-new-checkout__container__grid">
                <div className="bs-contract-new-checkout__container__navigation__go-back">
                  <Button
                    classes={{
                      root: 'bs-contract-new-checkout__container__navigation__arrow',
                    }}
                    onClick={this.props.goBackToPricingPage}
                    variant={ButtonVariant.ICON}
                  >
                    <ArrowBack />
                  </Button>
                  <div className="bs-contract-new-checkout__container__navigation__title">
                    {this.props.t('newCheckout.title')}
                  </div>
                </div>

                <div className="bs-contract-new-checkout__payment-method">
                  <MarketplaceSubscriptionPayment
                    onlinePaymentEnabled
                    detachPaymentMethod={this.props.detachPaymentMethod}
                    enabledPaymentGroupMethodIdentifierIds={
                      this.props.theme.payment_method_available_subscription
                    }
                    enabledPaymentMethodsIds={getMarketplaceEnabledPaymentMethods(
                      {
                        paymentMethodAvailableSubscription:
                          this.props.theme
                            .payment_method_available_subscription,
                      },
                    )}
                    // @ts-expect-error
                    isContractLegalTermsAccepted={
                      this.state.isContractLegalTermsAccepted
                    }
                    paymentMethodLoading={this.props.paymentMethodLoading}
                    refreshSavedPaymentMethodList={
                      this.props.fetchPaymentMethodList
                    }
                    requestSetupIntentSecret={
                      this.props.requestSetupIntentSecret
                    }
                    savedPaymentMethodList={this.props.savedPaymentMethodList}
                    selectedSavedPaymentMethodId={
                      this.state.selectedSavedPaymentMethodId
                    }
                    sepaDefaultEmail={this.props.auth.username}
                    sepaDefaultName={this.props.auth.name}
                    setSelectedSavedPaymentMethodId={
                      this.setSelectedSavedPaymentMethodId
                    }
                  />
                  <SubscriptionTerms
                    contractTerms={this.props.contract?.contract}
                    handleAcceptContract={this.handleAcceptContract}
                    isContractLegalTermsAccepted={
                      this.state.isContractLegalTermsAccepted
                    }
                    onOpenContractTermsDialog={
                      this.handleOpenContractTermsDialog
                    }
                  />
                </div>

                <div className="bs-contract-new-checkout__basket-summary">
                  <SubscriptionBasketSummary
                    companyTheme={this.props.theme}
                    contract={this.props.contract}
                    isExcludingTax={this.getIsTaxExcluded()}
                    offer={this.props.offer}
                  />
                </div>

                <div className="bs-contract-new-checkout__billing-info">
                  <SubscriptionBillingInfo
                    handlePayNow={this.handlePayNow}
                    handleSubmitCouponCode={this.handleApplyCoupon}
                    isExcludingTax={this.getIsTaxExcluded()}
                    isPayButtonDisabled={
                      !this.state.isContractLegalTermsAccepted ||
                      !this.state.selectedSavedPaymentMethodId
                    }
                    showCouponInput={this.state.showCouponInput}
                    // @ts-expect-error
                    subscriptionPseudoBasket={this.getSubscriptionPseudoBasketFromContract()}
                  />
                </div>
              </div>
            </div>
            <MarketplaceContractTermsModal
              contractTerms={this.props.contract?.contract}
              isContractTermsDownloadLoading={
                this.props.contractTermsDownloadLoading
              }
              isOpen={this.state.openContractTermsDialog}
              onDialogClose={this.handleCloseContractTermsDialog}
              onDownloadTerms={this.props.downloadContractTerms}
            />
            <ProcessingPaymentDialogPortal open={this.state.processing} />
            <SubscriptionErrorDialog
              handleAction={this.handleCloseErrorDialog}
              open={
                this.state.registerBackgroundServerErrorOccured ||
                this.state.userRegistrationserverErrorOccured
              }
              registerBackgroundServerErrorOccured={
                this.state.registerBackgroundServerErrorOccured
              }
              userRegistrationserverErrorOccured={
                this.state.userRegistrationserverErrorOccured
              }
            />
            <MarketplaceContractCooldownModal
              isOpen={this.state.isContractCooldownDialogOpen}
              onDialogClose={this.handleCloseContractCooldownDialog}
            />
          </div>
        </div>
      </MemberShipValidationWrapper>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { contractId, offerId }: { contractId: string; offerId: number },
) => ({
  offer: withMetaActivity(withEstablishment(getOfferById))(state, offerId),
  contract: withPaymentPack(getContract)(state, contractId),
  contractLoading: state.subscription.contract.byMarketplace.loading,
  paymentPackLoading: state.paymentPack.loading,
  privatePassLoading: state.privateService.privatePass.loading,
  paymentComboLoading: state.paymentCombo.loading,
  theme: themeSelectors.getTheme(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  contractTermsDownloadLoading:
    state.subscription.contractTermsDownload.loading,
  auth: state.auth,

  offerStatusById: state.offer.offerStatus.byId,
  paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
});

const mapDispatchToProps = {
  replace: replaceAction,
  push: pushRouter,
  fetchContractDetail,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPrivatePassBulk: fetchPrivatePassBulkAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethodAction: detachPaymentMethod,
  registerContractBackground,
  fetchPaymentComboList,
  fetchPaymentPacks: fetchMarketplacePacks,
  fetchPrivatePassAsConsumerList,
  downloadPDFContractTermsForContract:
    downloadPDFContractTermsForContractAction,
  fetchOfferById: fetchOfferByIdAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchMetaActivityDetails: fetchMetaActivityDetailsAction,
  fetchCompanyTheme: fetchCompanyThemeAction,

  fetchOfferStatus: fetchOfferStatusAction,
  retrieveOffer: retrieveOfferAction,
  offerUserRegistration: offerUserRegistrationAction,
};

const stripeHandlers = {
  requestSetupIntentSecret:
    ({ companyId }: RouterProps) =>
    () =>
      requestSetupIntentSecretAPI(null, companyId),
  fetchPaymentMethodList:
    ({ companyId, fetchPaymentMethodList }: RouterProps & ConnectedProps) =>
    () =>
      fetchPaymentMethodList({ company: companyId }),
};

const handlers = {
  detachPaymentMethod:
    ({
      detachPaymentMethodAction,
      fetchPaymentMethodList,
      companyId,
    }: RouterProps & ConnectedProps) =>
    (pm_id: string, options?: OptionCallback) => {
      detachPaymentMethodAction(
        { company: companyId, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchPaymentMethodList({ company: companyId });
            if (options && options.onSuccess) {
              options.onSuccess();
            }
          },
          onError: options && options.onError,
        },
      );
    },
  downloadContractTerms:
    ({
      downloadPDFContractTermsForContract,
      contractId,
    }: ConnectedProps & RouterProps) =>
    (options: OptionCallback) =>
      downloadPDFContractTermsForContract(contractId, options),
  retrieveOfferAndFetchStatus:
    ({
      retrieveOffer,
      fetchOfferStatus,
      offerId,
      fetchEstablishmentBulk,
      fetchMetaActivityDetails,
    }: ConnectedProps & WithProps) =>
    () => {
      retrieveOffer(offerId, {
        onSuccess: (offer) => {
          fetchOfferStatus(offer.id);
          fetchEstablishmentBulk([offer.establishment]);
          fetchMetaActivityDetails(offer.meta_activity);
        },
      });
    },
  formatPayloadAndPerformUserRegistrationAndRedirection:
    ({
      offer,
      offerStatusById,
      theme,
      offerUserRegistration,
      push,
      companyId,
      selectedSpotId,
    }: RouterProps & ConnectedProps & WithProps) =>
    (consumerPaymentPackId: number, options?: OptionCallback) => {
      const fakeSelectedItem = {
        data: {
          id: consumerPaymentPackId,
        },
        itemIdentifier: CONSUMER_PAYMENT_PACK_IDENTIFIER,
      } as unknown as BookerItem;

      const offerFeature = getOfferFeature(
        offer,
        offerStatusById,
        theme.accept_double_booking,
        theme.accept_double_booking_workshop,
      );

      const data = buildDataForUserRegistration(
        offerFeature,
        fakeSelectedItem,
        offer.id,
        selectedSpotId,
      );

      offerUserRegistration(
        data,
        {
          onSuccess: (responseData: any) => {
            options?.onSuccess?.();
            if (data.consumer_payment_pack || !data.offers.length) {
              push(
                `/checkout/${companyId}/validation?basket=null&user_registration_response=${encodeURIComponent(
                  JSON.stringify(responseData),
                )}`,
              );
            } else {
              push(
                `/checkout/${companyId}/?user_registration_response=${encodeURIComponent(
                  JSON.stringify(responseData),
                )}`,
              );
            }
          },
          onError: options?.onError,
        },
        { check_offer_unicity: true },
      );
    },
  goBackToPricingPage:
    ({ push, companyId, offerId }: RouterProps & ConnectedProps & WithProps) =>
    () => {
      push(getOfferBookerUrl(companyId, offerId, true));
    },
};

export default compose<any, OwnProps>(
  routerParamsToProps({
    contractId: 'contractId:number',
    companyId: 'companyId:number',
  }),
  withQueryParams([['offerId', 'selectedSpotId'], 'queryParams']),
  withProps(({ queryParams }: RouterProps) => ({
    offerId: Number.parseInt(queryParams.offerId),
    selectedSpotId: queryParams.selectedSpotId
      ? Number.parseInt(queryParams.selectedSpotId)
      : null,
  })),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['subscription']),
  withHandlers(stripeHandlers),
  withRouter,
  // @ts-expect-error
  withHandlers(handlers),
  marketplaceCssHoc(),
  consumerAppBarHOC(),
)(MarketplaceNewSubscriptionCheckout);
