import React from 'react';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { push as pushAction } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';

import type { Theme } from '@material-ui/core/styles';
import type { UniqueIdentifier } from '@dnd-kit/core';
import type { TFunction } from 'i18next';

import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
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
} from '#src/libs/platform-billing/actions';
import {
  getPlatformInvoiceList,
  getPlatformSubscription,
  getNonSubscribedUpsellPackages,
  getSubscribedUpsellPackages,
  // @ts-expect-error
} from '#src/libs/platform-billing/selectors';

import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  // fetchStripeBalance as fetchStripeBalanceAction,
  setPaymentMethodAsDefault as setPaymentMethodAsDefaultAction,
  fetchStripePayoutList as fetchStripePayoutListAction,
} from '#src/libs/payment/actions';
import {
  getSavedPaymentMethodList,
  getStripePayoutList,
} from '#src/libs/payment/selectors';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
// @ts-expect-error
import CompanyPlatformBillingPaymentDetail from '#src/libs/platform-billing/components/CompanyPlatformBillingPaymentDetail.component';
import CompanyPlatformBillinGroupDetail from '#src/libs/platform-billing/components/CompanyPlatformBillingGroupDetail.component';
import FeatureRequestDialog from '#src/libs/platform-billing/components/FeatureRequestDialog.component';
import PayoutList from '#src/libs/payment/components/PayoutList.component';
import { getFeatureList } from '#src/libs/company/actions';
// import StripeBalance from '#src/libs/payment/components/StripeBalance.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';

import type {
  PlatformInvoice,
  PlatformSubscription,
} from '#src/libs/platform-billing/type';
import type { PaymentMethod, StripePayout } from '#src/libs/payment/types';
import type { FeatureList, UpsellPackage } from '#src/libs/company/types';
import UpsellPackageSubscriptionDrawer from '#src/libs/platform-billing/components/UpsellPackageSubscriptionDrawer.component';
import { getTheme } from '#src/libs/theme/selectors';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';
import type { CompanyTheme } from '#src/libs/theme/types';

const { trackFormAdd, trackFormSubmitIntent, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellSubscription,
  );

const { trackFormSubmitIntent: trackFormSubmitIntentUpsellRequest } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellRequest,
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
  onCloseFeatureRequest: () => void;
  openFeatureRequest: boolean;
  setOpenFeatureRequest: (b: boolean) => void;

  fetchStripePayoutList: () => void;
  hasMorePayout: boolean;
  stripePayoutList: Array<StripePayout>;
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
  theme: CompanyTheme;
  fetchFeatureList: (options?: OptionCallback<FeatureList>) => void;
};

type State = {
  openSubscribeModal: boolean;
  selectedUpsellPackage: UpsellPackage | null;
  openConfirmationDialog: boolean;
  upsellSubscriptionLoading: boolean;
};

export class PlatformBillingSetting extends React.Component<Props, State> {
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
    // this.props.fetchStripeBalance();
    this.props.fetchStripePayoutList();
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
        this.props.fetchFeatureList();
      },
      onError: () => {
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
      },
    });
  };

  handleRequestUpsell = (upsellIdentifier: number, sourceComponent: string) => {
    trackFormSubmitIntentUpsellRequest(upsellIdentifier, {
      source_component: sourceComponent,
    });
    this.props.onRequestUpsell(upsellIdentifier);
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

    const isOnlinePaymentEnabled: boolean =
      this.props.theme.online_payment_enabled;

    const handleRequestUpsellInPage = (upsell_identifier: number) =>
      this.handleRequestUpsell(
        upsell_identifier,
        'CompanyPlatformBillingGroupDetail',
      );

    const handleRequestUpsellInDrawer = (upsell_identifier: number) =>
      this.handleRequestUpsell(
        upsell_identifier,
        'UpsellPackageSubscriptionDrawer',
      );

    if (loading) {
      return <BackofficeLinearProgress />;
    }

    return (
      <div className={classes.container}>
        {isOnlinePaymentEnabled && (
          <Grid container direction="row">
            <Grid item className={classes.leftColumn} md={6} xs={12}>
              <PayoutList
                fetchMorePayoutList={this.props.fetchStripePayoutList}
                hasMorePayout={this.props.hasMorePayout}
                loading={this.props.payoutLoading}
                openInvoice={this.props.onOpenInvoice}
                stripePayoutList={this.props.stripePayoutList}
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
        )}
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
          onKnowMore={handleRequestUpsellInPage}
          platformSubscription={this.props.platformSubscription}
          subscribedUpsellPackages={this.props.subscribedUpsellPackages}
        />
        <FeatureRequestDialog
          onClose={this.props.onCloseFeatureRequest}
          open={this.props.openFeatureRequest}
        />

        <UpsellPackageSubscriptionDrawer
          loading={this.state.upsellSubscriptionLoading}
          onClose={this.handleCloseSubscriptionForm}
          onCloseDialog={this.handleCloseConfirmationModal}
          onKnowMore={handleRequestUpsellInDrawer}
          onSubscribe={this.handleSubscribeUpsellPackage}
          open={this.state.openSubscribeModal}
          openDialog={this.state.openConfirmationDialog}
          upsellPackage={this.state.selectedUpsellPackage}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    isEmpty: {
      marginTop: theme.spacing(4),
    },
    container: {
      padding: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
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
      stripePayoutList: getStripePayoutList(state),
      hasMorePayout: !!state.paymentBackend.stripePayout.hasMore,
      payoutLoading: state.paymentBackend.stripePayout.loading,
      // stripeBalanceAvailable: state.paymentBackend.balance.amountAvailable,
      // stripeBalancePending: state.paymentBackend.balance.amountPending,
      // stripeBalanceLoading: state.paymentBackend.balance.isLoading,
      subscribedUpsellPackages: getSubscribedUpsellPackages(state),
      nonSubscribedUpsellPackages: getNonSubscribedUpsellPackages(state),
      theme: getTheme(state),
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
      fetchStripePayoutList: fetchStripePayoutListAction,
      payNowInvoice: payNowInvoiceAction,
      push: pushAction,
      subscribeUpsellPackage: subscribeUpsellPackageAction,
      fetchFeatureList: getFeatureList,
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
    fetchStripePayoutList:
      ({ fetchStripePayoutList }) =>
      (params: any, options: OptionCallback) =>
        fetchStripePayoutList({ ...(params || {}), page_size: 3 }, options),
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
        // @ts-expect-error
        window.Intercom?.('showNewMessage');
        requestUpsellPackage(upsellIdentifier);
      },
    onCloseFeatureRequest:
      ({ setOpenFeatureRequest }) =>
      () => {
        setOpenFeatureRequest(false);
        // @ts-expect-error
        window.Intercom?.('hide');
      },
  }),
)(PlatformBillingSetting);
