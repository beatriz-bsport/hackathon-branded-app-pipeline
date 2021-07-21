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
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import themeSelectors from '../../libs/theme/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';

import withTitle from '../../hocs/with-title.hoc';

import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
import SubscriptionContractFormDialog from '../../libs/subscription/components/SubscriptionContractFormDialog.component';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';

import { search as searchMembers } from '../../libs/member/actions';
import { getSearchedMembers } from '../../libs/member/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import {
  getInactiveContractList,
  getAvailableContractListManager,
  getAvailableContractListCustomer,
  getContract,
  withPaymentPack,
} from '../../libs/subscription/selectors';
import {
  createOrUpdateContract as createOrUpdateContractAction,
  fetchContractList as fetchContractListAction,
  deleteContract,
  restoreContract,
  fetchSubscriptionBulk as fetchSubscriptionBulkAction,
} from '../../libs/subscription/actions';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';

type Props = {
  fetchContractList: () => void,
  theme: Theme,
  contractLoading: boolean,
  goToContractDetail: (contractId: number) => void,
  createOrUpdateContract: (data: any, options: OptionCallback) => void,
  deleteContract: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  contractListAvailableAll: Array<SubscriptionContract>,
  contractListManagerOnly: Array<SubscriptionContract>,
  inactiveContracts: Array<SubscriptionContract>,

  showDisabled: boolean,
  setShowDisabled: (boolean) => void,
  restoreContract: (id: number, options: OptionCallback) => void,

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

  t: TFunction,
  classes: Object,

  fetchPrivatePassList: () => void,
  privatePassList: Array<PrivatePass>,

  fetchPaymentComboList: () => void,
  paymentComboList: Array<PaymentCombo>,

  requestSetupIntentSecret: () => void,
  fetchPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  managerFormConfig: SignUpFormConfigDict,
};

export class SubscriptionList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchContractList();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
  }

  onClickContract = (id: number) => {
    if (id === this.props.selectedContract) {
      this.props.setSelectedContract(null);
    } else {
      this.props.setSelectedContract(id);
    }
    if (this.props.goToContractDetail) {
      this.props.goToContractDetail(id);
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
                privatePassList={this.props.privatePassList}
                paymentComboList={this.props.paymentComboList}
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
                privatePassList={this.props.privatePassList}
                paymentComboList={this.props.paymentComboList}
              />
            </Grid>
          )}
          {!!this.props.inactiveContracts.length && (
            <Grid item xs={12} lg={6}>
              <ButtonBase
                onClick={() =>
                  this.props.setShowDisabled(!this.props.showDisabled)
                }
              >
                <Typography
                  className={this.props.classes.sectionTitle}
                  variant="h4"
                >
                  {`${this.props.t(
                    'subscription:contract.list.titleInactive',
                  )} (${this.props.inactiveContracts.length})`}
                </Typography>
                {this.props.showDisabled ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ButtonBase>
              <Divider className={this.props.classes.divider} />
              {this.props.showDisabled && (
                <SubscriptionContractList
                  contractList={this.props.inactiveContracts}
                  dense
                  divider
                  loading={this.props.contractLoading}
                  paymentPacks={this.props.paymentPacks}
                  privatePassList={this.props.privatePassList}
                  paymentComboList={this.props.paymentComboList}
                  onRestore={(id) => {
                    this.props.restoreContract(id, {
                      onSuccess: () => this.props.fetchContractList(),
                    });
                  }}
                />
              )}
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
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
            managerFormConfig={this.props.managerFormConfig.poll_fields}
          />
        ) : null}
        {this.props.createContractFormOpen && (
          <SubscriptionContractFormDialog
            paymentPacks={this.props.paymentPacks}
            privatePassList={this.props.privatePassList}
            paymentComboList={this.props.paymentComboList}
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
      inactiveContracts: withPaymentPack(getInactiveContractList)(state),
      contractLoading: state.subscription.contract.loading,
      paymentPacks: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      paymentComboList: getPaymentComboList(state),
      searchedMembers: getSearchedMembers(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      managerFormConfig: getSignUpFormConfigurationDict(state),
    }),
    {
      fetchContractList: fetchContractListAction,
      fetchSubscriptionBulk: fetchSubscriptionBulkAction,
      fetchPaymentComboList,
      createOrUpdateContract: createOrUpdateContractAction,
      searchMembers,
      deleteContract,
      restoreContract,
      pushRouter: push,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      fetchPrivatePassList,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
    },
  ),
  withState('selectedContract', 'setSelectedContract', null),
  withState('contractRegisterOpen', 'setContractRegisterOpen', false),
  withState('memberToBill', 'setMemberToBill', null),
  withState('showDisabled', 'setShowDisabled', false),
  connect(
    (state, { selectedContract }) => ({
      selectedContractData: getContract(state, selectedContract),
      theme: themeSelectors.getTheme(state),
    }),
    {
      goToContractDetail: (contractId) =>
        push(`/subscription/contract/${contractId}`),
    },
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
    requestSetupIntentSecret: ({ memberToBill }) => () =>
      requestSetupIntentSecretAPI(memberToBill.id),
    fetchPaymentMethodList: ({
      memberToBill,
      fetchPaymentMethodList,
    }) => () => {
      fetchPaymentMethodList({ member: memberToBill.id });
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
