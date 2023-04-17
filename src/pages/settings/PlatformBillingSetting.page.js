// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { push } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';

import {
  fetchPlatformInvoiceList as fetchPlatformInvoiceListAction,
  payNowInvoice as payNowInvoiceAction,
  fetchPlatformBillingPlanList,
  fetchPlatformBillingStageList,
  retrievePlatformSubscription,
  retrievePlatformBillingGroup,
  fetchUpsellPackageList,
  fetchUpsellPackageSubscribedList,
  requestUpsellPackage as requestUpsellPackageAction,
  checkPlatformSubscriptionSetup as checkSubscriptionSetupAction,
} from '#libs/platform-billing/actions';
import {
  getPlatformInvoiceList,
  getPlatformSubscription,
} from '#libs/platform-billing/selectors';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  fetchPayoutList as fetchPayoutListAction,
  fetchStripeBalance as fetchStripeBalanceAction,
  setPaymentMethodAsDefault as setPaymentMethodAsDefaultAction,
} from '#libs/payment/actions';
import {
  getSavedPaymentMethodList,
  getPayoutList,
} from '#libs/payment/selectors';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import CompanyPlatformBillingPaymentDetail from '#libs/platform-billing/components/CompanyPlatformBillingPaymentDetail.component';
import CompanyPlatformBillinGroupDetail from '#libs/platform-billing/components/CompanyPlatformBillingGroupDetail.component';
import FeatureRequestDialog from '#libs/platform-billing/components/FeatureRequestDialog.component';
import PayoutList from '#libs/payment/components/PayoutList.component';
import StripeBalance from '#libs/payment/components/StripeBalance.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';

type Props = {
  loading: boolean,
  savedPaymentMethodList: Array<PaymentMethod>,
  platformInvoiceList: Array<PlatformInvoice>,
  requestSetupIntentSecret: () => void,

  fetchPlatformInvoiceList: () => void,
  fetchPaymentMethodList: () => void,

  retrievePlatformSubscription: (string) => void,
  retrievePlatformBillingGroup: (string) => void,
  fetchPlatformBillingPlanList: () => void,
  fetchPlatformBillingStageList: () => void,
  fetchUpsellPackageList: () => void,
  fetchStripeBalance: () => void,

  classes: Object,
  platformSubscription: ?PlatformSubscription,
  onRequestUpsell: (upsellIdentifier: number) => void,

  openFeatureRequest: boolean,
  setOpenFeatureRequest: (boolean) => void,

  fetchPayoutList: () => void,
  hasMorePayout: boolean,
  payoutList: Array<Payout>,
  payoutLoading: boolean,
  onOpenInvoice: (uuid: string) => void,

  checkSubscriptionSetup: () => void,
  payNowInvoice: (payment_backend_id: string) => void,
  setPaymentMethodAsDefault: (data: {
    payment_method_id: string,
    as_company: boolean,
  }) => void,
  stripeBalanceAvailable: number,
  stripeBalancePending: number,
  stripeBalanceLoading: boolean,
};

export class PlatformBillingSettings extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentMethodList();
    this.props.fetchPlatformInvoiceList();
    this.props.retrievePlatformSubscription('me');
    this.props.retrievePlatformBillingGroup('me');
    this.props.fetchPlatformBillingPlanList();
    this.props.fetchPlatformBillingStageList();
    this.props.fetchUpsellPackageList();
    this.props.fetchPayoutList({ page: 1 });
    this.props.fetchStripeBalance();
  }

  finalizePaymentMethodChange = (stripeSetupIntentCallResult: any) => {
    const paymentMethodId =
      stripeSetupIntentCallResult?.setupIntent?.payment_method;

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
        <Grid direction="row" container className={classes.container}>
          <Grid item xs={12} md={6} className={classes.leftColumn}>
            <PayoutList
              fetchMorePayoutList={this.props.fetchPayoutList}
              payoutList={this.props.payoutList}
              loading={this.props.payoutLoading}
              hasMorePayout={this.props.hasMorePayout}
              openInvoice={this.props.onOpenInvoice}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.leftColumn}>
            <StripeBalance
              stripeBalanceAvailable={this.props.stripeBalanceAvailable}
              stripeBalancePending={this.props.stripeBalancePending}
              stripeBalanceLoading={this.props.stripeBalanceLoading}
            />
          </Grid>
        </Grid>
        <CompanyPlatformBillingPaymentDetail
          payNowInvoice={this.props.payNowInvoice}
          paymentMethodList={this.props.savedPaymentMethodList}
          platformInvoiceList={this.props.platformInvoiceList}
          refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
          onCollectPaymentMethodSuccess={this.finalizePaymentMethodChange}
          fetchMorePlatformInvoiceList={this.props.fetchPlatformInvoiceList}
          defaultCurrencyDisplay={
            this.props.platformSubscription?.default_currency_display
          }
        />
        <CompanyPlatformBillinGroupDetail
          platformSubscription={this.props.platformSubscription}
          onRequestUpsell={this.props.onRequestUpsell}
          onKnowMore={this.props.onRequestUpsell}
        />
        <FeatureRequestDialog
          open={this.props.openFeatureRequest}
          onClose={() => this.props.setOpenFeatureRequest(false)}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
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
    (state) => ({
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      platformInvoiceList: getPlatformInvoiceList(state),
      loading: state.paymentBackend.paymentMethod.loading,
      platformSubscription: getPlatformSubscription(state),
      payoutList: getPayoutList(state),
      hasMorePayout: !!state.paymentBackend.payout.nextPage,
      payoutLoading: state.paymentBackend.payout.loading,
      stripeBalanceAvailable: state.paymentBackend.balance.amountAvailable,
      stripeBalancePending: state.paymentBackend.balance.amountPending,
      stripeBalanceLoading: state.paymentBackend.balance.isLoading,
    }),
    {
      fetchPlatformInvoiceList: fetchPlatformInvoiceListAction,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      retrievePlatformSubscription,
      retrievePlatformBillingGroup,
      fetchPlatformBillingPlanList,
      fetchPlatformBillingStageList,
      fetchStripeBalance: fetchStripeBalanceAction,
      fetchUpsellPackageList,
      fetchUpsellPackageSubscribedList,
      checkSubscriptionSetup: checkSubscriptionSetupAction,
      setPaymentMethodAsDefault: setPaymentMethodAsDefaultAction,
      requestUpsellPackage: requestUpsellPackageAction,
      fetchCompanyTheme: fetchCompanyThemeAction,
      fetchPayoutList: fetchPayoutListAction,
      payNowInvoice: payNowInvoiceAction,
      onOpenInvoice: (uuid) => push(`/invoice/${uuid}`),
    },
  ),
  withState('openFeatureRequest', 'setOpenFeatureRequest', false),
  withHandlers({
    checkSubscriptionSetup:
      ({ checkSubscriptionSetup, fetchCompanyTheme }) =>
      () => {
        checkSubscriptionSetup({
          onSuccess: fetchCompanyTheme,
        });
      },
    payNowInvoice:
      ({ payNowInvoice, fetchPlatformInvoiceList }) =>
      (payment_backend_id, options) =>
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
      (params, options) =>
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
        window.Intercom('trackEvent', 'Upsell feature requested', {
          upsellIdentifier,
        });
      },
  }),
)(PlatformBillingSettings);
