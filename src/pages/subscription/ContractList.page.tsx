// @flow

import React from 'react';
import { compose, withProps, withStateHandlers, withHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Theme } from '@material-ui/core/styles';
import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Fuse, { FuseOptions } from 'fuse.js';

import { TFunction } from 'i18next';
import { RootState } from '../../reducers';
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
import SubscriptionContractFormDrawer from '../../libs/subscription/components/SubscriptionContractFormDrawer.component';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';

import { search as searchMembers } from '../../libs/member/actions';
import { getSearchedMembers } from '../../libs/member/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import FuzeSearch from '../../components/FuzeSearch.component';

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

import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import type { Contract } from '../../libs/subscription/types';

import { Coach } from '../../libs/associated-coach/types';
import { Member } from '../../libs/member/types';

export class SubscriptionList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

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

  changeSearch =
    (fuse: Fuse<Contract, FuseOptions<Contract>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      this.setState({
        searchText: ev.target.value,
        searchResult: fuse.search(ev.target.value),
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
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
        ) : (
          <div className={this.props.classes.search}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              items={this.props.contractListAvailableAll}
              placeholder={this.props.t('search')}
              searchFields={['name']}
              searchResult={this.state.searchResult}
            />

            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? this.props.classes.searchPaperDisplayed
                  : this.props.classes.searchPaperHidden
              }
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <SubscriptionContractList
                  contractList={this.state.searchResult}
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
                  onEdit={(data: any, options: OptionCallback<void>) => {
                    this.props.createOrUpdateContract(data, {
                      onSuccess: () => {
                        this.props.fetchContractList();
                        if (options && options.onSuccess) {
                          options.onSuccess();
                        }
                      },
                    });
                  }}
                  onDelete={(id: number) =>
                    this.props.deleteContract(id, {
                      onSuccess: this.props.fetchContractList,
                    })
                  }
                  paymentPacks={this.props.paymentPacks}
                  privatePassList={this.props.privatePassList}
                  paymentComboList={this.props.paymentComboList}
                />
              </Collapse>
            </Paper>
          </div>
        )}
        <Grid container spacing={2}>
          {!!this.props.contractListAvailableAll.length && (
            <Grid item xs={12} lg={6}>
              <Typography
                className={this.props.classes.sectionTitle}
                variant="h5"
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
                onEdit={(data: any, options: OptionCallback<void>) => {
                  this.props.createOrUpdateContract(data, {
                    onSuccess: () => {
                      this.props.fetchContractList();
                      if (options && options.onSuccess) {
                        options.onSuccess();
                      }
                    },
                  });
                }}
                onDelete={(id: number) =>
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
                variant="h5"
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
                onEdit={(data: any, options: OptionCallback<void>) => {
                  this.props.createOrUpdateContract(data, {
                    onSuccess: () => {
                      this.props.fetchContractList();
                      if (options && options.onSuccess) {
                        options.onSuccess();
                      }
                    },
                  });
                }}
                onDelete={(id: number) =>
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
                  variant="h5"
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
                  onRestore={(id: number) => {
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
            waiver={this.props.theme.waiver}
            generalTermsAndConditions={
              this.props.theme.general_terms_and_conditions
            }
          />
        ) : null}
        <SubscriptionContractFormDrawer
          paymentPacks={this.props.paymentPacks}
          privatePassList={this.props.privatePassList}
          paymentComboList={this.props.paymentComboList}
          open={this.props.createContractFormOpen}
          onSubmit={this.props.onCreate}
          onClose={this.props.onCloseCreate}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  search: {
    paddingBottom: theme.spacing(2),
  },
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
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
    boderBottom: '0px',
  },
});

type StateHandlerInit = {
  createContractFormOpen: boolean;
  selectedContract: null | number;
  contractRegisterOpen: boolean;
  memberToBill: null | Member;
  showDisabled: boolean;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type HandlersType = WithHandlerType<typeof mapWithHandlers>;

type State = {
  searchText: string;
  searchResult: Array<Coach>;
};

type Props = MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  ConnectedProps &
  StateHandlerType &
  HandlersType;

const mapStateToProps = (state: RootState) => ({
  theme: themeSelectors.getTheme(state),
  contractListManagerOnly: withPaymentPack(getAvailableContractListManager)(
    state,
  ),
  contractListAvailableAll: withPaymentPack(getAvailableContractListCustomer)(
    state,
  ),
  inactiveContracts: withPaymentPack(getInactiveContractList)(state),
  contractLoading: state.subscription.contract.loading,
  paymentPacks: getPaymentPackEnabled(state),
  privatePassList: getPrivatePassAvailable(state),
  paymentComboList: getPaymentComboList(state),
  searchedMembers: getSearchedMembers(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
});

const mapDispatchToProps = {
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
  goToContractDetail: (contractId: number) =>
    push(`/subscription/contract/${contractId}`),
};

const withStateHandlersInit: StateHandlerInit = {
  createContractFormOpen: false,
  selectedContract: null,
  contractRegisterOpen: false,
  memberToBill: null,
  showDisabled: false,
};

const withStateHandlersSetter = {
  setSelectedContract: () => (selectedContract: number | null) => ({
    selectedContract,
  }),
  setContractRegisterOpen: () => (contractRegisterOpen: boolean) => ({
    contractRegisterOpen,
  }),
  setMemberToBill: () => (memberToBill: Member | null) => ({ memberToBill }),
  setShowDisabled: () => (showDisabled: boolean) => ({ showDisabled }),
  onCloseCreate: () => () => ({ createContractFormOpen: false }),
  onRequestCreate: () => () => ({ createContractFormOpen: true }),
  onCreate:
    (
      _,
      { createOrUpdateContract, fetchContractList }: typeof mapDispatchToProps,
    ) =>
    (data, options) => {
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
};

const mapWithHandlers = {
  openContractRegister:
    ({
      setContractRegisterOpen,
      setSelectedContract,
      setMemberToBill,
    }: WithHandlerType<typeof withStateHandlersSetter>) =>
    (contract: Contract) => {
      setSelectedContract(contract.id);
      setContractRegisterOpen(true);
      setMemberToBill(null);
    },
  closeContractRegister:
    ({
      setMemberToBill,
      setContractRegisterOpen,
    }: WithHandlerType<typeof withStateHandlersSetter>) =>
    () => {
      setContractRegisterOpen(false);
      setMemberToBill(null);
    },
  onRegisteredBillingPlan:
    ({
      setMemberToBill,
      pushRouter,
      setContractRegisterOpen,
    }: WithHandlerType<typeof withStateHandlersSetter> &
      typeof mapDispatchToProps) =>
    (billingPlan: any) => {
      setContractRegisterOpen(false);
      setMemberToBill(null);
      pushRouter(`/subscription/${billingPlan.id}`);
    },
  requestSetupIntentSecret:
    ({ memberToBill }: typeof withStateHandlersInit) =>
    () =>
      requestSetupIntentSecretAPI(memberToBill.id),
  fetchPaymentMethodList:
    ({
      memberToBill,
      fetchPaymentMethodList,
    }: typeof mapDispatchToProps & typeof withStateHandlersInit) =>
    () => {
      fetchPaymentMethodList({ member: memberToBill.id });
    },
};

export default compose(
  withTranslation(['subscription', 'titles']),
  withStyles(styles),
  withProps(({ fetchContractList, fetchPaymentPackBulk }) => ({
    fetchContractList: (params: any) =>
      fetchContractList(params, {
        onSuccess: (contractList: Array<Contract>) =>
          fetchPaymentPackBulk(
            contractList.map((c: Contract) => c.payment_pack),
          ),
      }),
  })),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:subscription.subscriptions'),
  ),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
  connect((state, { selectedContract }) => ({
    selectedContractData: getContract(state, selectedContract),
  })),
)(SubscriptionList);
