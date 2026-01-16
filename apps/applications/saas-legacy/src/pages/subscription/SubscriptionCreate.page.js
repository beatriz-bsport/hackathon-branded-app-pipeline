// @flow
import React, { Component } from 'react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter, goBack } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import { fetchStripeReaders } from '#src/libs/terminal/actions';
import { getStripeReaders } from '#src/libs/terminal/selectors';
import type { StripeReader } from '#src/libs/terminal/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withFetchDetail from '../../hocs/with-fetch-details.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import api from '../../libs/subscription/api';
import { fetchMember } from '../../libs/member/actions';
import { getMember } from '../../libs/member/selectors';
import SubscriptionCreateComponent from '../../libs/subscription/components/SubscriptionCreate.component';
import SubscriptionScheduleChecker from '../../libs/subscription/components/SubscriptionScheduleChecker.component';
import type { SubscriptionData } from '../../libs/subscription/types';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';

import type { Member } from '../../libs/member/types';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { PrivatePass } from '../../libs/private-service/types';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import { getAvailablePaymentComboList } from '#src/libs/payment-combo/selectors';
import { PaymentCombo } from '../../libs/payment-combo/types';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '../../libs/payment-packs/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
} from '../../libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
  getStaffEstablishmentBillingGroupSelector,
} from '../../libs/establishment/selectors';
import type { EstablishmentBillingGroup } from '../../libs/establishment/types';
import type { Theme as CompanyTheme } from '../../libs/theme/types';
import themeSelectors from '../../libs/theme/selectors';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';
import { fetchCompanyUserRoles } from '../../libs/role/actions';

type Props = {
  member: Member,
  onCancel: () => void,
  paymentPacks: Array<PaymentPack>,
  pushToSubscription: (id: number) => void,
  classes: Object,
  fetchPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  requestSetupIntentSecret: () => void,
  fetchPrivatePassList: () => void,
  privatePassList: PrivatePass[],
  fetchPaymentComboList: () => void,
  paymentComboList: PaymentCombo[],
  fetchPaymentPackList: (params: any) => void,
  fetchEstablishments: () => void,
  fetchAllEstablishmentBillingGroup: (params: { company: number }) => void,
  establishmentBillingGroups: EstablishmentBillingGroup[],
  companyTheme: CompanyTheme,
  fetchStripeReaders: () => void,
  stripeReaders: StripeReader[],
  companyId: number,
  onlinePaymentEnabled: boolean,
  staffDefaultEstablishmentBillingGroup: EstablishmentBillingGroup | null,
  fetchCompanyUserRoles: () => void,
};
type State = {
  tempSubscription?: SubscriptionData,
  processing: boolean,
};

export class SubscriptionCreate extends Component<Props, State> {
  state: State = {
    tempSubscription: null,
    processing: false,
  };

  componentDidMount() {
    this.props.fetchPaymentPackList({ page_size: 70000, disabled: false });
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchEstablishments();
    this.props.fetchStripeReaders();
    // @debt(3, 2, 2): Replace with /role/me to avoid fetching all roles.
    this.props.fetchCompanyUserRoles();
    if (this.props.companyTheme.enable_multi_localization) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.companyId },
      });
    }
  }

  storeTempSubscription = (tempSubscription?: SubscriptionData) => {
    this.setState({ tempSubscription });
  };

  createSubscription = async (
    _,
    payment_method_id: string,
    is_payment_method_for_past_invoices_saved: boolean,
    payment_method_past_invoices_id: String,
    _callback,
    _voucher,
    _note,
    establishment_billing_group_id?: number,
  ) => {
    this.setState({ processing: true });
    try {
      const response = await api.createFromPack({
        ...this.state.tempSubscription,
        stripe_source: null,
        payment_method_id,
        is_payment_method_for_past_invoices_saved,
        payment_method_past_invoices_id,
        establishment_billing_group_id,
      });
      this.props.pushToSubscription(response.data.id);
    } catch (err) {
      console.error(err);
      this.setState({ processing: false });
    }
    this.setState({ processing: false });
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.state.processing ? <LinearProgress /> : null}
        {this.state.tempSubscription ? (
          <SubscriptionScheduleChecker
            companyId={this.props.companyId}
            companyTheme={this.props.companyTheme}
            defaultBillingGroup={
              this.props.staffDefaultEstablishmentBillingGroup
            }
            enableMultiLocalization={
              this.props.companyTheme.enable_multi_localization
            }
            establishmentBillingGroups={this.props.establishmentBillingGroups}
            member={this.props.member}
            onCancel={() => this.storeTempSubscription(null)}
            onlinePaymentEnabled={this.props.onlinePaymentEnabled}
            onSubmit={this.createSubscription}
            processing={this.state.processing}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            stripeReaders={this.props.stripeReaders || []}
            subscriptionData={this.state.tempSubscription}
          />
        ) : (
          <Paper className={this.props.classes.paper}>
            <div className={this.props.classes.formContainer}>
              <SubscriptionCreateComponent
                member={this.props.member}
                onCancel={this.props.onCancel}
                onSubmit={this.storeTempSubscription}
                paymentComboList={this.props.paymentComboList}
                paymentPacks={this.props.paymentPacks}
                privatePassList={this.props.privatePassList}
              />
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  paper: {
    maxWidth: 600,
    minWidth: '50wh',
  },
  formContainer: {
    padding: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({ memberId: 'memberId:number' }),
  withStyles(styles),
  withTranslation(['subscription']),
  withTitle(({ t }) => t('titles:subscription.subscriptionCreate')),
  connect(
    (state, { memberId }) => ({
      paymentPacks: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      paymentComboList: getAvailablePaymentComboList(state),
      memberLoading: state.member.loading,
      member: getMember(state, memberId),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      establishments: getAvailableEstablishmentList(state),
      companyTheme: themeSelectors.getTheme(state),
      companyId: themeSelectors.getTheme(state).company,
      stripeReaders: getStripeReaders(state),
      onlinePaymentEnabled: state.theme.theme.online_payment_enabled,
      establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
      staffDefaultEstablishmentBillingGroup:
        getStaffEstablishmentBillingGroupSelector(state),
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      onCancel: goBack,
      pushToSubscription: (id) => pushRouter(`/subscription/${id}`),
      fetchMember,
      fetchPaymentPackList: fetchPaymentPackListAction,
      fetchPrivatePassList,
      fetchPaymentComboList,
      fetchEstablishments,
      fetchStripeReaders,
      fetchCompanyUserRoles,
      fetchAllEstablishmentBillingGroup:
        fetchAllEstablishmentBillingGroupAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret:
      ({ memberId }) =>
      () =>
        requestSetupIntentSecretAPI(memberId),
    fetchPaymentMethodList:
      ({ memberId, fetchPaymentMethodList }) =>
      () =>
        fetchPaymentMethodList({ member: memberId }),
  }),
  withFetchDetail((props) => ({
    id: props.memberId,
    fetch: props.fetchMember,
    loading: props.memberLoading,
  })),
  withMemberBannerHOC(({ member }) => member),
)(SubscriptionCreate);
