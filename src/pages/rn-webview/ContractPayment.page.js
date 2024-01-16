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
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#libs/establishment/actions';
import {
  updateDefaultEstablishmentBillingGroup as updateDefaultEstablishmentBillingGroupAction,
  fetchMember as fetchMemberAction,
} from '#libs/member/actions';
import {
  getDefaultEstablishmentBillingGroup,
  getEnabledEstablishmentBillingGroups,
} from '#libs/establishment/selectors';
import { withEstablishment } from '#libs/offer/selectors';
import { EstablishmentBillingGroup } from '#libs/establishment/types';

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
  memberId: number,
  defaultEstablishmentBillingGroup: EstablishmentBillingGroup,
  fetchMember: (memberId: number) => void,
  fetchAllEstablishmentBillingGroup: (params: { company: number }) => void,
  establishmentBillingGroups: EstablishmentBillingGroup[],
  updateDefaultEstablishmentBillingGroup: (
    id: number,
    memberData: FormData,
    options?: OptionCallback,
  ) => void,
};

type State = {
  processing: boolean,
  companyId?: number,
  theme: CompanyTheme,
  hideEstablishmentBillingGroupSelector: boolean,
};

export class ContractPayment extends React.Component<Props, State> {
  state = {
    companyId: null,
    theme: null,
    hideEstablishmentBillingGroupSelector: false,
  };

  componentDidMount() {
    this.props.fetchContractDetail(this.props.contractId, {
      onSuccess: (c) => {
        this.setState({ companyId: c.company });
        this.props.fetchCompanyTheme(c.company, {
          onSuccess: (theme) => {
            if (theme.enable_multi_localization) {
              this.props.fetchAllEstablishmentBillingGroup({
                params: { company: c.company },
              });
            }
            this.setState({
              theme,
            });
          },
        });
        this.props.fetchMember({
          onError: () => {
            this.setState({ hideEstablishmentBillingGroupSelector: true });
          },
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
    ____, // note
    establishmentBillingGroupId: number,
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
        establishment_billing_group_id: establishmentBillingGroupId,
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
          defaultBillingGroup={this.props.defaultEstablishmentBillingGroup}
          enabledPaymentGroupMethodIdentifier={
            this.props.companyTheme.payment_method_available_subscription
          }
          enableMultiLocalization={this.state.theme?.enable_multi_localization}
          establishmentBillingGroups={
            !this.state.hideEstablishmentBillingGroupSelector
              ? this.props.establishmentBillingGroups
              : []
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
          updateDefaultEstablishmentBillingGroup={
            this.props.updateDefaultEstablishmentBillingGroup
          }
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
    (state, { contractId, memberId }) => ({
      contract: getContract(state, parseInt(contractId, 10)),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      companyTheme: themeSelectors.getTheme(state),
      establishmentBillingGroups: withEstablishment(
        getEnabledEstablishmentBillingGroups,
      )(state),
      defaultEstablishmentBillingGroup: getDefaultEstablishmentBillingGroup(
        state,
        memberId,
      ),
    }),
    {
      fetchContractDetail,
      fetchPaymentMethodList,
      fetchCompanyTheme,
      registerContractBackground,
      fetchMember: fetchMemberAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchAllEstablishmentBillingGroup:
        fetchAllEstablishmentBillingGroupAction,
      updateDefaultEstablishmentBillingGroup:
        updateDefaultEstablishmentBillingGroupAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret:
      ({ memberId }) =>
      () =>
        requestSetupIntentSecretAPI(memberId),
    fetchMember:
      ({ fetchMember, memberId }) =>
      (options) =>
        fetchMember(memberId, options),
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
