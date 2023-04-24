// @ts-nocheck
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
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import { TFunction } from 'i18next';
import { OptionCallback } from '../../state/types';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import BottomActionsButtonCustom from '#components/button/BottomActionsButtonCustom.component';
import ContractDeleteDialog from '#libs/subscription/components/SubscriptionContractDeleteModal.component';
import SubscriptionContractFormDrawer from '#libs/subscription/components/SubscriptionContractFormDrawer.component';
import PaginatedSubscriptionList from '#libs/subscription/components/PaginatedSubscriptionList.component';
import themeSelectors from '#libs/theme/selectors';
import { Theme as CompanyTheme } from '#libs/theme/types';
import { getContractDetailNotifications } from '#libs/marketing/selectors';

import { fetchPrivatePassList } from '#libs/private-service/actions';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
import { getAllSmartList } from '#libs/smart-list/selectors';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import { getPrivatePassAvailable } from '#libs/private-service/selectors/private-pass';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification as updateMarketingNotificationAction,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#libs/marketing/actions';
import {
  getResolvedGenericTags,
  getTagCategories,
} from '#libs/notification-rule/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList,
} from '#libs/notification-rule/actions';
import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';
import {
  getContract,
  withPaymentPack,
  getContractDetailSubscription,
  getContractPauseList,
} from '#libs/subscription/selectors';
import { getEnabled as getPaymentPackEnabled } from '#libs/payment-packs/selectors';
import ContractDetail from '#libs/subscription/components/contract/ContractDetail.component';
import ContractPauseListItemDetail from '#libs/subscription/components/contract/ContractPauseListItemDetail.component';
import {
  fetchContractDetail as fetchContractDetailAction,
  deleteContract,
  createOrUpdateContractPause,
  updateOnlyContractPauseName,
  deleteContractPause,
  createOrUpdateContract as createOrUpdateContractAction,
  fetchSubscriptionList as fetchSubscriptionListAction,
  fetchSubscriptionBulk,
  fetchContractPauseList,
} from '#libs/subscription/actions';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#libs/member/actions';
import { refreshAllPaymentPack } from '#libs/payment-packs/actions';
import { snackbarSuccess } from '#libs/snackbar/actions';
import {
  Contract,
  ContractPauseDetails,
  Subscription,
} from '#libs/subscription/types';
import { RootState } from '../../reducers';
import { getMergeTags } from '#libs/marketing/utils';
import MarketingRuleFormContract from '#libs/marketing/components/marketing-rule-form/MarketingRuleFormContract.component';
import MarketingRuleListItemContract from '#libs/marketing/components/marketing-rule-list-item/MarketingRuleListItemContract.component';
import ContractPauseFormDialog from '#libs/subscription/components/contract/ContractPauseFormDialog.component';
import { ResolvedGenericTags } from '#libs/email-editor/types';

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
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

const SUBSCRIPTION_PAGINATION_SIZE = 7;

export class ContractDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchContractDetail(this.props.contractId);
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
      popOverTitle: t('subscription.freeze.disabledReasons.month_billing_day'),
    },
  ]);

  render() {
    if (this.props.loading || !this.props.contract) {
      return <LinearProgress />;
    }
    const { classes, t } = this.props;
    return (
      <div className={classes.pageContainer}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6} className={classes.detailContainer}>
            <ContractDetail
              goToPack={this.props.goToPaymentPackDetail}
              goToPrivatePass={this.props.goToPrivatePass}
              goToCombo={this.props.goToCombo}
              contract={this.props.contract}
              company={this.getCompany(this.props.theme)}
              snackbarSuccess={this.props.snackbarSuccess}
            />
            <MarketingRuleListItemContract
              notifications={this.props.notifications}
              updateNotification={this.props.updateMarketingNotification}
              deleteNotification={this.props.deleteMarketingNotification}
              deleteNotificationModalOpen={
                this.props.deleteNotificationModalOpen
              }
              setDeleteNotificationModalOpen={
                this.props.setDeleteNotificationModalOpen
              }
              selectedNotification={this.props.selectedNotification}
              setSelectedNotification={this.props.setSelectedNotification}
              setContractNotificationFormOpen={
                this.props.setContractNotificationFormOpen
              }
              emails={this.props.email_templates_list}
              smartLists={this.props.smartLists}
            />

            <div className={classes.notificationButtonContainer}>
              <Button
                onClick={this.openContractNotificationForm}
                variant="outlined"
                color="primary"
              >
                {t('addNotification')}
              </Button>
            </div>
            {this.props.contractNotificationFormOpen && (
              <MarketingRuleFormContract
                id={this.props.contractId}
                onCancel={this.props.closeForm}
                emails={this.props.email_templates_list}
                emailListLoading={this.props.emailListLoading}
                getEmailDetail={this.props.fetchEmailTemplateDetail}
                emailDetails={this.props.email_templates_details}
                getEmails={this.props.fetchEmailTemplatesSummaries}
                emailDetailLoading={this.props.emailDetailLoading}
                initial={this.props.selectedNotification}
                tags={getMergeTags(this.props.tagCategories, t)}
                resolvedGenericTags={this.props.resolvedGenericTags}
                onSubmit={this.props.submitNotificationForm}
                goToSmartlist={this.props.goToSmartlist}
                getSmartLists={this.props.getSmartLists}
                smartLists={this.props.smartLists}
                smartListLoading={this.props.smartListLoading}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.title}>
              {t('associatedSubscriptions')}
            </Typography>
            <Paper>
              <PaginatedSubscriptionList
                items={this.props.subscriptions.items}
                nbItems={this.props.subscriptions.count}
                onClick={this.props.goToSubscription}
                loading={this.props.subscriptions.loading}
                page={this.props.page}
                itemPerPage={SUBSCRIPTION_PAGINATION_SIZE}
                onPageRequested={this.onSubscriptionListPageRequested}
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
                        fetchSubscriptionBulk={this.props.fetchSubscriptionBulk}
                        fetchMembersBySubscription={
                          this.props.fetchMembersBySubscription
                        }
                        goToSubscription={this.props.goToSubscription}
                        contractPause={cp}
                        onDeletePause={this.deleteContractPauseFunction(cp)}
                        onUpdatePause={this.updateContractPauseFunction(cp)}
                        onUpdatePauseName={this.props.updateContractPauseName}
                      />
                    </div>
                  ),
                )}
              </div>
            )}
            {this.props.contractPauseFormOpen && (
              <ContractPauseFormDialog
                openForm={this.props.contractPauseFormOpen}
                closeForm={this.closeContractPauseForm}
                contractId={this.props.contractId}
                fetchMembersBySubscription={
                  this.props.fetchMembersBySubscription
                }
                fetchSubscriptionBulk={this.props.fetchSubscriptionBulk}
                onSubmit={this.props.createOrUpdateContractPause}
                subscriptionData={this.props.subscriptionData}
                contractPauseBeingEdited={this.props.contractPauseToUpdate}
              />
            )}
          </Grid>
          <BottomActionsButtonCustom
            buttonsProperties={this.getBottomActionsProperties(t)}
            onEdit={this.onContractEdit}
            onDelete={this.openDeleteContractModal}
          />
          <ContractDeleteDialog
            contractToDeleteId={
              this.props.deleteContractModalOpen ? this.props.contract.id : null
            }
            onClose={this.closeDeleteContractModal}
            deleteContract={this.deleteContract}
          />
        </Grid>

        <SubscriptionContractFormDrawer
          onClose={this.closeContractFormDrawer}
          initial={this.props.contract}
          paymentPackList={this.props.paymentPackList}
          privatePassList={this.props.privatePassList}
          paymentComboList={this.props.paymentComboList}
          open={!!this.props.contractToEdit}
          onSubmit={this.submitContractForm}
        />
      </div>
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
  (state: RootState, { contractId }: { contractId: number }) => ({
    loading: state.subscription.contract.loading,
    subscriptions: getContractDetailSubscription(state),
    contract: withPaymentPack(getContract)(state, contractId),
    paymentPackList: getPaymentPackEnabled(state),
    privatePassList: getPrivatePassAvailable(state),
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    paymentComboList: getPaymentComboList(state),
    theme: themeSelectors.getTheme(state),
    contractPauseList: getContractPauseList(state, contractId),
    subscriptionData: state.subscription.byId,
    tagCategories: getTagCategories(state),
    notifications: getContractDetailNotifications(state),
    smartLists: getAllSmartList(state),
    smartListLoading: state.smartList.loading,
    resolvedGenericTags: getResolvedGenericTags(state),
  }),
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
    createOrUpdateContract: createOrUpdateContractAction,
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
    goToPaymentPackDetail: (packId: number) => push(`/payment-pack/${packId}/`),
    goToPrivatePass: (packId: number) =>
      push(`/private-service/pass/${packId}/`),
    goToCombo: (id: number) => push(`/combo/${id}/`),
    updateMarketingNotification: updateMarketingNotificationAction,
    deleteMarketingNotification: deleteMarketingNotificationAction,
    createNotification: createMarketingNotificationAction,
    goToSmartlist: () => push('/smart-list/'),
    getSmartLists: fetchAllSmartLists,
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
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
      ({ createOrUpdateContract, fetchContractDetail, contractId }) =>
      (data: any, options: OptionCallback) => {
        createOrUpdateContract(data, {
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
  }),
)(ContractDetailPage);
