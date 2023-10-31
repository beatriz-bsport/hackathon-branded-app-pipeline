import React from 'react';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { push as pushAction } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';

import { Theme } from '@material-ui/core';
import { UniqueIdentifier } from '@dnd-kit/core';
import { TFunction } from 'i18next';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import {
  fetchPlatformInvoiceList as fetchPlatformInvoiceListAction,
  payNowInvoice as payNowInvoiceAction,
  fetchPlatformBillingPlanList,
  fetchPlatformBillingStageList,
  retrievePlatformSubscription,
  retrievePlatformBillingGroup,
  fetchUpsellPackages as fetchUpsellPackagesAction,
  fetchUpsellPackageSubscribedIds as fetchUpsellPackageSubscribedIdsAction,
  requestUpsellPackage as requestUpsellPackageAction,
  checkPlatformSubscriptionSetup as checkSubscriptionSetupAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#libs/platform-billing/actions';
import {
  getPlatformInvoiceList,
  getPlatformSubscription,
  getNonSubscribedUpsellPackages,
  getSubscribedUpsellPackages,
  // @ts-expect-error
} from '#libs/platform-billing/selectors';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  fetchPayoutList as fetchPayoutListAction,
  // fetchStripeBalance as fetchStripeBalanceAction,
  setPaymentMethodAsDefault as setPaymentMethodAsDefaultAction,
} from '#libs/payment/actions';
import {
  getSavedPaymentMethodList,
  getPayoutList,
} from '#libs/payment/selectors';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
// @ts-expect-error
import CompanyPlatformBillingPaymentDetail from '#libs/platform-billing/components/CompanyPlatformBillingPaymentDetail.component';
import CompanyPlatformBillinGroupDetail from '#libs/platform-billing/components/CompanyPlatformBillingGroupDetail.component';
// @ts-expect-error
import FeatureRequestDialog from '#libs/platform-billing/components/FeatureRequestDialog.component';
import PayoutList from '#libs/payment/components/PayoutList.component';
// import StripeBalance from '#libs/payment/components/StripeBalance.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';

import type { PaymentMethod, Payout } from '#libs/payment/types';
import type {
  PlatformInvoice,
  PlatformSubscription,
} from '#libs/platform-billing/type';
import { UpsellPackage } from '#libs/company/types';
import UpsellPackageSubscriptionDrawer from '#libs/platform-billing/components/UpsellPackageSubscriptionDrawer.component';

const { trackFormAdd, trackFormSubmitIntent, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellSubscription,
  );

type Props = {
  loading: boolean;
  savedPaymentMethodList: Array<PaymentMethod>;
  platformInvoiceList: Array<PlatformInvoice>;
  requestSetupIntentSecret: () => void;

  fetchPlatformInvoiceList: () => void;
  fetchPaymentMethodList: () => void;

  retrievePlatformSubscription: (s: string) => void;
  retrievePlatformBillingGroup: (s: string) => void;
  fetchPlatformBillingPlanList: () => void;
  fetchPlatformBillingStageList: () => void;
  fetchUpsellPackages: () => void;
  fetchUpsellPackageSubscribedIds: () => void;
  // fetchStripeBalance: () => void,

  classes: ClassNameMap;
  t: TFunction;
  platformSubscription?: PlatformSubscription;
  onRequestUpsell: (upsellIdentifier: number) => void;

  openFeatureRequest: boolean;
  setOpenFeatureRequest: (b: boolean) => void;

  fetchPayoutList: (options?: { page?: number }) => void;
  hasMorePayout: boolean;
  payoutList: Array<Payout>;
  payoutLoading: boolean;
  onOpenInvoice: (uuid: string) => void;

  checkSubscriptionSetup: () => void;
  payNowInvoice: (payment_backend_id: string) => void;
  setPaymentMethodAsDefault: (data: {
    payment_backend_payment_method_id: string;
    as_company: boolean;
  }) => void;
  // stripeBalanceAvailable: number,
  // stripeBalancePending: number,
  // stripeBalanceLoading: boolean,
  subscribeUpsellPackage: (
    upsellIdentifier: number,
    options?: OptionCallback,
  ) => void;

  subscribedUpsellPackages: UpsellPackage[];
  nonSubscribedUpsellPackages: UpsellPackage[];
};

type State = {
  openSubscribeModal: boolean;
  selectedUpsellPackage: UpsellPackage | null;
  openConfirmationDialog: boolean;
  upsellSubscriptionLoading: boolean;
};

export class PlatformBillingSettings extends React.Component<Props, State> {
  state: State = {
    openSubscribeModal: false,
    selectedUpsellPackage: null,
    openConfirmationDialog: false,
    upsellSubscriptionLoading: false,
  };

  componentDidMount() {
    this.props.fetchPaymentMethodList();
    this.props.fetchPlatformInvoiceList();
    this.props.retrievePlatformSubscription('me');
    this.props.retrievePlatformBillingGroup('me');
    this.props.fetchPlatformBillingPlanList();
    this.props.fetchPlatformBillingStageList();
    this.props.fetchUpsellPackages();
    this.props.fetchUpsellPackageSubscribedIds();
    this.props.fetchPayoutList({ page: 1 });
    // this.props.fetchStripeBalance();
  }

  handleOpenSubscriptionForm = (upsellPackage: UpsellPackage) => {
    this.setState({
      openSubscribeModal: true,
      selectedUpsellPackage: upsellPackage,
    });
    trackFormAdd(upsellPackage.id);
  };

  handleSubscribeUpsellPackage = (upsellPackage: UpsellPackage) => {
    trackFormSubmitIntent(upsellPackage.id);
    this.setState({ upsellSubscriptionLoading: true });
    this.props.subscribeUpsellPackage(upsellPackage.id, {
      onSuccess: () => {
        trackFormSuccess(upsellPackage.id);
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
        this.setState({ openConfirmationDialog: true });
      },
      onError: () => {
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
      },
    });
  };

  handleCloseSubscriptionForm = () => {
    this.setState({ openSubscribeModal: false });
  };

  handleCloseConfirmationModal = () =>
    this.setState({ openConfirmationDialog: false });

  finalizePaymentMethodChange = (stripeSetupIntentCallResult: any) => {
    const paymentMethodId = stripeSetupIntentCallResult?.setupIntent
      ?.payment_method as string;

    if (paymentMethodId) {
      this.props.setPaymentMethodAsDefault({
        payment_backend_payment_method_id: paymentMethodId,
        as_company: true,
      });
    }
    this.props.checkSubscriptionSetup();
  };

  render() {
    const { loading, classes } = this.props;
    if (loading) {
      return <BackofficeLinearProgress />;
    }

    return (
      <div className={classes.container}>
        <Grid container className={classes.container} direction="row">
          <Grid item className={classes.leftColumn} md={6} xs={12}>
            <PayoutList
              fetchMorePayoutList={this.props.fetchPayoutList}
              hasMorePayout={this.props.hasMorePayout}
              loading={this.props.payoutLoading}
              openInvoice={this.props.onOpenInvoice}
              payoutList={this.props.payoutList}
            />
          </Grid>
          {/* <Grid item xs={12} md={6} className={classes.leftColumn}>
            <StripeBalance
              stripeBalanceAvailable={this.props.stripeBalanceAvailable}
              stripeBalancePending={this.props.stripeBalancePending}
              stripeBalanceLoading={this.props.stripeBalanceLoading}
            />
          </Grid> */}
        </Grid>
        <CompanyPlatformBillingPaymentDetail
          defaultCurrencyDisplay={
            this.props.platformSubscription?.default_currency_display
          }
          fetchMorePlatformInvoiceList={this.props.fetchPlatformInvoiceList}
          onCollectPaymentMethodSuccess={this.finalizePaymentMethodChange}
          paymentMethodList={this.props.savedPaymentMethodList}
          payNowInvoice={this.props.payNowInvoice}
          platformInvoiceList={this.props.platformInvoiceList}
          refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
        />
        <CompanyPlatformBillinGroupDetail
          handleSubscribe={this.handleOpenSubscriptionForm}
          nonSubscribedUpsellPackages={this.props.nonSubscribedUpsellPackages}
          onKnowMore={this.props.onRequestUpsell}
          platformSubscription={this.props.platformSubscription}
          subscribedUpsellPackages={this.props.subscribedUpsellPackages}
        />
        <FeatureRequestDialog
          onClose={() => this.props.setOpenFeatureRequest(false)}
          open={this.props.openFeatureRequest}
        />

        <UpsellPackageSubscriptionDrawer
          loading={this.state.upsellSubscriptionLoading}
          onClose={this.handleCloseSubscriptionForm}
          onCloseDialog={this.handleCloseConfirmationModal}
          onKnowMore={this.props.onRequestUpsell}
          onSubscribe={this.handleSubscribeUpsellPackage}
          open={this.state.openSubscribeModal}
          openDialog={this.state.openConfirmationDialog}
          upsellPackage={this.state.selectedUpsellPackage}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  isEmpty: {
    marginTop: theme.spacing(4),
  },
  container: {
    padding: theme.spacing(4),
  },
  leftColumn: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['platformBilling']),
  withStyles(styles),
  connect(
    (state: RootState) => ({
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      platformInvoiceList: getPlatformInvoiceList(state),
      loading: state.paymentBackend.paymentMethod.loading,
      platformSubscription: getPlatformSubscription(state),
      payoutList: getPayoutList(state),
      hasMorePayout: !!state.paymentBackend.payout.nextPage,
      payoutLoading: state.paymentBackend.payout.loading,
      // stripeBalanceAvailable: state.paymentBackend.balance.amountAvailable,
      // stripeBalancePending: state.paymentBackend.balance.amountPending,
      // stripeBalanceLoading: state.paymentBackend.balance.isLoading,
      subscribedUpsellPackages: getSubscribedUpsellPackages(state),
      nonSubscribedUpsellPackages: getNonSubscribedUpsellPackages(state),
    }),
    {
      fetchPlatformInvoiceList: fetchPlatformInvoiceListAction,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      retrievePlatformSubscription,
      retrievePlatformBillingGroup,
      fetchPlatformBillingPlanList,
      fetchPlatformBillingStageList,
      // fetchStripeBalance: fetchStripeBalanceAction,
      fetchUpsellPackages: fetchUpsellPackagesAction,
      fetchUpsellPackageSubscribedIds: fetchUpsellPackageSubscribedIdsAction,
      checkSubscriptionSetup: checkSubscriptionSetupAction,
      setPaymentMethodAsDefault: setPaymentMethodAsDefaultAction,
      requestUpsellPackage: requestUpsellPackageAction,
      fetchCompanyTheme: fetchCompanyThemeAction,
      fetchPayoutList: fetchPayoutListAction,
      payNowInvoice: payNowInvoiceAction,
      push: pushAction,
      subscribeUpsellPackage: subscribeUpsellPackageAction,
    },
  ),
  withState('openFeatureRequest', 'setOpenFeatureRequest', false),
  withHandlers({
    onOpenInvoice:
      ({ push }) =>
      (uuid: UniqueIdentifier) =>
        push(`/invoice/${uuid}`),
    checkSubscriptionSetup:
      ({ checkSubscriptionSetup, fetchCompanyTheme }) =>
      () => {
        checkSubscriptionSetup({
          onSuccess: fetchCompanyTheme,
        });
      },
    payNowInvoice:
      ({ payNowInvoice, fetchPlatformInvoiceList }) =>
      (payment_backend_id: number, options: OptionCallback) =>
        payNowInvoice(payment_backend_id, {
          onError: options && options.onError,
          onSuccess: () => {
            fetchPlatformInvoiceList();
            if (options && options.onSuccess) {
              options.onSuccess();
            }
          },
        }),
    fetchPayoutList:
      ({ fetchPayoutList }) =>
      (params: any, options: OptionCallback) =>
        fetchPayoutList({ ...(params || {}), page_size: 3 }, options),
    requestSetupIntentSecret: () => () =>
      requestSetupIntentSecretAPI(null, null, true),
    fetchPaymentMethodList:
      ({ fetchPaymentMethodList }) =>
      () =>
        fetchPaymentMethodList({ as_company: true }),
    /*
    onKnowMore: () => (readable_identifier) => {
      window.Intercom('trackEvent', 'Upsell info requested', {
        readable_identifier,
      });
    },
    */
    onRequestUpsell:
      ({ requestUpsellPackage, setOpenFeatureRequest }) =>
      (upsellIdentifier: number) => {
        setOpenFeatureRequest(true);
        requestUpsellPackage(upsellIdentifier);
      },
  }),
)(PlatformBillingSettings);
