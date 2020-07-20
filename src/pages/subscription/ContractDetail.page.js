// @flow

import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import ContractDeleteDialog from '../../libs/subscription/components/SubscriptionContractDeleteModal.component';
import SubscriptionContractFormDialog from '../../libs/subscription/components/SubscriptionContractFormDialog.component';
import PaginatedSubscriptionList from '../../libs/subscription/components/PaginatedSubscriptionList.component';
import themeSelectors from '../../libs/theme/selectors';

import {
  getContract,
  withPaymentPack,
  getSubscriptionList,
} from '../../libs/subscription/selectors';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import { withMember } from '../../libs/order/selectors';
import ContractDetail from '../../libs/subscription/components/ContractDetail.component';
import {
  fetchContractDetail as fetchContractDetailAction,
  deleteContract,
  createOrUpdateContract as createOrUpdateContractAction,
  fetchSubscriptionList as fetchSubscriptionListAction,
} from '../../libs/subscription/actions';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '../../libs/member/actions';
import { refreshAllPaymentPack } from '../../libs/payment-packs/actions';
import { snackbarSuccess } from '../../actions/snackbar.actions';

type Props = {
  theme: Theme,
  classes: Object,
  subscriptions: {
    count: number,
    items: Array<Subscriptions>,
    loading: boolean,
  },
  contractId: number,
  page: number,
  contract: Contract,
  deleteOpen: boolean,
  paymentPacks: Array<PaymentPack>,
  contractToEdit: ?Contract,
  setDeleteModalOpen: (boolean) => void,
  setContractToEdit: (?Contract) => void,
  refreshAllPaymentPack: () => void,
  fetchContractDetail: (id: number) => void,
  fetchMembersBySubscription: (subscriptions: Array<Subscription>) => void,
  snackbarSuccess: (string) => void,
  fetchSubscriptionsByContract: (
    page: number,
    page_size: number,
    options?: OptionCallback,
  ) => void,
  deleteContract: (id: number) => void,
  goToPaymentPackDetail: (id: number) => void,
  submitEditForm: (data: any, optionds: OptionsCallback) => void,
  goToSubscription: (id: number) => void,
  goToList: () => void,
  loading: boolean,
  t: TFunction,
};

type State = {
  page: number,
};

const SUBSCRIPTION_PAGINATION_SIZE = 7;

export class ContractDetailPage extends Component<Props, State> {
  componentDidMount() {
    this.props.fetchContractDetail(this.props.contractId);
    this.props.refreshAllPaymentPack();
    this.props.fetchSubscriptionsByContract(1, SUBSCRIPTION_PAGINATION_SIZE);
  }

  render() {
    if (this.props.loading || !this.props.contract) {
      return <LinearProgress />;
    }
    return (
      <div>
        <Grid container spacing={3} alignItems="stretch">
          <Grid
            item
            xs={12}
            md={6}
            className={this.props.classes.detailContainer}
          >
            <ContractDetail
              goToPack={this.props.goToPaymentPackDetail}
              contract={this.props.contract}
              company={{
                id: this.props.theme.company,
                name: this.props.theme.company_name,
              }}
              snackbarSuccess={this.props.snackbarSuccess}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={this.props.classes.title}>
              {this.props.t('associatedSubscriptions')}
            </Typography>
            <Paper>
              <PaginatedSubscriptionList
                contract={this.props.contract}
                items={this.props.subscriptions.items}
                nbItems={this.props.subscriptions.count}
                onClick={(sub) => {
                  this.props.goToSubscription(sub.id);
                }}
                loading={this.props.subscriptions.loading}
                page={this.props.page}
                itemPerPage={SUBSCRIPTION_PAGINATION_SIZE}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchSubscriptionsByContract(page, pageSize, {
                    onSuccess: (subs) => {
                      this.props.fetchMembersBySubscription(subs);
                    },
                  })
                }
              />
            </Paper>
          </Grid>
          <BottomActionButtons
            onEdit={() => this.props.setContractToEdit(this.props.contract)}
            onDelete={() => this.props.setDeleteModalOpen(true)}
          />
          <ContractDeleteDialog
            contractToDeleteId={
              this.props.deleteOpen ? this.props.contract.id : null
            }
            onClose={() => this.props.setDeleteModalOpen(false)}
            deleteContract={(id) => {
              this.props.deleteContract(id, {
                onSuccess: this.props.goToList,
              });
            }}
          />
        </Grid>
        <SubscriptionContractFormDialog
          onClose={() => this.props.setContractToEdit(null)}
          initial={this.props.contract}
          paymentPacks={this.props.paymentPacks}
          open={!!this.props.contractToEdit}
          onSubmit={(data, options) => {
            this.props.submitEditForm(data, {
              onSuccess: () => {
                this.props.setContractToEdit(null);
                if (options && options.onSuccess) options.onSuccess();
              },
              onError: (err) => {
                if (options && options.onError) options.onError(err);
              },
            });
          }}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  detailContainer: {
    padding: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['subscription']),
  routerParamsToProps({ id: 'contractId:number' }),
  withState('deleteOpen', 'setDeleteModalOpen', false),
  withState('contractToEdit', 'setContractToEdit', null),
  withState('page', 'setPage', 1),
  connect(
    (state, { contractId }) => ({
      loading: state.subscription.contract.loading,
      subscriptions: {
        count: state.subscription.list.count,
        items: withMember(getSubscriptionList)(state),
        loading: state.subscription.list.loading,
      },
      contract: withPaymentPack(getContract)(state, contractId),
      paymentPacks: getPaymentPackEnabled(state),
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchContractDetail: fetchContractDetailAction,
      deleteContract,
      refreshAllPaymentPack,
      createOrUpdateContract: createOrUpdateContractAction,
      fetchSubscriptionList: fetchSubscriptionListAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      snackbarSuccess,
      goToList: () => push('/subscription/contract'),
      goToSubscription: (id) => push(`/subscription/${id}`),
      goToPaymentPackDetail: (packId: number) =>
        push(`/payment-pack/${packId}/`),
    },
  ),
  withHandlers({
    fetchSubscriptionsByContract: ({
      fetchSubscriptionList,
      setPage,
      contractId,
    }) => (page, page_size, options) => {
      setPage(page);
      fetchSubscriptionList(
        {
          contract: contractId,
          page,
          page_size,
        },
        options,
      );
    },
    submitEditForm: ({
      createOrUpdateContract,
      fetchContractDetail,
      contractId,
    }) => (data, options) => {
      createOrUpdateContract(data, {
        onSuccess: () => {
          fetchContractDetail(contractId);
          if (options && options.onSuccess) {
            options.onSuccess();
          }
        },
      });
    },
    fetchMembersBySubscription: ({ fetchFilteredMembers }) => (
      subscriptions,
    ) => {
      fetchFilteredMembers({
        id__in: subscriptions.map((b) => b.member),
      });
    },
  }),
)(ContractDetailPage);
