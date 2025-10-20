import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import {
  replace as replaceAction,
  push as pushRouter,
} from 'connected-react-router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { DateTime } from 'luxon';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { CONTRACT_IS_ALREADY_SUBSCRIBED } from '@bsport/common/lib/master-data/error-codes/subscription.js';
import { getOfferFeature } from '@bsport/common/lib/master-data/available-payment.js';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { consumerAppBarHOC } from '#src/hocs/consumer-app-bar.hoc';
import {
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
} from '#src/libs/marketplace/constants';
import { buildDataForUserRegistration } from '#src/libs/marketplace/utils';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';
import {
  getCheckoutValidationUrl,
  getOfferBookerUrl,
} from '#src/libs/marketplace/routing-utils';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import themeSelectors, { getStripePkKey } from '#src/libs/theme/selectors';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '#src/libs/payment/actions';
import Button, {
  ButtonVariant,
} from '#src/components/css-only/Fabrique/Button';

import type { Contract } from '#src/libs/subscription/types';
import { getSavedPaymentMethodList } from '#src/libs/payment/selectors';

import {
  retrieveOffer as retrieveOfferAction,
  fetchOfferStatus as fetchOfferStatusAction,
  offerUserRegistration as offerUserRegistrationAction,
  fetchOfferById as fetchOfferByIdAction,
} from '#src/libs/offer/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import { invalidatePendingBooking as invalidatePendingBookingAPI } from '#src/libs/offer/api';
import {
  getOfferById,
  withMetaActivity,
  withEstablishment,
} from '#src/libs/offer/selectors';
import {
  fetchContractDetail,
  registerContractBackground,
  downloadPDFContractTermsForContract as downloadPDFContractTermsForContractAction,
} from '#src/libs/subscription/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivatePassAsConsumerList,
} from '#src/libs/private-service/actions';
import { fetchPaymentComboList } from '#src/libs/payment-combo/actions';
import { getContract, withPaymentPack } from '#src/libs/subscription/selectors';
import { getMarketplaceEnabledPaymentMethods } from '#src/libs/payment/utils';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MarketplaceSubscriptionPayment from '#src/libs/checkout/components/new-checkout-flow/SubscriptionPayment';
import SubscriptionTerms from '#src/libs/subscription/components/new-checkout-flow/SubscriptionTerms';
import SubscriptionBasketSummary from '#src/libs/subscription/components/new-checkout-flow/SubscriptionBasketSummary';
import SubscriptionBillingInfo from '#src/libs/subscription/components/new-checkout-flow/SubscriptionBillingInfo';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#src/libs/establishment/actions';
import { fetchMetaActivityDetails as fetchMetaActivityDetailsAction } from '#src/libs/meta-activity/actions';
import { PrepaidLine } from '#src/libs/checkout/types';
import MarketplaceContractTermsModal from '#src/libs/marketplace/components/@Subscription/MarketplaceContractTermsModal';
import { appliesToContract } from '#src/libs/coupon/api';
import { computeProrataPriceForSubscription } from '#src/libs/subscription/utils';
import { ProcessingPaymentDialogPortal } from '#src/libs/subscription/components/new-checkout-flow/ProcessingPaymentDialog';
import SubscriptionErrorDialog from '#src/libs/subscription/components/new-checkout-flow/SubscriptionErrorDialog';
import MarketplaceContractCooldownModal from '#src/libs/marketplace/components/@Subscription/MarketplaceContractCooldownModal';
import { BookerItem } from '#src/libs/booker-module/types';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';

import { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import {
  getEnabledEstablishmentBillingGroups,
  getDefaultEstablishmentBillingGroup,
} from '#src/libs/establishment/selectors';
import {
  fetchMember as fetchMemberAction,
  updateDefaultEstablishmentBillingGroup as updateDefaultEstablishmentBillingGroupAction,
} from '#src/libs/member/actions';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '#src/libs/membership/actions';
import { getMembership } from '#src/libs/membership/selectors';
import { loadDefaultEstablishmentBillingGroup } from '#src/libs/marketplace/utils/booking';
import { buildUrlParams } from '../../http';
import type { OptionCallback } from '../../state/types';
import { WithHandlerType } from '../../utils/types';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import { RootState } from '../../reducers';

import {
  getSessionCoachId,
  getSessionEstablishmentId,
  getSessionMetaActivityId,
} from '#src/components/analytics/utils';
import type { OfferBookingValidation } from '#src/components/analytics/types';

import analyticsUtils from '#src/components/analytics/analytics';

import './BoutiqueContractCheckout.css';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';
import { trackPaymentViewedEvent } from '#src/events/booking/trackers';

type RouterProps = {
  companyId: number;
  contractId: number;
  // eslint-disable-next-line react/no-unused-prop-types
  queryParams: {
    force: string;
    offerId: string;
    selectedSpotId: string | null;
    guest_booking: string;
    guest_first_name: string;
    guest_last_name: string;
    guest_email: string;
  };
};

type WithProps = {
  offerId: number;
  // eslint-disable-next-line react/no-unused-prop-types
  selectedSpotId: number | null;
};

type RedirectionHandlersProps = WithHandlerType<typeof redirectionHandlers>;

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
  RedirectionHandlersProps &
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
  isEstablishmentBillingGroupSelected: boolean;
  selectedEstablishmentBillingGroup?: EstablishmentBillingGroup;
  hasTrackedPaymentViewedEvent: boolean;
};

export class BoutiqueContractCheckout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      processing: false,
      stripePromise: null,
      billingStartDate: DateTime.now().toISO(),
      isContractCooldownDialogOpen: false,
      openContractTermsDialog: false,
      isContractLegalTermsAccepted: false,
      validCoupon: null,
      showCouponInput: true,
      selectedSavedPaymentMethodId: null,
      registerBackgroundServerErrorOccured: false,
      userRegistrationserverErrorOccured: false,
      selectedEstablishmentBillingGroup: null,
      isEstablishmentBillingGroupSelected: true,
      hasTrackedPaymentViewedEvent: false,
    };
  }

  setIsEstablishmentBillingGroupSelected = (isSelected: boolean) => {
    this.setState({ isEstablishmentBillingGroupSelected: isSelected });
  };

  setSelectedEstablishmentBillingGroup = (
    establishmentBillingGroup: EstablishmentBillingGroup,
  ) => {
    this.setState({
      selectedEstablishmentBillingGroup: establishmentBillingGroup,
    });
  };

  componentDidMount() {
    this.props.retrieveCompanyCssConfiguration(this.props.companyId);
    this.props.fetchCompanyTheme(this.props.companyId, {
      onSuccess: (theme) => {
        if (theme.enable_multi_localization) {
          this.props.fetchAllEstablishmentBillingGroup({
            params: { company: this.props.companyId },
          });
        }
      },
    });
    this.props.fetchPaymentMethodList();
    this.props.retrieveOfferAndFetchStatus();

    this.props.fetchMembershipByCompany(this.props.companyId, {
      onSuccess: (data) => this.props.fetchMember(data.id),
    });

    if (this.props.contractId) {
      this.props.fetchContractDetail(this.props.contractId, {
        onSuccess: (contract: Contract) => {
          analyticsUtils.addItemToCart(contract);
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

    if (this.state.selectedEstablishmentBillingGroup) {
      this.setIsEstablishmentBillingGroupSelected(true);
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
        basketOffers: [prevProps.offer],
        establishmentBillingGroupLoading:
          prevProps.establishmentBillingGroupLoading,
      },
      {
        defaultEstablishmentBillingGroup:
          this.props.defaultEstablishmentBillingGroup,
        establishmentBillingGroups: this.props.establishmentBillingGroups,
        basketOffers: [this.props.offer],
        establishmentBillingGroupLoading:
          this.props.establishmentBillingGroupLoading,
      },
    );
    if (
      !!this.props.offer &&
      !this.props.offerLoading &&
      !this.props.metaActivityLoading &&
      !this.state.hasTrackedPaymentViewedEvent
    ) {
      analyticsClientB2C.track(
        trackPaymentViewedEvent({
          activity_id: this.props.offer.activity,
          activity_name: this.props.offer.meta_activity?.name || '',
          offer_id: this.props.offer.id,
          session_type: this.props.offer.meta_activity?.is_workshop
            ? 'workshop'
            : 'group-activity',
          product_type: 'subscription',
        }),
      );
      this.setState({ hasTrackedPaymentViewedEvent: true });
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
    } catch (_err) {
      options.onError && options.onError();
    }
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
      from_timestamp: DateTime.fromISO(
        this.state.billingStartDate,
      ).toUnixInteger(),
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
          DateTime.now().toISODate(),
          this.props?.contract?.month_billing_day,
          (this.props?.contract?.recurrent_price ?? 0).toString(),
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
        DateTime.now().toISODate(),
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

  updateMemberDefaultEstablishmentBillingGroup = () => {
    if (
      this.props.theme.enable_multi_localization &&
      this.state.selectedEstablishmentBillingGroup
    ) {
      this.props.updateDefaultEstablishmentBillingGroup(this.props.memberId, {
        default_establishment_billing_group:
          this.state.selectedEstablishmentBillingGroup.id,
      });
    }
  };

  handleSubmitContractPayment = (
    _: unknown,
    payment_method_id: string,
    _isPaymentMethodForPastInvoicesSaved: boolean,
    _paymentMethodPastInvoicesId: number,
    coupon?: string,
    establishmentBillingGroupId?: number,
  ) => {
    analyticsUtils.onBeginContractPayment(this.props.contract);
    this.setState({ processing: true });
    this.updateMemberDefaultEstablishmentBillingGroup();
    const first_billing_timestamp = DateTime.fromISO(
      this.state.billingStartDate,
    ).toUnixInteger();
    this.props.registerContractBackground(
      this.props.contractId,
      {
        payment_method_id,
        first_billing_timestamp,
        coupon,
        with_prorata: !!this.props?.contract?.month_billing_day,
        offer_id: this.props.offerId,
        establishment_billing_group_id: establishmentBillingGroupId,
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
            if (this.props.contract) {
              analyticsUtils.onContractPaymentSuccess(this.props.contract);
            }
          } catch (err) {
            console.error(err);
          }

          // First we invalidate the pending booking
          invalidatePendingBookingAPI(this.props.offer.id)
            .then(() => {
              const { compatible_consumer_payment_pack_id, billing_plan } =
                taskReturnValue;

              // If no compatible_consumer_payment_pack_id, then we cannot proceed with user_registration
              // In this case, we directly redirect to the confirmation page
              if (!compatible_consumer_payment_pack_id) {
                this.setState({ processing: false });
                this.props.goToConfirmationPage(billing_plan.id);
                return;
              }

              this.props.formatPayloadAndPerformUserRegistrationAndRedirection(
                compatible_consumer_payment_pack_id,
                billing_plan.id,
                {
                  onError: () => this.setState({ processing: false }),
                  onSuccess: () => this.setState({ processing: false }),
                },
              );
            })
            .catch((err) => {
              console.error(err);
              this.setState({
                processing: false,
              });

              const { billing_plan } = taskReturnValue;
              this.props.goToConfirmationPage(billing_plan.id);
            });
        },
      },
      false, // noAuth
      true, // hide snackbars
    );
  };

  handlePayNow = () => {
    this.handleSubmitContractPayment(
      null,
      this.state.selectedSavedPaymentMethodId,
      null,
      null,
      this.state.validCoupon?.couponCode ?? null,
      this.state.selectedEstablishmentBillingGroup?.id,
    );
  };

  handleCloseContractCooldownDialog = () => {
    this.setState({ isContractCooldownDialogOpen: false, processing: false });
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
                    <ArrowBack className="bs-contract-new-checkout__container__navigation__arrow-icon" />
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
                  <CheckoutBillingGroupSelector
                    enableMultiLocalization={
                      this.props.theme.enable_multi_localization
                    }
                    establishmentBillingGroups={
                      this.props.establishmentBillingGroups
                    }
                    selectedEstablishmentBillingGroup={
                      this.state.selectedEstablishmentBillingGroup
                    }
                    setIsEstablishmentBillingGroupSelected={
                      this.setIsEstablishmentBillingGroupSelected
                    }
                    setSelectedEstablishmentBillingGroup={
                      this.setSelectedEstablishmentBillingGroup
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
                      !this.state.isEstablishmentBillingGroupSelected ||
                      !this.state.isContractLegalTermsAccepted ||
                      !this.state.selectedSavedPaymentMethodId
                    }
                    onRemoveCoupon={this.handleRemoveCoupon}
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
  {
    contractId,
    offerId,
    companyId,
  }: { contractId: string; offerId: number; companyId: number },
) => ({
  offer: withMetaActivity(withEstablishment(getOfferById))(state, offerId),
  // @ts-expect-error
  contract: withPaymentPack(getContract)(state, contractId),
  contractLoading: state.subscription.contract.byMarketplace.loading,
  theme: themeSelectors.getTheme(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  contractTermsDownloadLoading:
    state.subscription.contractTermsDownload.loading,
  auth: state.auth,
  // eslint-disable-next-line react/no-unused-prop-types
  offerStatusById: state.offer.offerStatus.byId,
  paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
  // used by HOC
  // eslint-disable-next-line react/no-unused-prop-types
  customConfiguration: state.exportableComponents.customCss,
  establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
  memberId: getMembership(state, companyId)?.id,
  defaultEstablishmentBillingGroup: getDefaultEstablishmentBillingGroup(
    state,
    getMembership(state, companyId)?.id,
  ),
  establishmentBillingGroupLoading:
    state.establishment.establishmentBillingGroup.loading,
  offerLoading: state.offer.retrieve.loading,
  metaActivityLoading: state.metaActivity.loading,
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
  retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  updateDefaultEstablishmentBillingGroup:
    updateDefaultEstablishmentBillingGroupAction,
  fetchMembershipByCompany: fetchMembershipByCompanyAction,
  fetchMember: fetchMemberAction,
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

const redirectionHandlers = {
  goToConfirmationPage:
    ({ push, companyId }: RouterProps & ConnectedProps) =>
    (billingPlanId: number, user_registration_response: unknown = null) => {
      const validationUrl = getCheckoutValidationUrl(companyId, {
        billingPlanId,
        user_registration_response: encodeURIComponent(
          JSON.stringify(user_registration_response),
        ),
      });

      push(validationUrl);
    },
};

const handlers = {
  detachPaymentMethod:
    ({
      detachPaymentMethodAction,
      fetchPaymentMethodList,
      companyId,
    }: RouterProps & ConnectedProps) =>
    (pm_id: string, options?: OptionCallback<unknown, number>) => {
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
      selectedSpotId,
      goToConfirmationPage,
      queryParams,
    }: RouterProps & RedirectionHandlersProps & ConnectedProps & WithProps) =>
    (
      consumerPaymentPackId: number,
      billingPlanid: number,
      options?: OptionCallback,
    ) => {
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

      if (
        queryParams.guest_booking === 'true' &&
        !theme.accept_double_booking
      ) {
        offerFeature.isBookable = true;
      }

      const data = buildDataForUserRegistration(
        offerFeature,
        fakeSelectedItem,
        offer.id,
        selectedSpotId,
        queryParams.guest_booking === 'true' && {
          firstName: queryParams.guest_first_name ?? '',
          lastName: queryParams.guest_last_name ?? '',
          email: queryParams.guest_email ?? '',
        },
      );

      offerUserRegistration(
        data,
        {
          onSuccess: (responseData: any) => {
            options?.onSuccess?.();
            const offerBookedData: OfferBookingValidation = {
              id: offer.id,
              isNewPass: true,
              metaActivityId: getSessionMetaActivityId(offer),
              coachId: getSessionCoachId(offer),
              establishmentId: getSessionEstablishmentId(offer),
              date: offer.date_start,
            };
            if (responseData.extra_data?.spot_id)
              offerBookedData.spotId = offer.extra_data.spot_id;

            if (responseData.extra_data?.spot_name)
              offerBookedData.spotName = offer.extra_data.spot_name;
            analyticsUtils.onSessionBookingSuccess({
              offersBooked: [offerBookedData],
            });
            goToConfirmationPage(billingPlanid, responseData);
          },
          onError: () => {
            options?.onError?.();
            goToConfirmationPage(billingPlanid);
          },
        },
        { check_offer_unicity: true },
      );
    },
  goBackToPricingPage:
    ({
      push,
      companyId,
      offerId,
      queryParams,
    }: RouterProps & ConnectedProps & WithProps) =>
    () => {
      const isGuestBooking = queryParams.guest_booking === 'true';
      const guestFirstName = queryParams.guest_first_name;
      const guestLastNameParam = queryParams.guest_last_name;
      const guestEmailParam = queryParams.guest_email;
      push(
        `${getOfferBookerUrl(companyId, offerId)}${buildUrlParams({
          ...(isGuestBooking && { guest_booking: isGuestBooking }),
          ...(guestFirstName && { guest_first_name: guestFirstName }),
          ...(guestLastNameParam && { guest_last_name: guestLastNameParam }),
          ...(guestEmailParam && { guest_email: guestEmailParam }),
        })}`,
      );
    },
};

export default compose<any, OwnProps>(
  routerParamsToProps({
    contractId: 'contractId:number',
    companyId: 'companyId:number',
  }),
  withQueryParams([
    [
      'offerId',
      'selectedSpotId',
      'guest_booking',
      'guest_first_name',
      'guest_last_name',
      'guest_email',
      'guest_booking',
    ],
    'queryParams',
  ]),
  withProps(({ queryParams }: RouterProps) => ({
    offerId: Number.parseInt(queryParams.offerId),
    selectedSpotId: queryParams.selectedSpotId
      ? Number.parseInt(queryParams.selectedSpotId)
      : null,
  })),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['subscription']),
  withHandlers(stripeHandlers),
  withHandlers(redirectionHandlers),
  withRouter,
  // @ts-expect-error
  withHandlers(handlers),
  marketplaceCssHoc(),
  WithCustomCssProvider,
  consumerAppBarHOC(),
)(BoutiqueContractCheckout);
