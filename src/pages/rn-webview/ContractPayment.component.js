// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withHandlers, compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';

import { requestSetupIntentSecretNoAuth as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList } from '../../libs/payment/actions';
import { fetchContractDetail } from '../../libs/subscription/actions';
import { getContract } from '../../libs/subscription/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { parseQueryString } from '../../http';
import themeSelectors from '../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';
import { postContractSubscriptionUnauthenticated as postContractSubscriptionUnauthenticatedAPI } from '../../libs/subscription/api';
import Analytics from '../../components/analytics/Analytics.component';

type Props = {
  classes: Object,
  onSuccess: () => void,
  onCancel: () => void,
  date: string,
  memberId: number,
  contractId: number,
  fetchPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  requestSetupIntentSecret: () => void,
  contract: ?Contract,
  fetchContractDetail: (number) => void,
  companyTheme?: CompanyTheme,
  fetchCompanyTheme: (companyId: number) => void,
};

type State = {
  processing: boolean,
  companyId?: number,
  theme: CompanyTheme,
};

export class ContractPayment extends React.Component<Props, State> {
  state = {
    companyId: null,
    theme: null,
  };

  componentDidMount() {
    this.props.fetchContractDetail(this.props.contractId, {
      onSuccess: (c) => {
        this.setState({ companyId: c.company });
        this.props.fetchCompanyTheme(c.company, {
          onSuccess: (theme) =>
            this.setState({
              theme,
            }),
        });
      },
    });
  }

  state = { processing: false };

  onSubmit = async (_, payment_method_id: string) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.props.date,
        'YYYY-MM-DD',
      ).unix();
      await postContractSubscriptionUnauthenticatedAPI(this.props.contractId, {
        first_billing_timestamp,
        member: this.props.memberId,
        payment_method_id,
        is_v2: true,
      });
      this.props.onSuccess();
    } catch (err) {
      console.error(err);
    }
    try {
      Analytics.contractPaymentSuccess(this.props.contract);
    } catch (err) {
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
    if (!this.state.companyId || !this.state.theme) {
      return (
        <div className={this.props.classes.container}>
          <div className={this.props.classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    return (
      <div className={this.props.classes.container}>
        <SubscriptionPayment
          onCancel={this.props.onCancel}
          onSubmit={this.onSubmit}
          processing={this.state.processing}
          savedPaymentMethodList={this.props.savedPaymentMethodList}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
          withCoupon
          contract={this.props.contract}
          refreshSavedPaymentMethodList={() => {
            this.props.fetchPaymentMethodList({ member: this.props.memberId });
          }}
          enabledPaymentGroupMethodIdentifier={
            this.props.companyTheme.payment_method_available_subscription
          }
          memberId={this.props.memberId}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
  },
  loadingContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default compose(
  withRouter,
  withProps(({ location }) => ({
    date: parseQueryString(location.search).date,
    memberId: parseInt(parseQueryString(location.search).member, 10),
  })),
  withStyles(styles),
  routerParamsToProps({ contractId: 'contractId' }),
  connect(
    (state, { contractId }) => ({
      contract: getContract(state, parseInt(contractId, 10)),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      fetchContractDetail,
      fetchPaymentMethodList,
      fetchCompanyTheme,
    },
  ),
  withHandlers({
    requestSetupIntentSecret: ({ memberId }) => () =>
      requestSetupIntentSecretAPI(memberId),
  }),
  withProps(() => ({
    onSuccess: () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'succeeded' }),
      );
    },
    onCancel: () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'cancel' }),
      );
    },
  })),
)(ContractPayment);
