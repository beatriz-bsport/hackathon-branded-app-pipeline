import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { Theme, WithStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import memoize from 'memoize-one';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';
import { TFunction } from 'i18next';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import BottomActionsButtonCustom from '#src/components/button/BottomActionsButtonCustom.component';
// @ts-expect-error
import ContractDeleteDialog from '#src/libs/subscription/components/SubscriptionContractDeleteModal.component';
import PaginatedSubscriptionList from '#src/libs/subscription/components/PaginatedSubscriptionList.component';
import themeSelectors from '#src/libs/theme/selectors';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import { getContractDetailNotifications } from '#src/libs/marketing/selectors';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchAllPaymentPackCategory,
  refreshAllPaymentPack,
  updatePaymentPackCompatibilities as updatePaymentPackCompatibilitiesAction,
  fetchOne as fetchPaymentPackAction,
} from '#src/libs/payment-packs/actions';
import {
  fetchActivitiesCompany,
  fetchMetaActivities as fetchMetaActivitiesAction,
} from '#src/libs/meta-activity/actions';
import {
  fetchAllPrivateServices,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  fetchAllPrivateSlots,
  fetchPrivatePassList,
  fetchPrivatePassRetrieve as fetchPrivatePassRetrieveAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  updateCompatibleServicePass,
} from '#src/libs/private-service/actions';

import { fetchPaymentComboList } from '#src/libs/payment-combo/actions';
import { getAllSmartList } from '#src/libs/smart-list/selectors';
import { fetchAllSmartLists } from '#src/libs/smart-list/actions';
import {
  getPrivatePassAvailable,
  getCompatibilityPassWithService as getCompatibleServicePass,
  withAvailable,
  withServices,
  getPrivatePass,
} from '#src/libs/private-service/selectors/private-pass';
import { fetchTags } from '#src/libs/tag/actions';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification as updateMarketingNotificationAction,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#src/libs/marketing/actions';
import {
  getResolvedGenericTags,
  getTagCategories,
} from '#src/libs/notification-rule/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList,
} from '#src/libs/notification-rule/actions';
import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#src/libs/email-editor/actions';
import {
  getContract,
  withPaymentPack,
  getContractDetailSubscription,
  getContractPauseList,
} from '#src/libs/subscription/selectors';
import {
  getEnabled as getPaymentPackEnabled,
  withEstablishments,
  withMetaActivities,
  withSCT,
  getPaymentPack,
} from '#src/libs/payment-packs/selectors';
import ContractDetail from '#src/libs/subscription/components/contract/contract-revamp/ContractDetailRevamp.component';
import ContractPauseListItemDetail from '#src/libs/subscription/components/contract/ContractPauseListItemDetail.component';
import {
  fetchContractDetail as fetchContractDetailAction,
  deleteContract,
  createOrUpdateContractPause,
  updateOnlyContractPauseName,
  deleteContractPause,
  fetchSubscriptionList as fetchSubscriptionListAction,
  fetchSubscriptionBulk,
  fetchContractPauseList,
  updateContract as updateContractAction,
} from '#src/libs/subscription/actions';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#src/libs/member/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';

import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';

import { snackbarSuccess } from '#src/libs/snackbar/actions';
import type {
  Contract,
  ContractPauseDetails,
  Subscription,
} from '#src/libs/subscription/types';
import { getMergeTags } from '#src/libs/marketing/utils';
import MarketingRuleFormContract from '#src/libs/marketing/components/marketing-rule-form/MarketingRuleFormContract.component';
import MarketingRuleListItemContract from '#src/libs/marketing/components/marketing-rule-list-item/MarketingRuleListItemContract.component';
import ContractPauseFormDialog from '#src/libs/subscription/components/contract/ContractPauseFormDialog.component';
import type { ResolvedGenericTags } from '#src/libs/email-editor/types';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { RootState } from '../../reducers';
import { getAvailablePaymentComboList } from '#src/libs/payment-combo/selectors';
import type { OptionCallback } from '../../state/types';
import ContractOneObjectFormDrawer from '#src/libs/subscription/components/contract/contract-revamp/ContractOneObjectFormDrawer.component';
import { getAvailableEstablishmentList } from '#src/libs/establishment/selectors';
import { uniqBy } from 'lodash';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#src/libs/meta-activity/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import {
  getBookkeepingAccountById,
  getBookkeepingAccountList,
} from '#src/libs/payment/selectors';
import { getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import type { PrivateServiceCompatibilityPass } from '#src/libs/private-service/types';
import type { PaymentPackCompatibilitiesData } from '#src/libs/payment-packs/types';

type OwnProps = {
  contractId: number;
  page: number;
  deleteContractModalOpen: boolean;
  deleteNotificationModalOpen: boolean;
  contractToEdit?: Contract;
  setDeleteContractModalOpen: (open: boolean) => void;
  setDeleteNotificationModalOpen: (open: boolean) => void;
  setContractToEdit: (contract?: Contract) => void;
  closeForm: () => void;
  submitNotificationForm: (data: any) => void;
  submitEditForm: (data: any, options?: OptionCallback) => void;
  contractPauseLoading: boolean;
  setContractPauseLoading: (pause: boolean) => void;
  contractPauseFormOpen: boolean;
  contractNotificationFormOpen: boolean;
  setContractNotificationFormOpen: (open: boolean) => void;
  setContractPauseOpen: (open: boolean) => void;
  selectedNotification: any;
  setSelectedNotification: (notification: any) => void;
  fetchSubscriptionsByContract: (
    page: number,
    page_size: number,
    options?: OptionCallback<Array<Subscription>>,
  ) => void;
  fetchMembersBySubscription: (subscriptions: Array<Subscription>) => void;
  fetchNotificationsAndTemplates: () => void;
  contractPauseToUpdate: ContractPauseDetails;
  setContractPauseToUpdate: (cp?: ContractPauseDetails) => void;
  fetchResolvedGenericTags: () => void;
  resolvedGenericTags: ResolvedGenericTags;
  fetchCompatibleServicePasses: (privatePassId: number) => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

const SUBSCRIPTION_PAGINATION_SIZE = 7;

export class ContractDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchContractDetail(this.props.contractId, {
      onSuccess: (contract) => {
        if (!!contract?.private_pass) {
          this.props.fetchCompatibleServicePasses(contract.private_pass);
        }
      },
    });
    this.props.refreshAllPaymentPack();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchTagList();
    this.props.fetchResolvedGenericTags();
    this.props.fetchNotificationsAndTemplates();
    this.props.fetchSubscriptionsByContract(1, SUBSCRIPTION_PAGINATION_SIZE);
    this.props.fetchContractPauseList(
      { contract: this.props.contractId },
      { onSuccess: () => this.props.setContractPauseLoading(false) },
    );
    this.props.fetchTags();
    this.props.fetchActivitiesCompany(this.props.companyId);
    this.props.fetchEstablishments();
    this.props.fetchMetaActivities();
    this.props.fetchAllPaymentPackCategory();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
    this.props.fetchAllPrivateServices();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !!this.props.contract?.private_pass &&
      prevProps.privatePass?.private_services.length !==
        this.props.privatePass?.private_services.length
    ) {
      this.props.fetchCompatibleServicePasses(
        this.props.contract.private_pass.id,
      );
    }
  }

  onCreateNewContractPause = () => {
    this.props.setContractPauseToUpdate(null);
    this.props.setContractPauseOpen(true);
  };

  openContractNotificationForm = () =>
    this.props.setContractNotificationFormOpen(true);

  onSubscriptionListPageRequested = (page: number, pageSize: number) =>
    this.props.fetchSubscriptionsByContract(page, pageSize, {
      onSuccess: (subs: Array<Subscription>) => {
        this.props.fetchMembersBySubscription(subs);
      },
    });

  deleteContractPauseFunction = (contractPause: ContractPauseDetails) => () =>
    this.props.deleteContractPause(contractPause);

  updateContractPauseFunction = (contractPause: ContractPauseDetails) => () => {
    this.props.setContractPauseToUpdate(contractPause);
    this.props.setContractPauseOpen(true);
  };

  closeContractPauseForm = () => this.props.setContractPauseOpen(false);

  onContractEdit = () => this.props.setContractToEdit(this.props.contract);

  openDeleteContractModal = () => this.props.setDeleteContractModalOpen(true);

  closeDeleteContractModal = () => this.props.setDeleteContractModalOpen(false);

  deleteContract = (id: number) => {
    this.props.deleteContract(id, {
      onSuccess: this.props.goToList,
    });
  };

  closeContractFormDrawer = () => this.props.setContractToEdit(null);

  submitContractForm = (data: any, options: OptionCallback) => {
    this.props.submitEditForm(data, {
      onSuccess: () => {
        this.props.setContractToEdit(null);
        if (!!this.props.contract?.payment_pack) {
          this.props.fetchPaymentPackRetrieve(
            this.props.contract.payment_pack.id,
          );
        }
        if (!!this.props.contract?.private_pass) {
          this.props.fetchPrivatePassRetrieve(
            this.props.contract.private_pass.id,
          );
          this.props.fetchCompatibleServicePasses(
            this.props.contract.private_pass.id,
          );
        }
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: (err) => {
        if (options && options.onError) options.onError(err);
      },
    });
  };

  getCompany = memoize((theme: CompanyTheme) => ({
    id: theme.company,
    name: theme.company_name,
  }));

  getBottomActionsProperties = memoize((t: TFunction) => [
    {
      onClick: this.onCreateNewContractPause,
      text: t('pauseV2.common.actions.pause'),
      icon: <PauseIcon />,
      color: 'secondary',
      disabled: !!this.props.contract?.month_billing_day,
      popOverTitle: this.props.contract?.month_billing_day
        ? t('subscription.freeze.disabledReasons.month_billing_day')
        : null,
    },
  ]);

  updatePaymentPackCompatibilities = (data: PaymentPackCompatibilitiesData) => {
    if (!this.props.contract?.payment_pack) return;
    this.props.updatePaymentPackCompatibilities({
      paymentPackId: this.props.contract?.payment_pack.id,
      data,
    });
  };

  render() {
    if (this.props.loading || !this.props.contract) {
      return <LinearProgress />;
    }
    const { classes, t } = this.props;

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
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'product.contract.allowed_actions.edit',
          'product.contract.allowed_actions.delete',
          'product.contract.allowed_actions.pause',
          'member.allowed_actions.manageNotification',
        ]}
      >
        {([
          hasEditPermission,
          hasDeletePermission,
          hasPausePermission,
          hasMembersManageNotification,
        ]: boolean[]) => (
          <div className={classes.pageContainer}>
            <Grid container alignItems="stretch" spacing={3}>
              <Grid item className={classes.detailContainer} md={6} xs={12}>
                <ContractDetail
                  availableEstablishmentList={
                    this.props.availableEstablishmentList
                  }
                  categoryList={categoryList}
                  company={this.getCompany(this.props.theme)}
                  companyTheme={this.props.theme}
                  compatibleServicePass={this.props.compatibleServicePass}
                  contract={this.props.contract}
                  createCompatibleServicePass={
                    this.props.createCompatibleServicePass
                  }
                  deleteCompatibleServicePass={
                    this.props.deleteCompatibleServicePass
                  }
                  displayStopSubscriptionFromMemberSide={
                    !!this.props.theme
                      ?.display_stop_subscription_from_member_side
                  }
                  metaActivityList={this.props.metaActivityList}
                  openContractForm={
                    hasEditPermission ? this.onContractEdit : undefined
                  }
                  // @ts-expect-error - Legacy HOC typing issue
                  paymentPack={this.props.paymentPack}
                  privatePass={this.props.privatePass}
                  // @ts-expect-error - Legacy typing issue
                  privateServices={this.props.privateServices}
                  snackbarSuccess={this.props.snackbarSuccess}
                  updateCompatibleServicePass={
                    this.props.updateCompatibleServicePass
                  }
                  updatePaymentPackCompatibilities={
                    this.updatePaymentPackCompatibilities
                  }
                />
                <MarketingRuleListItemContract
                  deleteNotification={this.props.deleteMarketingNotification}
                  deleteNotificationModalOpen={
                    this.props.deleteNotificationModalOpen
                  }
                  emails={this.props.email_templates_list}
                  notifications={this.props.notifications}
                  selectedNotification={this.props.selectedNotification}
                  setContractNotificationFormOpen={
                    this.props.setContractNotificationFormOpen
                  }
                  setDeleteNotificationModalOpen={
                    this.props.setDeleteNotificationModalOpen
                  }
                  setSelectedNotification={this.props.setSelectedNotification}
                  // @ts-expect-error
                  smartLists={this.props.smartLists}
                  updateNotification={this.props.updateMarketingNotification}
                />
                {hasMembersManageNotification && (
                  <div className={classes.notificationButtonContainer}>
                    <Button
                      color="primary"
                      onClick={this.openContractNotificationForm}
                      variant="outlined"
                    >
                      {t('addNotification')}
                    </Button>
                  </div>
                )}
                {this.props.contractNotificationFormOpen && (
                  <MarketingRuleFormContract
                    emailDetailLoading={this.props.emailDetailLoading}
                    emailDetails={this.props.email_templates_details}
                    emailListLoading={this.props.emailListLoading}
                    emails={this.props.email_templates_list}
                    getEmailDetail={this.props.fetchEmailTemplateDetail}
                    getEmails={this.props.fetchEmailTemplatesSummaries}
                    getSmartLists={this.props.getSmartLists}
                    goToSmartlist={this.props.goToSmartlist}
                    id={this.props.contractId}
                    initial={this.props.selectedNotification}
                    onCancel={this.props.closeForm}
                    onSubmit={this.props.submitNotificationForm}
                    resolvedGenericTags={this.props.resolvedGenericTags}
                    smartListLoading={this.props.smartListLoading}
                    // @ts-expect-error
                    smartLists={this.props.smartLists}
                    // @ts-expect-error
                    tags={getMergeTags(this.props.tagCategories, t)}
                  />
                )}
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography className={classes.title} variant="h6">
                  {t('associatedSubscriptions')}
                </Typography>
                <Paper>
                  <PaginatedSubscriptionList
                    itemPerPage={SUBSCRIPTION_PAGINATION_SIZE}
                    // @ts-expect-error
                    items={this.props.subscriptions.items}
                    loading={this.props.subscriptions.loading}
                    nbItems={this.props.subscriptions.count}
                    onClick={this.props.goToSubscription}
                    onPageRequested={this.onSubscriptionListPageRequested}
                    page={this.props.page}
                  />
                </Paper>
                {this.props.contractPauseLoading ? (
                  <div className={classes.loadingContainer}>
                    <CircularProgress />
                  </div>
                ) : (
                  <div className={classes.pauseContainer}>
                    {!!this.props.contractPauseList.length && (
                      <Typography variant="h5">
                        {t('pauseV2.contractPause.title')}
                      </Typography>
                    )}
                    {this.props.contractPauseList.map(
                      (cp: ContractPauseDetails) => (
                        <div key={cp.id} className={classes.pauseItemContainer}>
                          <ContractPauseListItemDetail
                            contractPause={cp}
                            fetchMembersBySubscription={
                              this.props.fetchMembersBySubscription
                            }
                            fetchSubscriptionBulk={
                              this.props.fetchSubscriptionBulk
                            }
                            goToSubscription={this.props.goToSubscription}
                            onDeletePause={this.deleteContractPauseFunction(cp)}
                            onUpdatePause={this.updateContractPauseFunction(cp)}
                            onUpdatePauseName={
                              this.props.updateContractPauseName
                            }
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}
                {this.props.contractPauseFormOpen && (
                  <ContractPauseFormDialog
                    closeForm={this.closeContractPauseForm}
                    contractId={this.props.contractId}
                    contractPauseBeingEdited={this.props.contractPauseToUpdate}
                    fetchMembersBySubscription={
                      this.props.fetchMembersBySubscription
                    }
                    fetchSubscriptionBulk={this.props.fetchSubscriptionBulk}
                    onSubmit={this.props.createOrUpdateContractPause}
                    openForm={this.props.contractPauseFormOpen}
                    subscriptionData={this.props.subscriptionData}
                  />
                )}
              </Grid>
              <BottomActionsButtonCustom
                // @ts-expect-error
                buttonsProperties={
                  hasPausePermission ? this.getBottomActionsProperties(t) : null
                }
                onDelete={
                  hasDeletePermission &&
                  !this.props.contract?.contract_template &&
                  this.openDeleteContractModal
                }
                onEdit={hasEditPermission && this.onContractEdit}
              />
              <ContractDeleteDialog
                contractToDeleteId={
                  this.props.deleteContractModalOpen
                    ? this.props.contract.id
                    : null
                }
                deleteContract={this.deleteContract}
                onClose={this.closeDeleteContractModal}
              />
            </Grid>
            <ContractOneObjectFormDrawer
              allowGuestMaster={
                this.props.theme.allow_guest_activatable &&
                this.props.theme.allow_guest
              }
              availableEstablishmentList={this.props.availableEstablishmentList}
              bookkeepingAccountById={this.props.bookkeepingAccountById}
              bookkeepingAccounts={this.props.bookkeepingAccounts}
              categoryList={categoryList}
              compatibleServicePass={this.props.compatibleServicePass}
              displayStopSubscriptionFromMemberSide={
                !!this.props.theme?.display_stop_subscription_from_member_side
              }
              initial={this.props.contract}
              metaActivityList={this.props.metaActivityList}
              onClose={this.closeContractFormDrawer}
              onSubmit={this.submitContractForm}
              open={!!this.props.contractToEdit}
              paymentPackList={this.props.paymentPackList}
              privatePassList={this.props.privatePassList}
              // @ts-expect-error - Legacy typing issue
              privateServices={this.props.privateServices}
              provincialTax={this.props.theme?.provincial_tax_value}
              // @ts-expect-error - Legacy typing issue
              tagList={this.props.allTagsWithTagGroup}
            />
          </div>
        )}
      </ObjectLevelPermissionProvider>
    );
  }
}

const styles = (theme: Theme) => ({
  detailContainer: {
    padding: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
  },
  loadingContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
  },
  pauseContainer: {
    paddingTop: theme.spacing(4),
  },
  pauseItemContainer: {
    paddingTop: theme.spacing(3),
  },
  notificationButtonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  pageContainer: {
    paddingBottom: '10vh',
  },
});

const connector = connect(
  (state: RootState, { contractId }: { contractId: number }) => {
    // @ts-expect-error
    const contract = withPaymentPack(getContract)(state, contractId);

    return {
      companyId: themeSelectors.getTheme(state).company,
      loading: state.subscription.contract.loading,
      subscriptions: getContractDetailSubscription(state),
      contract,
      paymentPack: !!contract?.payment_pack
        ? withSCT(
            // @ts-expect-error
            withMetaActivities(
              // @ts-expect-error
              withEstablishments(getPaymentPack),
            ),
            // @ts-expect-error
          )(state, contract.payment_pack.id)
        : undefined,
      privatePass: !!contract?.private_pass
        ? withAvailable(withServices(getPrivatePass))(
            state,
            // @ts-expect-error
            contract.private_pass.id,
          )
        : undefined,
      paymentPackList: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.loading,
      emailDetailLoading: state.emailTemplate.detail.loading,
      paymentComboList: getAvailablePaymentComboList(state),
      theme: themeSelectors.getTheme(state),
      // @ts-expect-error
      contractPauseList: getContractPauseList(state, contractId),
      subscriptionData: state.subscription.byId,
      tagCategories: getTagCategories(state),
      notifications: getContractDetailNotifications(state),
      smartLists: getAllSmartList(state),
      smartListLoading: state.smartList.loading,
      resolvedGenericTags: getResolvedGenericTags(state),
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
      bookkeepingAccounts: getBookkeepingAccountList(state),
      bookkeepingAccountById: getBookkeepingAccountById(state),
      privateServices: getPrivateServices(state),
      compatibleServicePass: getCompatibleServicePass(state),
    };
  },
  {
    fetchContractDetail: fetchContractDetailAction,
    fetchContractPauseList,
    deleteContract,
    createOrUpdateContractPause,
    deleteContractPause,
    updateContractPauseName: updateOnlyContractPauseName,
    refreshAllPaymentPack,
    fetchPrivatePassList,
    fetchTagList,
    fetchPaymentComboList,
    fetchSubscriptionList: fetchSubscriptionListAction,
    fetchFilteredMembers: fetchFilteredMembersAction,
    fetchSubscriptionBulk,
    fetchMarketingNotificationList: fetchMarketingNotificationListAction,
    snackbarSuccess,
    fetchEmailTemplatesSummaries,
    fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    goToList: () => push('/subscription/contract'),
    goToSubscription: (id: number) => push(`/subscription/${id}`),
    updateMarketingNotification: updateMarketingNotificationAction,
    deleteMarketingNotification: deleteMarketingNotificationAction,
    createNotification: createMarketingNotificationAction,
    goToSmartlist: () => push('/smart-list/'),
    getSmartLists: fetchAllSmartLists,
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    fetchTags,
    fetchPaymentPackList: fetchPaymentPackListAction,
    fetchActivitiesCompany,
    fetchMetaActivities: fetchMetaActivitiesAction,
    fetchAllPaymentPackCategory,
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
    fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
    fetchPrivateSlotsByService: fetchAllPrivateSlots,
    fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
    fetchEstablishments,
    updateContract: updateContractAction,
    updatePaymentPackCompatibilities: updatePaymentPackCompatibilitiesAction,
    fetchPaymentPackRetrieve: fetchPaymentPackAction,
    fetchPrivatePassRetrieve: fetchPrivatePassRetrieveAction,
    createCompatibleServicePass,
    deleteCompatibleServicePass,
    updateCompatibleServicePass,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['subscription']),
  routerParamsToProps({ id: 'contractId:number' }),
  withState('deleteContractModalOpen', 'setDeleteContractModalOpen', false),
  withState(
    'deleteNotificationModalOpen',
    'setDeleteNotificationModalOpen',
    false,
  ),
  withState('contractToEdit', 'setContractToEdit', null),
  withState('page', 'setPage', 1),
  withState(
    'contractNotificationFormOpen',
    'setContractNotificationFormOpen',
    false,
  ),
  withState('selectedNotification', 'setSelectedNotification', null),
  withState('contractPauseFormOpen', 'setContractPauseOpen', false),
  withState('contractPauseLoading', 'setContractPauseLoading', true),
  withState('contractPauseToUpdate', 'setContractPauseToUpdate', null),
  connector,
  withHandlers({
    fetchSubscriptionsByContract:
      ({ fetchSubscriptionList, setPage, contractId }) =>
      (page: number, page_size: number, options: OptionCallback) => {
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
    closeForm:
      ({ setContractNotificationFormOpen, setSelectedNotification }) =>
      () => {
        setSelectedNotification(null);
        setContractNotificationFormOpen(false);
      },
    submitNotificationForm:
      ({
        createNotification,
        updateMarketingNotification,
        selectedNotification,
        setContractNotificationFormOpen,
        setSelectedNotification,
      }) =>
      (data: any) => {
        if (selectedNotification !== null) {
          updateMarketingNotification(selectedNotification.id, data);
        } else {
          createNotification(data);
        }
        setContractNotificationFormOpen(false);
        setSelectedNotification(null);
      },
    submitEditForm:
      ({ updateContract, fetchContractDetail, contractId }) =>
      (data: any, options: OptionCallback) => {
        updateContract(data, {
          onSuccess: () => {
            fetchContractDetail(contractId);
            if (options && options.onSuccess) {
              options.onSuccess();
            }
          },
        });
      },
    fetchNotificationsAndTemplates:
      ({
        contractId,
        fetchMarketingNotificationList,
        fetchEmailTemplateSummariesBulk,
      }) =>
      () => {
        fetchMarketingNotificationList(
          {
            kind__in: [
              NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
              NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
              NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
            ],
            event_rules__contract_id: contractId,
          },
          {
            onSuccess: (notificationList: any) => {
              fetchEmailTemplateSummariesBulk(
                notificationList.map(
                  (notification: any) => notification.email_design,
                ),
              );
            },
          },
        );
      },
    fetchMembersBySubscription:
      ({ fetchFilteredMembers }) =>
      (subscriptions: Array<Subscription>) => {
        fetchFilteredMembers({
          id__in: subscriptions.map((b) => b.member),
        });
      },
    fetchBookkeepingAccountList:
      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({ is_active: true }),
    fetchCompatibleServicePasses:
      ({ fetchCompatibleServicePassList, fetchPrivateSlotsByService }) =>
      (privatePassId: number) =>
        fetchCompatibleServicePassList(privatePassId, {
          onSuccess: (csps: PrivateServiceCompatibilityPass[]) => {
            const private_service__in = csps?.map(
              (c: PrivateServiceCompatibilityPass) => c.private_service,
            );
            if (private_service__in?.length !== 0) {
              fetchPrivateSlotsByService({
                private_service__in,
              });
            }
          },
        }),
  }),
)(ContractDetailPage);
