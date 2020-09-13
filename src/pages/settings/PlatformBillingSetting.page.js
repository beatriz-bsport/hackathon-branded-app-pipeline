// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { withTranslation } from 'react-i18next';

import {
  fetchPlatformInvoiceList,
  fetchPlatformBillingPlanList,
  fetchPlatformBillingStageList,
  retrievePlatformSubscription,
  retrievePlatformBillingGroup,
  fetchUpsellPackageList,
  fetchUpsellPackageSubscribedList,
  requestUpsellPackage as requestUpsellPackageAction,
} from '../../libs/platform-billing/actions';
import {
  getPlatformInvoiceList,
  getPlatformBillingGroup,
  getPlatformSubscription,
} from '../../libs/platform-billing/selectors';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import CompanyPlatformBillingPaymentDetail from '../../libs/platform-billing/components/CompanyPlatformBillingPaymentDetail.component';
import CompanyPlatformBillinGroupDetail from '../../libs/platform-billing/components/CompanyPlatformBillingGroupDetail.component';
import FeatureRequestDialog from '../../libs/platform-billing/components/FeatureRequestDialog.component';

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
  platformBillingGroup: ?PlatformBillingPlanGroup,
  platformSubscription: ?PlatformSubscription,
  onRequestUpsell: (id: number) => void,

  openFeatureRequest: boolean,
  setOpenFeatureRequest: (boolean) => void,
  t: TFunction,
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
  }

  render() {
    const { loading, classes } = this.props;
    if (loading) {
      return <BackofficeLinearProgress />;
    }
    if (
      !loading &&
      !this.props.platformBillingGroup &&
      !this.props.platformSubscription
    ) {
      return (
        <div className={classes.isEmpty}>
          <Typography
            color="textSecondary"
            variant="h6"
            align="center"
            component="p"
          >
            {this.props.t('platformBillingGroup.soonAvailable')}
          </Typography>
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <CompanyPlatformBillingPaymentDetail
          paymentMethodList={this.props.savedPaymentMethodList}
          platformInvoiceList={this.props.platformInvoiceList}
          refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
        />
        <CompanyPlatformBillinGroupDetail
          platformSubscription={this.props.platformSubscription}
          platformBillingGroup={this.props.platformBillingGroup}
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
      platformBillingGroup: getPlatformBillingGroup(state),
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
      requestUpsellPackage: requestUpsellPackageAction,
    },
  ),
  withState('openFeatureRequest', 'setOpenFeatureRequest', false),
  withHandlers({
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
