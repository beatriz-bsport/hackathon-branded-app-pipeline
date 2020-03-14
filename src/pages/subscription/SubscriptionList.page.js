// @flow

import React from 'react';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';

import withTitle from '../../hocs/with-title.hoc';

import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import EventPanel from '../../libs/event/components/EventPanel.component';
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';
import { COMPANY_EVENTS } from '../../libs/subscription/components/event.utils';

import { search as searchMembers } from '../../libs/member/actions';
import { getSearchedMembers } from '../../libs/member/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';

import {
  getSubscriptionList,
  getAvailableContractListWithPaymentPack,
  getContract,
  getSubscriptionEventList,
  getSubscriptionEventState,
} from '../../libs/subscription/selectors';
import {
  createOrUpdateContract,
  fetchContractList as fetchContractListAction,
  deleteContract,
  fetchSubscriptionList as fetchSubscriptionListAction,
  fetchSubscriptionBulk as fetchSubscriptionBulkAction,
  fetchSubscriptionEventList as fetchSubscriptionEventListAction,
} from '../../libs/subscription/actions';

type Props = {
  goToSubscription: (id: number) => void,
  fetchSubscriptionList: (page: number) => void,
  subscriptionList: Array<Subscription>,
  subscriptionLoading: boolean,
  subscriptionCount: number,

  eventLoading: boolean,
  eventPage: number,
  eventList: Array<EventSubscription>,
  fetchSubscriptionEventList: ({ page: number, page_size: number }) => void,

  fetchContractList: () => void,
  contractLoading: boolean,
  createOrUpdateContract: (data: any, options: OptionCallback) => void,
  deleteContract: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  contractList: Array<SubscriptionContract>,

  openContractRegister: (?Contract) => void,
  contractRegisterOpen: boolean,

  setMemberToBill: (?Member) => void,
  memberToBill: ?Member,
  closeContractRegister: () => void,

  searchMembers: (text: string) => void,
  searchedMembers: Array<Member>,
  searchMemberLoading: boolean,

  selectedContract: ?number,
  setSelectedContract: (?number) => void,
  selectedContractData: ?Contract,

  t: TFunction,
  classes: Object,
};

export class SubscriptionList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchContractList();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedContract !== this.props.selectedContract) {
      this.props.fetchSubscriptionList(1);
    }
  }

  onClickContract = (id: number) => {
    if (id === this.props.selectedContract) {
      this.props.setSelectedContract(null);
    } else {
      this.props.setSelectedContract(id);
    }
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={6}>
            <Typography
              className={this.props.classes.sectionTitle}
              variant="h4"
            >
              {this.props.t('contract.list.title')}
            </Typography>
            <Divider className={this.props.classes.divider} />
            <SubscriptionContractList
              contractList={this.props.contractList}
              dense
              divider
              loading={this.props.contractLoading}
              onClick={this.onClickContract}
              selectedContract={this.props.selectedContract}
              onRegister={this.props.openContractRegister}
              createOrUpdate={(data, options) => {
                this.props.createOrUpdateContract(data, {
                  onSuccess: () => {
                    this.props.fetchContractList();
                    if (options && options.onSuccess) {
                      options.onSuccess();
                    }
                  },
                });
              }}
              onDelete={(id) =>
                this.props.deleteContract(id, {
                  onSuccess: this.props.fetchContractList,
                })
              }
              paymentPacks={this.props.paymentPacks}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <div className={this.props.classes.divider} />
            <Paper>
              <EventPanel
                loading={this.props.eventLoading}
                eventList={this.props.eventList}
                page={this.props.eventPage}
                eventSpec={COMPANY_EVENTS}
                fetchEventList={this.props.fetchSubscriptionEventList}
                onEventClick={this.props.goToSubscription}
              />
            </Paper>
          </Grid>
        </Grid>
        <Typography className={this.props.classes.sectionTitle} variant="h4">
          {this.props.selectedContract
            ? this.props.selectedContractData.name || '  - '
            : this.props.t('subscription.list.title')}
        </Typography>
        <Divider className={this.props.classes.divider} />
        <SubscriptionTable
          goToSubscription={this.props.goToSubscription}
          subscriptionList={this.props.subscriptionList}
          loading={this.props.subscriptionLoading}
          count={this.props.subscriptionCount}
          onPageChange={this.props.fetchSubscriptionList}
        />
        {this.props.contractRegisterOpen && this.props.selectedContract ? (
          <SubscriptionContractRegister
            open={this.props.contractRegisterOpen}
            contract={this.props.selectedContractData}
            searchMembers={this.props.searchMembers}
            searchedMembers={this.props.searchedMembers}
            searchLoading={this.props.searchMemberLoading}
            onChangeMember={this.props.setMemberToBill}
            member={this.props.memberToBill}
            onSuccess={this.props.closeContractRegister}
            onClose={this.props.closeContractRegister}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
          />
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: '20vh',
  },
  sectionTitle: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:subscription.subscriptions'),
  ),
  connect(
    (state) => ({
      contractList: getAvailableContractListWithPaymentPack(state),
      contractLoading: state.subscription.contract.loading,
      paymentPacks: getPaymentPackEnabled(state),
      subscriptionList: getSubscriptionList(state),
      subscriptionCount: state.subscription.list.count,
      subscriptionLoading: state.subscription.list.loading,
      searchedMembers: getSearchedMembers(state),
      eventList: getSubscriptionEventList(state),
      eventPage: getSubscriptionEventState(state).page,
      eventLoading: getSubscriptionEventState(state).loading,
    }),
    {
      fetchContractList: fetchContractListAction,
      fetchSubscriptionList: fetchSubscriptionListAction,
      fetchSubscriptionBulk: fetchSubscriptionBulkAction,
      fetchSubscriptionEventList: fetchSubscriptionEventListAction,
      createOrUpdateContract,
      searchMembers,
      deleteContract,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      goToSubscription: (id) => pushRouter(`/subscription/${id}`),
    },
  ),
  withState('selectedContract', 'setSelectedContract', null),
  withHandlers({
    fetchSubscriptionList: ({ fetchSubscriptionList, selectedContract }) => (
      page: number,
    ) => {
      fetchSubscriptionList({
        page,
        page_size: 10,
        ...(selectedContract ? { contract: selectedContract } : {}),
      });
    },
  }),
  withState('contractRegisterOpen', 'setContractRegisterOpen', false),
  withState('memberToBill', 'setMemberToBill', null),
  connect((state, { selectedContract }) => ({
    selectedContractData: getContract(state, selectedContract),
  })),
  withHandlers({
    fetchSubscriptionEventList: ({
      fetchSubscriptionEventList,
      fetchSubscriptionBulk,
    }) => (params) => {
      fetchSubscriptionEventList(params, {
        onSuccess: (eventList) =>
          fetchSubscriptionBulk(eventList.map((e) => e.data.billing_plan)),
      });
    },
    openContractRegister: ({
      setContractRegisterOpen,
      setSelectedContract,
      setMemberToBill,
    }) => (contract) => {
      setSelectedContract(contract.id);
      setContractRegisterOpen(true);
      setMemberToBill(null);
    },
    closeContractRegister: ({
      setMemberToBill,
      setContractRegisterOpen,
      fetchSubscriptionList,
    }) => () => {
      setContractRegisterOpen(false);
      setMemberToBill(null);
      fetchSubscriptionList(1);
    },
  }),
  withProps(({ fetchContractList, fetchPaymentPackBulk }) => ({
    fetchContractList: (params) =>
      fetchContractList(params, {
        onSuccess: (contractList) =>
          fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
      }),
  })),
)(SubscriptionList);
