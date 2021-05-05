// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { push } from 'connected-react-router';
import {
  fetchPlatformInvoiceList,
  fetchPlatformBillingPlanList,
  fetchPlatformBillingStageList,
  retrievePlatformSubscription,
  retrievePlatformBillingGroup,
  fetchUpsellPackageList,
  fetchUpsellPackageSubscribedList,
  requestUpsellPackage as requestUpsellPackageAction,
  checkPlatformSubscriptionSetup as checkSubscriptionSetupAction,
} from '../../libs/platform-billing/actions';
import {
  getPlatformInvoiceList,
  getPlatformSubscription,
} from '../../libs/platform-billing/selectors';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  fetchPayoutList as fetchPayoutListAction,
} from '../../libs/payment/actions';
import {
  getSavedPaymentMethodList,
  getPayoutList,
} from '../../libs/payment/selectors';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import CompanyPlatformBillingPaymentDetail from '../../libs/platform-billing/components/CompanyPlatformBillingPaymentDetail.component';
import CompanyPlatformBillinGroupDetail from '../../libs/platform-billing/components/CompanyPlatformBillingGroupDetail.component';
import FeatureRequestDialog from '../../libs/platform-billing/components/FeatureRequestDialog.component';
import PayoutList from '../../libs/payment/components/PayoutList.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';

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

  classes: Object,
  platformSubscription: ?PlatformSubscription,
  onRequestUpsell: (id: number) => void,

  openFeatureRequest: boolean,
  setOpenFeatureRequest: (boolean) => void,

  fetchPayoutList: () => void,
  hasMorePayout: boolean,
  payoutList: Array<Payout>,
  payoutLoading: boolean,
  onOpenInvoice: (uuid: string) => void,

  checkSubscriptionSetup: () => void,
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
  }

  render() {
    const { loading, classes } = this.props;
    if (loading) {
      return <BackofficeLinearProgress />;
    }
    return (
      <div className={classes.container}>
        <PayoutList
          fetchMorePayoutList={this.props.fetchPayoutList}
          payoutList={this.props.payoutList}
          loading={this.props.payoutLoading}
          hasMorePayout={this.props.hasMorePayout}
          openInvoice={this.props.onOpenInvoice}
        />
        <CompanyPlatformBillingPaymentDetail
          paymentMethodList={this.props.savedPaymentMethodList}
          platformInvoiceList={this.props.platformInvoiceList}
          refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
          onCollectPaymentMethodSuccess={this.props.checkSubscriptionSetup}
          fetchMorePlatformInvoiceList={this.props.fetchPlatformInvoiceList}
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
    }),
    {
      fetchPlatformInvoiceList,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      retrievePlatformSubscription,
      retrievePlatformBillingGroup,
      fetchPlatformBillingPlanList,
      fetchPlatformBillingStageList,
      fetchUpsellPackageList,
      fetchUpsellPackageSubscribedList,
      checkSubscriptionSetup: checkSubscriptionSetupAction,
      requestUpsellPackage: requestUpsellPackageAction,
      fetchCompanyTheme: fetchCompanyThemeAction,
      fetchPayoutList: fetchPayoutListAction,
      onOpenInvoice: (uuid) => push(`/invoice/${uuid}`),
    },
  ),
  withState('openFeatureRequest', 'setOpenFeatureRequest', false),
  withHandlers({
    checkSubscriptionSetup: ({
      checkSubscriptionSetup,
      fetchCompanyTheme,
    }) => () => {
      checkSubscriptionSetup({
        onSuccess: fetchCompanyTheme,
      });
    },
    fetchPayoutList: ({ fetchPayoutList }) => (params, options) =>
      fetchPayoutList({ ...(params || {}), page_size: 3 }, options),
    requestSetupIntentSecret: () => () =>
      requestSetupIntentSecretAPI(null, null, true),
    fetchPaymentMethodList: ({ fetchPaymentMethodList }) => () =>
      fetchPaymentMethodList({ as_company: true }),
    /*
    onKnowMore: () => (readable_identifier) => {
      window.Intercom('trackEvent', 'Upsell info requested', {
        readable_identifier,
      });
    },
    */
    onRequestUpsell: ({ requestUpsellPackage, setOpenFeatureRequest }) => (
      readable_identifier,
    ) => {
      setOpenFeatureRequest(true);
      requestUpsellPackage(readable_identifier);
      window.Intercom('trackEvent', 'Upsell feature requested', {
        readable_identifier,
      });
    },
  }),
)(PlatformBillingSettings);
