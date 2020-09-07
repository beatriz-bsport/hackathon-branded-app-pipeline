// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { fetchPlatformInvoiceList } from '../../libs/platform-billing/actions';
import { getPlatformInvoiceList } from '../../libs/platform-billing/selectors';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import CompanyPlatformBillingDetail from '../../libs/platform-billing/components/CompanyPlatformBillingDetail.component';

type Props = {
  loading: boolean,
  savedPaymentMethodList: Array<PaymentMethod>,
  platformInvoiceList: Array<PlatformInvoice>,
  requestSetupIntentSecret: () => void,

  fetchPlatformInvoiceList: () => void,
  fetchPaymentMethodList: () => void,
};

export class PlatformBillingSettings extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentMethodList();
    this.props.fetchPlatformInvoiceList();
  }

  render() {
    if (this.props.loading) {
      return <BackofficeLinearProgress />;
    }
    return (
      <CompanyPlatformBillingDetail
        paymentMethodList={this.props.savedPaymentMethodList}
        platformInvoiceList={this.props.platformInvoiceList}
        refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
        requestSetupIntentSecret={this.props.requestSetupIntentSecret}
      />
    );
  }
}

const styles = () => ({
  container: {},
});

export default compose(
  withTranslation(),
  withStyles(styles),
  connect(
    (state) => ({
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      platformInvoiceList: getPlatformInvoiceList(state),
      loading: state.paymentBackend.paymentMethod.loading,
    }),
    {
      fetchPlatformInvoiceList,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret: () => () =>
      requestSetupIntentSecretAPI(null, null, true),
    fetchPaymentMethodList: ({ fetchPaymentMethodList }) => () =>
      fetchPaymentMethodList({ as_company: true }),
  }),
)(PlatformBillingSettings);
