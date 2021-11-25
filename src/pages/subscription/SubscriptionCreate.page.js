// @flow
import React, { Component } from 'react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter, goBack } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
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
import { getPaymentComboList } from '../../libs/payment-combo/selectors';
import { PaymentCombo } from '../../libs/payment-combo/types';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';
import type { Theme as CompanyTheme } from '../../libs/theme/types';
import themeSelectors from '../../libs/theme/selectors';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';

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
  fetchAllPaymentPacks: () => void,
  fetchEstablishments: () => void,
  establishments: Array<Establishment>,
  companyTheme: CompanyTheme,
};
type State = {
  tempSubscription: ?SubscriptionData,
  processing: boolean,
};

export class SubscriptionCreate extends Component<Props, State> {
  state = {
    tempSubscription: null,
    processing: false,
  };

  componentDidMount() {
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchEstablishments();
  }

  storeTempSubscription = (tempSubscription: ?SubscriptionData) => {
    this.setState({ tempSubscription });
  };

  createSubscription = async (
    _,
    payment_method_id: string,
    _callback,
    _voucher,
    _note,
    billing_establishment_id: number,
  ) => {
    this.setState({ processing: true });
    try {
      const response = await api.createFromPack({
        ...this.state.tempSubscription,
        stripe_source: null,
        payment_method_id,
        billing_establishment_id,
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
            subscriptionData={this.state.tempSubscription}
            onSubmit={this.createSubscription}
            onCancel={() => this.storeTempSubscription(null)}
            processing={this.state.processing}
            member={this.props.member}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            establishments={this.props.establishments}
            enableMultiLocalization={
              this.props.companyTheme.enable_multi_localization
            }
          />
        ) : (
          <Paper className={this.props.classes.paper}>
            <div className={this.props.classes.formContainer}>
              <SubscriptionCreateComponent
                paymentPacks={this.props.paymentPacks}
                privatePassList={this.props.privatePassList}
                paymentComboList={this.props.paymentComboList}
                member={this.props.member}
                onSubmit={this.storeTempSubscription}
                onCancel={this.props.onCancel}
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
      paymentComboList: getPaymentComboList(state),
      memberLoading: state.member.loading,
      member: getMember(state, memberId),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      establishments: getAvailableEstablishmentList(state),
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      onCancel: goBack,
      pushToSubscription: (id) => pushRouter(`/subscription/${id}`),
      fetchMember,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchPaymentComboList,
      fetchEstablishments,
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
