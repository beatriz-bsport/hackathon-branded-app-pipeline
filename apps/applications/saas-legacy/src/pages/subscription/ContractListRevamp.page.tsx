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
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchAllPaymentPackCategory,
} from '#src/libs/payment-packs/actions';

import { TFunction } from 'i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

import { withContractNotification } from '#src/libs/marketing/selectors';
import { fetchTags } from '#src/libs/tag/actions';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { fetchMarketingNotificationList } from '#src/libs/marketing/actions';
import {
  displayBackgroundDialog as displayBackgroundDialogAction,
  deletebackgroundDialog as deletebackgroundDialogAction,
} from '#src/libs/background-dialog/actions';
import { fetchStripeReaders } from '#src/libs/terminal/actions';
import { getStripeReaders } from '#src/libs/terminal/selectors';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import {
  BackgroundDialogDisplayMode,
  BackgroundDialogActionMode,
} from '#src/libs/background-dialog/types';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
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
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishments,
} from '../../libs/establishment/actions';
import { getAvailablePaymentComboList } from '#src/libs/payment-combo/selectors';
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
} from '../../libs/establishment/selectors';
import { fetchMetaActivities as fetchMetaActivitiesAction } from '#src/libs/meta-activity/actions';

import withTitle from '../../hocs/with-title.hoc';

import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
// @ts-expect-error
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
// @ts-expect-error
import { FormValues as SubscriptionContractFormValues } from '../../libs/subscription/components/SubscriptionContractForm.component';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';
import { search as searchMembers } from '../../libs/member/actions';
import { getSearchedMembers } from '../../libs/member/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import {
  getInactiveContractList,
  getAvailableContractListManager,
  getAvailableContractListCustomer,
  getContract,
  withPaymentPack,
} from '#src/libs/subscription/selectors';
import {
  createOrUpdateContract as createOrUpdateContractAction,
  fetchContractList as fetchContractListAction,
  deleteContract,
  restoreContract,
  fetchSubscriptionBulk as fetchSubscriptionBulkAction,
  registerContractBackground as registerContractBackgroundAction,
} from '../../libs/subscription/actions';

import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '#src/state/types';
import type {
  Contract,
  ContractWithPaymentPack,
} from '#src/libs/subscription/types';
import type { TagGroupAPI } from '#src/libs/tag/types';
import { Member } from '../../libs/member/types';

// @ts-expect-error js file
import SubscriptionContractListItem from '#src/libs/subscription/components/SubscriptionContractListItem.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';
import ContractOneObjectFormDrawer from '#src/libs/subscription/components/contract/contract-revamp/ContractOneObjectFormDrawer.component';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#src/libs/meta-activity/selectors';
import uniqBy from 'lodash/uniqBy';
import { getEditableSCTs } from '#src/libs/category/selectors';

type ContractSearchOptionData = {
  tagList: {
    group: TagGroupAPI;
    id: number;
    name: string;
    color: string;
    icon: string;
    tag_template?: number;
  }[];
  company: { id: number; name: string };
  contract: ContractWithPaymentPack;
  label: string;
  onClick: (() => void) | null;
  onDelete: (() => void) | null;
  onEdit: (() => void) | null;
  onRegister: (() => void) | null;
  selectedContract: number | null;
  value: number;
};

const Option: React.ComponentType<
  OptionPropsWithData<ContractSearchOptionData>
> = (props) => <SubscriptionContractListItem dense divider {...props.data} />;

export class SubscriptionList extends React.Component<Props, State> {
  state: State = {
    contractToEditFromSearch: null,
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
    this.props.fetchMetaActivities();
    this.props.fetchAllPaymentPackCategory();
    if (this.props.theme.enable_multi_localization) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.companyId },
      });
    }
    this.props.fetchTags();
  }

  readonly searchBarAdditionalParams = {
    manager_only: false,
    disabled: false,
    is_usable_by_staff: true,
  };

  refreshSearchBarOptions = () =>
    this.props.refreshOptions('contract', this.searchBarAdditionalParams);

  setContractToEditFromSearch = (contract: Contract) =>
    this.setState({
      contractToEditFromSearch: { ...contract },
    });

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

  handleEditContract = (
    data: SubscriptionContractFormValues,
    options?: OptionCallback<void>,
  ) => {
    this.props.createOrUpdateContract(data, {
      onSuccess: () => {
        this.props.fetchContractList();
        this.setState({
          contractToEditFromSearch: null,
        });
        this.refreshSearchBarOptions();
        if (options && options.onSuccess) {
          options.onSuccess();
        }
      },
    });
  };

  handleRestoreContract = (id: number) => {
    this.props.restoreContract(id, {
      onSuccess: () => {
        this.props.fetchContractList();
        this.refreshSearchBarOptions();
      },
    });
  };

  handleDeleteContract = (id: number) => {
    this.props.deleteContract(id, {
      onSuccess: () => {
        this.props.fetchContractList();
        this.refreshSearchBarOptions();
      },
    });
  };

  searchOptionsFormatters =
    (
      hasCreateBillingPlanPermission: boolean,
      hasDeletePermission: boolean,
      hasEditPermission: boolean,
    ) =>
    (contracts: Contract[]): ContractSearchOptionData[] =>
      // @ts-expect-error - Fixed next PR
      contracts.map((contract) => {
        return {
          contract: {
            ...contract,
            payment_pack: this.props.paymentPackList.find(
              (paymentPack) => contract.payment_pack === paymentPack.id,
            ),
            private_pass: this.props.privatePassList.find(
              (privatePass) => contract.private_pass === privatePass.id,
            ),
            payment_combo: this.props.paymentComboList.find(
              (paymentCombo) => contract.payment_combo === paymentCombo.id,
            ),
          },
          label: contract.name,
          value: contract.id,
          company: {
            id: this.props.theme.company,
            name: this.props.theme.company_name,
          },
          onClick: () => this.onClickContract(contract.id),
          tagList: this.props.allTagsWithTagGroup,
          onDelete: hasDeletePermission
            ? () => this.handleDeleteContract(contract.id)
            : null,
          onEdit: hasEditPermission
            ? () => this.setContractToEditFromSearch(contract)
            : null,
          onRegister: hasCreateBillingPlanPermission
            ? () => this.props.openContractRegister(contract)
            : null,
          selectedContract: this.props.selectedContract,
        };
      });

  render() {
    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    const categoryList = [...this.props.categoryList]
      .filter(
        (category) =>
          this.props.metaActivityList.map((a) => a.SCT).indexOf(category.id) !==
          -1,
      )
      .concat(this.props.videoCategories)
      .filter(
        (value, index, arr) =>
          arr.findIndex((sct) => sct.id === value.id) === index,
      );

    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.contract.allowed_actions.create',
          'product.contract.allowed_actions.edit',
          'product.contract.allowed_actions.delete',
          'product.contract.allowed_actions.createBillingPlan',
          'billing.allowed_actions.createInvoice',
          'billing.allowed_actions.takePayment',
        ]}
      >
        {([
          hasCreatePermission,
          hasEditPermission,
          hasDeletePermission,
          hasCreateBillingPlanPermission,
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
                <ObjectSearchComponent
                  additionalParams={this.searchBarAdditionalParams}
                  components={{
                    Option,
                  }}
                  optionsFormatter={this.searchOptionsFormatters(
                    hasCreateBillingPlanPermission,
                    hasDeletePermission,
                    hasEditPermission,
                  )}
                  placeholder={this.props.t('search')}
                  searchedObjectType="contract"
                  variant="underlined"
                />
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
                    displayStopSubscriptionFromMemberSide={
                      !!this.props.theme
                        ?.display_stop_subscription_from_member_side
                    }
                    loading={this.props.contractLoading}
                    onClick={this.onClickContract}
                    onDelete={hasDeletePermission && this.handleDeleteContract}
                    onEdit={hasEditPermission && this.handleEditContract}
                    onRegister={
                      hasCreateBillingPlanPermission &&
                      this.props.openContractRegister
                    }
                    paymentComboList={this.props.paymentComboList}
                    paymentPackList={this.props.paymentPackList}
                    privatePassList={this.props.privatePassList}
                    selectedContract={this.props.selectedContract}
                    tagList={this.props.allTagsWithTagGroup}
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
                    displayStopSubscriptionFromMemberSide={
                      !!this.props.theme
                        ?.display_stop_subscription_from_member_side
                    }
                    loading={this.props.contractLoading}
                    onClick={this.onClickContract}
                    onDelete={hasDeletePermission && this.handleDeleteContract}
                    onEdit={hasEditPermission && this.handleEditContract}
                    onRegister={
                      hasCreateBillingPlanPermission &&
                      this.props.openContractRegister
                    }
                    paymentComboList={this.props.paymentComboList}
                    paymentPackList={this.props.paymentPackList}
                    privatePassList={this.props.privatePassList}
                    selectedContract={this.props.selectedContract}
                    tagList={this.props.allTagsWithTagGroup}
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
                      displayStopSubscriptionFromMemberSide={
                        !!this.props.theme
                          ?.display_stop_subscription_from_member_side
                      }
                      loading={this.props.contractLoading}
                      onRestore={
                        hasEditPermission && this.handleRestoreContract
                      }
                      paymentComboList={this.props.paymentComboList}
                      paymentPackList={this.props.paymentPackList}
                      privatePassList={this.props.privatePassList}
                      tagList={this.props.allTagsWithTagGroup}
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
                // @ts-expect-error
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
                establishmentBillingGroups={
                  this.props.establishmentBillingGroups
                }
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
                // @ts-expect-error
                searchLoading={this.props.searchMemberLoading}
                searchMembers={this.props.searchMembers}
                stripeReaders={this.props.stripeReaders || []}
                waiver={this.props.theme.waiver}
              />
            ) : null}
            <ContractOneObjectFormDrawer
              allowGuestMaster={
                this.props.theme.allow_guest_activatable &&
                this.props.theme.allow_guest
              }
              availableEstablishmentList={this.props.availableEstablishmentList}
              categoryList={categoryList}
              displayStopSubscriptionFromMemberSide={
                !!this.props.theme?.display_stop_subscription_from_member_side
              }
              initial={this.state.contractToEditFromSearch}
              metaActivityList={this.props.metaActivityList}
              onClose={
                this.state.contractToEditFromSearch
                  ? () => this.setState({ contractToEditFromSearch: null })
                  : this.props.onCloseCreate
              }
              onSubmit={
                this.state.contractToEditFromSearch
                  ? this.handleEditContract
                  : this.props.onCreate
              }
              open={
                !!this.state.contractToEditFromSearch ||
                this.props.createContractFormOpen
              }
              // @ts-expect-error - Legacy typing issue
              tagList={this.props.allTagsWithTagGroup}
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
  contractToEditFromSearch: ContractWithPaymentPack | null;
};

type Props = MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  ConnectedProps &
  StateHandlerType &
  HandlersType &
  WithObjectSearch;

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
  paymentComboList: getAvailablePaymentComboList(state),
  searchedMembers: getSearchedMembers(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  stripeReaders: getStripeReaders(state),
  establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
  allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  availableEstablishmentList: getAvailableEstablishmentList(state),
  metaActivityList: uniqBy(
    [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
      ...getActivitiesByIdList(state, []),
    ],
    'id',
  ),
  categoryList: getEditableSCTs(state),
  videoCategories: state.video.filterableParams.items.SCTs,
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
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  fetchTags,
  fetchPaymentPackList: fetchPaymentPackListAction,
  fetchMetaActivities: fetchMetaActivitiesAction,
  fetchAllPaymentPackCategory,
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
      // @ts-expect-error
      _,
      { createOrUpdateContract, fetchContractList }: typeof mapDispatchToProps,
    ) =>
    // @ts-expect-error
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
      // @ts-expect-error
      registerContractBackground,
      // @ts-expect-error
      displayBackgroundDialog,
      // @ts-expect-error
      deletebackgroundDialog,
      // @ts-expect-error
      setContractRegisterOpen,
      // @ts-expect-error
      t,
    }) =>
    (id: number, data: any, options: OptionCallback) => {
      const uuid = uuid4();
      displayBackgroundDialog(
        uuid,
        t('subscription:register.dialog.info'),
        '',
        undefined,
        BackgroundDialogActionMode.REDIRECT,
        BackgroundDialogDisplayMode.INFORMATION,
      );
      registerContractBackground(id, data, {
        // @ts-expect-error
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
        // @ts-expect-error
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
            BackgroundDialogActionMode.REDIRECT,
            BackgroundDialogDisplayMode.SUCCESS,
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
  withObjectSearch,
  // @ts-expect-error
  withHandlers(mapWithHandlers),
  // @ts-expect-error
  connect((state, { selectedContract }) => ({
    // @ts-expect-error
    selectedContractData: getContract(state, selectedContract),
  })),
)(SubscriptionList);
