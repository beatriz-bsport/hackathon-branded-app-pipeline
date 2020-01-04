// @flow

import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

import withTitle from '../../hocs/with-title.hoc';

import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
import SubscriptionContractRegistrationManagerDialog from '../../libs/subscription/components/SubscriptionContractRegistrationManagerDialog.component';
import { search as searchMembers } from '../../libs/member/actions';
import { getSearchedMembers } from '../../libs/member/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';

import {
  getSubscriptionList,
  getAvailableContractListWithPaymentPack,
  getContract,
} from '../../libs/subscription/selectors';
import {
  createOrUpdateContract,
  fetchContractList as fetchContractListAction,
  deleteContract,
  fetchSubscriptionList,
} from '../../libs/subscription/actions';

type Props = {
  goToSubscription: (id: number) => void,
  fetchSubscriptionList: (params: any) => void,
  subscriptionList: Array<Subscription>,
  subscriptionLoading: boolean,
  subscriptionCount: number,

  fetchContractList: () => void,
  contractLoading: boolean,
  createOrUpdateContract: (data: any, options: OptionCallback) => void,
  deleteContract: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  contractList: Array<SubscriptionContract>,

  registeringContract: ?Contract,
  setRegisteringContract: (?Contract) => void,

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
  state = { processing: false };

  componentDidMount() {
    this.props.fetchContractList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedContract !== this.props.selectedContract) {
      this.fetchSubscriptionList(1);
    }
  }

  onClickContract = (id: number) => {
    if (id === this.props.selectedContract) {
      this.props.setSelectedContract(null);
    } else {
      this.props.setSelectedContract(id);
    }
  };

  fetchSubscriptionList = (page) => {
    this.props.fetchSubscriptionList({
      page,
      page_size: 10,
      ...(this.props.selectedContract
        ? { contract: this.props.selectedContract }
        : {}),
    });
  };

  onSubmit = async (
    token: string,
    first_billing_timestamp: string,
    member: number,
  ) => {
    this.setState({ processing: true });
    try {
      await postContractSubscriptionAPI(this.props.registeringContract.id, {
        stripe_source: token,
        member,
        first_billing_timestamp: moment(first_billing_timestamp).unix(),
      });
    } catch (err) {
      console.error(err);
    }
    this.onClickContract(this.props.registeringContract.id);
    this.setState({ processing: false });
    this.props.setRegisteringContract(null);
  };

  render() {
    return (
      <div>
        <Typography className={this.props.classes.sectionTitle} variant="h4">
          {this.props.t('contract.list.title')}
        </Typography>
        <Divider className={this.props.classes.divider} />
        <SubscriptionContractList
          contractList={this.props.contractList}
          loading={this.props.contractLoading}
          onClick={this.onClickContract}
          selectedContract={this.props.selectedContract}
          onRegister={this.props.setRegisteringContract}
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
          onPageChange={this.fetchSubscriptionList}
        />
        {this.props.registeringContract ? (
          <SubscriptionContractRegistrationManagerDialog
            open={!!this.props.registeringContract}
            onClose={() => this.props.setRegisteringContract(null)}
            contract={this.props.registeringContract}
            searchMembers={this.props.searchMembers}
            searchedMembers={this.props.searchedMembers}
            searchLoading={this.props.searchMemberLoading}
            processing={this.state.processing}
            onSubmit={this.onSubmit}
          />
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
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
    }),
    {
      fetchContractList: fetchContractListAction,
      fetchSubscriptionList,
      createOrUpdateContract,
      searchMembers,
      deleteContract,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      goToSubscription: (id) => pushRouter(`/subscription/${id}`),
    },
  ),
  withState('selectedContract', 'setSelectedContract', null),
  withState('registeringContract', 'setRegisteringContract', null),
  connect((state, { selectedContract }) => ({
    selectedContractData: getContract(state, selectedContract),
  })),
  withProps(({ fetchContractList, fetchPaymentPackBulk }) => ({
    fetchContractList: (params) =>
      fetchContractList(params, {
        onSuccess: (contractList) =>
          fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
      }),
  })),
)(SubscriptionList);
