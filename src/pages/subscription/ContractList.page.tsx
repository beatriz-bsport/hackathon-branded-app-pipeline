// @ts-nocheck
// @flow

import React from 'react';
import { compose, withProps, withStateHandlers, withHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { v4 as uuid4 } from 'uuid';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Fuse, { FuseOptions } from 'fuse.js';

import { TFunction } from 'i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import { RootState } from '../../reducers';
import themeSelectors, {
  getStripeRegion,
  getCompanyCountry,
} from '../../libs/theme/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';

import withTitle from '../../hocs/with-title.hoc';
import { withContractNotification } from '#libs/marketing/selectors';

import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
import SubscriptionContractFormDrawer from '../../libs/subscription/components/SubscriptionContractFormDrawer.component';
import { FormValues } from '../../libs/subscription/components/SubscriptionContractForm.component';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';
import { fetchMarketingNotificationList } from '#libs/marketing/actions';
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
  registerContractBackground as registerContractBackgroundAction,
} from '../../libs/subscription/actions';
import {
  displayBackgroundDialog as displayBackgroundDialogAction,
  deletebackgroundDialog as deletebackgroundDialogAction,
} from '#libs/background-dialog/actions';
import { fetchStripeReaders } from '#libs/terminal/actions';
import { getStripeReaders } from '#libs/terminal/selectors';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#libs/payment/utils';

import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import type { Contract } from '../../libs/subscription/types';

import { Coach } from '../../libs/associated-coach/types';
import { Member } from '../../libs/member/types';

import {
  DISPLAY_INFORMATION,
  DISPLAY_SUCCESS,
  ACTION_MODE_REDIRECT,
} from '#libs/background-dialog/types';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

export class SubscriptionList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchContractList();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchStripeReaders();
    this.props.fetchMarketingNotificationList({
      kind__in: [
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
      ],
    });
    this.props.fetchEstablishments();
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

  handleEditContract = (data: FormValues, options: OptionCallback<void>) => {
    this.props.createOrUpdateContract(data, {
      onSuccess: () => {
        this.props.fetchContractList();
        if (options.onSuccess) {
          options.onSuccess();
        }
      },
    });
  };

  handleRestoreContract = (id: number) => {
    this.props.restoreContract(id, {
      onSuccess: () => this.props.fetchContractList(),
    });
  };

  handleDeleteContract = (id: number) =>
    this.props.deleteContract(id, {
      onSuccess: this.props.fetchContractList,
    });

  render() {
    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.contract.allowed_actions.create',
          'product.contract.allowed_actions.edit',
          'product.contract.allowed_actions.delete',
        ]}
      >
        {([
          hasCreatePermission,
          hasEditPermission,
          hasDeletePermission,
        ]: boolean[]) => (
          <div className={this.props.classes.container}>
            {this.props.contractListAvailableAll?.length === 0 &&
            this.props.contractListManagerOnly?.length === 0 &&
            !this.props.contractLoading ? (
              <IsEmptyList
                button={this.props.t('subscription:contract.actions.create')}
                onCreate={this.props.onRequestCreate}
                text={this.props.t('noContracts')}
              />
            ) : (
              <div className={this.props.classes.search}>
                <FuzeSearch
                  changeSearch={this.changeSearch}
                  clearSearch={this.clearSearch}
                  items={this.props.contractListAvailableAll}
                  placeholder={this.props.t('search')}
                  searchFields={['name']}
                  searchResult={this.state.searchResult}
                  searchText={this.state.searchText}
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
                      dense
                      divider
                      company={{
                        id: this.props.theme.company,
                        name: this.props.theme.company_name,
                      }}
                      contractList={this.state.searchResult}
                      displayNewCheckoutFlow={
                        this.props.theme.display_new_checkout_flow
                      }
                      loading={this.props.contractLoading}
                      onClick={this.onClickContract}
                      onDelete={
                        hasDeletePermission && this.handleDeleteContract
                      }
                      onEdit={hasEditPermission && this.handleEditContract}
                      onRegister={this.props.openContractRegister}
                      paymentComboList={this.props.paymentComboList}
                      paymentPackList={this.props.paymentPackList}
                      privatePassList={this.props.privatePassList}
                      selectedContract={this.props.selectedContract}
                    />
                  </Collapse>
                </Paper>
              </div>
            )}
            <Grid container spacing={2}>
              {!!this.props.contractListAvailableAll?.length && (
                <Grid item lg={6} xs={12}>
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
                    dense
                    divider
                    company={{
                      id: this.props.theme.company,
                      name: this.props.theme.company_name,
                    }}
                    contractList={this.props.contractListAvailableAll}
                    displayNewCheckoutFlow={
                      this.props.theme.display_new_checkout_flow
                    }
                    loading={this.props.contractLoading}
                    onClick={this.onClickContract}
                    onDelete={hasDeletePermission && this.handleDeleteContract}
                    onEdit={hasEditPermission && this.handleEditContract}
                    onRegister={this.props.openContractRegister}
                    paymentComboList={this.props.paymentComboList}
                    paymentPackList={this.props.paymentPackList}
                    privatePassList={this.props.privatePassList}
                    selectedContract={this.props.selectedContract}
                  />
                </Grid>
              )}
              {!!this.props.contractListManagerOnly?.length && (
                <Grid item lg={6} xs={12}>
                  <Typography
                    className={this.props.classes.sectionTitle}
                    variant="h5"
                  >
                    {this.props.t(
                      'subscription:contract.list.titleManagerOnly',
                    )}
                  </Typography>
                  <Divider className={this.props.classes.divider} />
                  <SubscriptionContractList
                    dense
                    divider
                    contractList={this.props.contractListManagerOnly}
                    loading={this.props.contractLoading}
                    onClick={this.onClickContract}
                    onDelete={hasDeletePermission && this.handleDeleteContract}
                    onEdit={hasEditPermission && this.handleEditContract}
                    onRegister={this.props.openContractRegister}
                    paymentComboList={this.props.paymentComboList}
                    paymentPackList={this.props.paymentPackList}
                    privatePassList={this.props.privatePassList}
                    selectedContract={this.props.selectedContract}
                  />
                </Grid>
              )}
              {!!this.props.inactiveContracts?.length && (
                <Grid item lg={6} xs={12}>
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
                      )} (${this.props.inactiveContracts?.length})`}
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
                      dense
                      divider
                      contractList={this.props.inactiveContracts}
                      loading={this.props.contractLoading}
                      onRestore={
                        hasEditPermission && this.handleRestoreContract
                      }
                      paymentComboList={this.props.paymentComboList}
                      paymentPackList={this.props.paymentPackList}
                      privatePassList={this.props.privatePassList}
                    />
                  )}
                </Grid>
              )}
            </Grid>
            {hasCreatePermission && (
              <BottomActionsButton
                onCreate={this.props.onRequestCreate}
                onCreateLabel={this.props.t(
                  'subscription:contract.actions.create',
                )}
              />
            )}
            {this.props.contractRegisterOpen &&
            this.props.selectedContract &&
            !!stripeRegion &&
            !!companyCountry ? (
              <SubscriptionContractRegister
                cardBillingDetailsMandatory={
                  this.props.theme.force_billing_details_on_cards
                }
                companyId={this.props.companyId}
                contract={this.props.selectedContractData}
                enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
                  {
                    currency: this.props.theme.currency,
                    companyCountry,
                    withCredit: true,
                    withTerminal: true,
                    stripeRegion,
                  },
                )}
                enableMultiLocalization={
                  this.props.theme.enable_multi_localization
                }
                establishments={this.props.establishmentList}
                generalTermsAndConditions={
                  this.props.theme.general_terms_and_conditions
                }
                member={this.props.memberToBill}
                onChangeMember={this.props.setMemberToBill}
                onClose={this.props.closeContractRegister}
                onlinePaymentEnabled={this.props.theme.online_payment_enabled}
                open={this.props.contractRegisterOpen}
                refreshSavedPaymentMethodList={
                  this.props.fetchPaymentMethodList
                }
                registerContractBackground={
                  this.props.registerContractBackground
                }
                requestSetupIntentSecret={this.props.requestSetupIntentSecret}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
                searchedMembers={this.props.searchedMembers}
                searchLoading={this.props.searchMemberLoading}
                searchMembers={this.props.searchMembers}
                stripeReaders={this.props.stripeReaders || []}
                waiver={this.props.theme.waiver}
              />
            ) : null}
            <SubscriptionContractFormDrawer
              displayNewCheckoutFlow={
                this.props.theme.display_new_checkout_flow
              }
              onClose={this.props.onCloseCreate}
              onSubmit={this.props.onCreate}
              open={this.props.createContractFormOpen}
              paymentComboList={this.props.paymentComboList}
              paymentPackList={this.props.paymentPackList}
              privatePassList={this.props.privatePassList}
            />
          </div>
        )}
      </ObjectLevelPermissionProviderComponent>
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
  companyId: themeSelectors.getTheme(state).company,
  contractListManagerOnly: withContractNotification(
    withPaymentPack(getAvailableContractListManager),
  )(state),
  contractListAvailableAll: withContractNotification(
    withPaymentPack(getAvailableContractListCustomer),
  )(state),
  inactiveContracts: withContractNotification(
    withPaymentPack(getInactiveContractList),
  )(state),
  contractLoading: state.subscription.contract.loading,
  paymentPackList: getPaymentPackEnabled(state),
  privatePassList: getPrivatePassAvailable(state),
  paymentComboList: getPaymentComboList(state),
  searchedMembers: getSearchedMembers(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  stripeReaders: getStripeReaders(state),
  establishmentList: getAvailableEstablishmentList(state),
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
  fetchStripeReaders,
  fetchMarketingNotificationList,
  fetchEstablishments,
  registerContractBackground: registerContractBackgroundAction,
  displayBackgroundDialog: displayBackgroundDialogAction,
  deletebackgroundDialog: deletebackgroundDialogAction,
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
  registerContractBackground:
    ({
      registerContractBackground,
      displayBackgroundDialog,
      deletebackgroundDialog,
      setContractRegisterOpen,
      t,
    }) =>
    (id: number, data: any, options: OptionCallback) => {
      const uuid = uuid4();
      displayBackgroundDialog(
        uuid,
        t('subscription:register.dialog.info'),
        '',
        undefined,
        ACTION_MODE_REDIRECT,
        DISPLAY_INFORMATION,
      );
      registerContractBackground(id, data, {
        onError: (err) => {
          deletebackgroundDialog(uuid);
          if (options?.onError) options?.onError(err);
        },
        onSuccess: () => {
          setContractRegisterOpen(false);
        },
        onBackgroundError: () => {
          deletebackgroundDialog(uuid);
        },
        onBackgroundSuccess: (responseData) => {
          deletebackgroundDialog(uuid);
          displayBackgroundDialog(
            uuid4(),
            t('subscription:register.dialog.success', {
              name: responseData?.billing_plan?.name || '',
            }),
            '',
            responseData?.billing_plan?.id
              ? `/subscription/${responseData.billing_plan.id}`
              : undefined,
            ACTION_MODE_REDIRECT,
            DISPLAY_SUCCESS,
          );
          if (options?.onSuccess) options.onSuccess(responseData);
        },
      });
    },
  /*
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
   */
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
    t('navigation:backofficeMenu.contract'),
  ),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
  connect((state, { selectedContract }) => ({
    selectedContractData: getContract(state, selectedContract),
  })),
)(SubscriptionList);
