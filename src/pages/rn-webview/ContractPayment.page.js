import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withHandlers, compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';

import { requestSetupIntentSecretNoAuth as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import asyncComponent from '../../AsyncComponent';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList } from '../../libs/payment/actions';
import {
  fetchContractDetail,
  registerContractBackground,
} from '../../libs/subscription/actions';
import { getContract } from '../../libs/subscription/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { parseQueryString } from '../../http';
import themeSelectors from '../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import Analytics from '../../components/analytics/Analytics.component';

const SubscriptionPayment = asyncComponent(() =>
  import('../../libs/subscription/components/SubscriptionPayment.component'),
);

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
  registerContractBackground: (
    id: number,
    data: any,
    options: OptionCallback,
    auth: boolean,
  ) => void,
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

  onSubmit = async (
    _, // forced to null and unused on this screen
    payment_method_id: string,
    __,
    ___,
    options: any,
    coupon_code: string | null,
  ) => {
    this.setState({ processing: true });
    const first_billing_timestamp = moment(
      this.props.date,
      'YYYY-MM-DD',
    ).unix();
    this.props.registerContractBackground(
      this.props.contractId,
      {
        first_billing_timestamp,
        member: this.props.memberId,
        payment_method_id,
        is_v2: true,
        coupon: coupon_code,
        with_prorata: !!this.props.contract?.month_billing_day,
      },
      {
        onBackgroundSuccess: () => {
          this.props.onSuccess();
          try {
            Analytics.contractPaymentSuccess(this.props.contract);
          } catch (err) {
            console.error(err);
          }
          this.setState({ processing: false });
        },
        onError: () => this.setState({ processing: false }),
        onBackgroundError: () => this.setState({ processing: false }),
      },
      true,
    );
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
          withCoupon
          cardBillingDetailsMandatory={
            this.props.companyTheme.force_billing_details_on_cards
          }
          contract={this.props.contract}
          enabledPaymentGroupMethodIdentifier={
            this.props.companyTheme.payment_method_available_subscription
          }
          isExcludingTax={this.state.theme?.is_tax_excluded_in_marketplace}
          memberId={this.props.memberId}
          onCancel={this.props.onCancel}
          onSubmit={this.onSubmit}
          processing={this.state.processing}
          refreshSavedPaymentMethodList={() => {
            this.props.fetchPaymentMethodList({ member: this.props.memberId });
          }}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
          savedPaymentMethodList={this.props.savedPaymentMethodList}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
    minHeight: '100vh',
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
      registerContractBackground,
    },
  ),
  withHandlers({
    requestSetupIntentSecret:
      ({ memberId }) =>
      () =>
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
