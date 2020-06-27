// @flow

import React from 'react';
import {
  compose,
  withState,
  withProps,
  withStateHandlers,
  withHandlers,
} from 'recompose';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import themeSelectors from '../../libs/theme/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import withTitle from '../../hocs/with-title.hoc';

import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
import SubscriptionContractFormDialog from '../../libs/subscription/components/SubscriptionContractFormDialog.component';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';

import { search as searchMembers } from '../../libs/member/actions';
import { getSearchedMembers } from '../../libs/member/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import {
  getAvailableContractListManager,
  getAvailableContractListCustomer,
  getContract,
  withPaymentPack,
} from '../../libs/subscription/selectors';
import {
  createOrUpdateContract as createOrUpdateContractAction,
  fetchContractList as fetchContractListAction,
  deleteContract,
  fetchSubscriptionBulk as fetchSubscriptionBulkAction,
} from '../../libs/subscription/actions';

type Props = {
  fetchContractList: () => void,
  theme: Theme,
  contractLoading: boolean,
  createOrUpdateContract: (data: any, options: OptionCallback) => void,
  deleteContract: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  contractListAvailableAll: Array<SubscriptionContract>,
  contractListManagerOnly: Array<SubscriptionContract>,

  openContractRegister: (?Contract) => void,
  onRegisteredBillingPlan: (BillingPlan) => void,
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

  onRequestCreate: () => void,
  onCreate: (data: any, options: OptionCallback) => void,
  onCloseCreate: () => void,
  createContractFormOpen: boolean,
  snackbarSuccess: (string) => void,

  t: TFunction,
  classes: Object,
};

export class SubscriptionList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchContractList();
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
        {this.props.contractListAvailableAll.length === 0 &&
        this.props.contractListManagerOnly.length === 0 &&
        !this.props.contractLoading ? (
          <IsEmptyList
            text={this.props.t('noContracts')}
            button={this.props.t('subscription:contract.actions.create')}
            onCreate={this.props.onRequestCreate}
          />
        ) : null}
        <Grid container spacing={2}>
          {!!this.props.contractListAvailableAll.length && (
            <Grid item xs={12} lg={6}>
              <Typography
                className={this.props.classes.sectionTitle}
                variant="h4"
              >
                {this.props.t(
                  'subscription:contract.list.titleCustomerAvailable',
                )}
              </Typography>
              <Divider className={this.props.classes.divider} />
              <SubscriptionContractList
                contractList={this.props.contractListAvailableAll}
                dense
                divider
                copy
                snackbar={this.props.snackbarSuccess}
                loading={this.props.contractLoading}
                onClick={this.onClickContract}
                company={{
                  id: this.props.theme.company,
                  name: this.props.theme.company_name,
                }}
                selectedContract={this.props.selectedContract}
                onRegister={this.props.openContractRegister}
                onEdit={(data, options) => {
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
          )}
          {!!this.props.contractListManagerOnly.length && (
            <Grid item xs={12} lg={6}>
              <Typography
                className={this.props.classes.sectionTitle}
                variant="h4"
              >
                {this.props.t('subscription:contract.list.titleManagerOnly')}
              </Typography>
              <Divider className={this.props.classes.divider} />
              <SubscriptionContractList
                contractList={this.props.contractListManagerOnly}
                dense
                divider
                loading={this.props.contractLoading}
                onClick={this.onClickContract}
                selectedContract={this.props.selectedContract}
                onRegister={this.props.openContractRegister}
                onEdit={(data, options) => {
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
          )}
        </Grid>
        <BottomActionsButton
          onCreateLabel={this.props.t('subscription:contract.actions.create')}
          onCreate={this.props.onRequestCreate}
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
            onSuccess={this.props.onRegisteredBillingPlan}
            onClose={this.props.closeContractRegister}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
          />
        ) : null}
        {this.props.createContractFormOpen && (
          <SubscriptionContractFormDialog
            paymentPacks={this.props.paymentPacks}
            open
            onSubmit={this.props.onCreate}
            onClose={this.props.onCloseCreate}
          />
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: '20vh',
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['subscription', 'titles']),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:subscription.subscriptions'),
  ),
  connect(
    (state) => ({
      contractListManagerOnly: withPaymentPack(getAvailableContractListManager)(
        state,
      ),
      contractListAvailableAll: withPaymentPack(
        getAvailableContractListCustomer,
      )(state),
      contractLoading: state.subscription.contract.loading,
      paymentPacks: getPaymentPackEnabled(state),
      searchedMembers: getSearchedMembers(state),
    }),
    {
      fetchContractList: fetchContractListAction,
      fetchSubscriptionBulk: fetchSubscriptionBulkAction,
      createOrUpdateContract: createOrUpdateContractAction,
      searchMembers,
      deleteContract,
      pushRouter: push,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    },
  ),
  withState('selectedContract', 'setSelectedContract', null),
  withState('contractRegisterOpen', 'setContractRegisterOpen', false),
  withState('memberToBill', 'setMemberToBill', null),
  connect(
    (state, { selectedContract }) => ({
      selectedContractData: getContract(state, selectedContract),
      theme: themeSelectors.getTheme(state),
    }),
    { snackbarSuccess },
  ),
  withHandlers({
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
    }) => () => {
      setContractRegisterOpen(false);
      setMemberToBill(null);
    },
    onRegisteredBillingPlan: ({
      setMemberToBill,
      pushRouter,
      setContractRegisterOpen,
    }) => (billingPlan) => {
      setContractRegisterOpen(false);
      setMemberToBill(null);
      pushRouter(`/subscription/${billingPlan.id}`);
    },
  }),
  withProps(({ fetchContractList, fetchPaymentPackBulk }) => ({
    fetchContractList: (params) =>
      fetchContractList(params, {
        onSuccess: (contractList) =>
          fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
      }),
  })),
  withStateHandlers(
    { createContractFormOpen: false },
    {
      onCloseCreate: () => () => ({ createContractFormOpen: false }),
      onRequestCreate: () => () => ({ createContractFormOpen: true }),
      onCreate: (_, { createOrUpdateContract, fetchContractList }) => (
        data,
        options,
      ) => {
        createOrUpdateContract(data, {
          onSuccess: () => {
            fetchContractList();
            if (options && options.onSuccess) {
              options.onSuccess();
            }
          },
        });
        return { createContractFormOpen: false };
      },
    },
  ),
)(SubscriptionList);
