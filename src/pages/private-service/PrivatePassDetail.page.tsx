// @ts-nocheck
// @flow
import React, { Component } from 'react';
import { compose, withHandlers, withStateHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CircularProgress, Theme, Typography } from '@material-ui/core';
import { push as pushRouter, replace } from 'connected-react-router';
import DialogContentText from '@material-ui/core/DialogContentText';
import WarningIcon from '@material-ui/icons/Warning';
import themeSelectors from '#libs/theme/selectors';
import { snackbarSuccess } from '#libs/snackbar/actions';

import withTitle from '#hocs/with-title.hoc';
import {
  getPrivatePass,
  withServices,
  withAvailable,
  getCompatibilityPassWithService as getCompatibleServicePass,
  getPrivatePassMassExtensionList,
} from '#libs/private-service/selectors/private-pass';
import {
  getPrivateConsumerPassByPrivatePass,
  withMember,
} from '#libs/private-service/selectors/private-consumer-pass';
import { getPrivateServices } from '#libs/private-service/selectors/private-service';
import {
  fetchPrivatePassRetrieve,
  fetchByPrivatePass,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  updateCompatibleServicePass,
  deletePrivatePass as deletePrivatePassAction,
  updatePrivateConsumerPassCredits as updatePrivatePassCredit,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  resetByPrivatePass as resetByPrivatePassAction,
  updatePrivateConsumerPassCredits,
  fetchPrivatePassMassExtensionList,
  createPrivatePassMassExtension,
  deletePrivatePassMassExtension,
  fetchAllPrivateSlots,
  fetchAllPrivatePassCategory,
  isPrivatePassUsedInCombo,
} from '#libs/private-service/actions';
import { fetchFilteredMembers as fetchFilteredMembersActions } from '#libs/member/actions';
import PrivatePassCard from '#libs/private-service/components/pass/PrivatePassCard.component';
import PrivatePassCompatibleServiceList from '#libs/private-service/components/pass/PrivatePassCompatibleServiceList.component';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import PaginatedConsumerPrivatePass from '#libs/private-service/components/pass/PaginatedConsumerPrivatePass.component';
import PrivatePassForm from '#libs/private-service/components/pass/private-pass-form/PrivatePassForm.component';
import PrivateConsumerPassFilters from '#libs/private-service/components/pass/PrivateConsumerPassFilters.component';
import PrivatePassMassExtensionList from '#libs/private-service/components/consumer-pass/PrivatePassMassExtensionList.component';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '#components/button/BottomActionsButton.component';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import MassExtensionCreateDialog, {
  GenericExtensionCreationPayload,
} from '#components/MassExtensionCreateDialog';
import type {
  PrivatePassMassExtension,
  PrivatePassCategory,
  PrivateSlot,
  PrivatePass,
  PrivatePassFilters,
  PrivatePassFiltersOpener,
} from '#libs/private-service/types';
import { getPrivatePassCategories } from '#libs/private-service/selectors/private-pass-category';
import {
  getFormInitial,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
} from '#libs/private-service/utils';
import MarketingRuleListItemPrivatePass from '#libs/marketing/components/marketing-rule-list-item/MarketingRuleListItemPrivatePass.component';
import { getPrivatePassNotifications } from '#libs/marketing/selectors';
import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#libs/marketing/actions';

import {
  fetchSmartListBulk as fetchSmartListBulkAction,
  fetchAllSmartLists,
} from '#libs/smart-list/actions';
import { getAllSmartList } from '#libs/smart-list/selectors';
import {
  getTagCategories,
  getResolvedGenericTags,
} from '#libs/notification-rule/selectors';
import {
  fetchTagList,
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
} from '#libs/notification-rule/actions';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { setGenericFilterValue } from '#libs/payment-packs/utils';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { fetchTags } from '#libs/tag/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';

type OwnProps = {
  id: number;
};

type ConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type WithStateProps = ConnectedProps & StateHandlerType;

type Props = WithStateProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const CONSUMER_PrivatePass_PAGINATION_SIZE = 7;
const MASS_EXTENSION_PAGINATION_SIZE = 5;

export class PrivatePassDetails extends Component<Props> {
  componentWillMount() {
    this.props.resetConsumerPrivatePass();
  }

  componentDidMount() {
    this.props.fetchPrivatePass(this.props.id, {
      onSuccess: (privatePass: PrivatePass) => {
        if (privatePass.linked_payment_pack) {
          this.props.redirectToLinkedPaymentPack(
            privatePass.linked_payment_pack,
          );
        }
      },
    });
    this.props.fetchAllPrivateServices();
    this.props.fetchCompatibleServicePasses();
    this.props.fetchNotificationsAndTemplatesAndSmartLists();
    this.props.fetchAllPrivatePassCategory();
    this.props.fetchPrivatePassMassExtensionList({
      private_pass: this.props.id,
    });
    this.props.fetchResolvedGenericTags();
    this.props.fetchTagList();
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchConsumerPrivatePassWithMember(
        1,
        CONSUMER_PrivatePass_PAGINATION_SIZE,
      );
    }
    if (
      prevProps.privatePass?.private_services.length !==
      this.props.privatePass?.private_services.length
    ) {
      this.props.fetchCompatibleServicePasses();
    }
    if (prevProps.openEditForm && !this.props.openEditForm) {
      this.props.fetchCompatibleServicePasses();
    }
  }

  createMassExtension = (data: GenericExtensionCreationPayload) => {
    this.props.setLoadingMassExtension(true);
    this.props.createPrivatePassMassExtension(
      {
        ...data,
        private_pass: this.props.id,
      },
      {
        onSuccess: () => {
          this.props.setLoadingMassExtension(false);
          this.props.fetchPrivatePassMassExtensionList({
            private_pass: this.props.id,
          });
        },
      },
    );

    this.props.setOpenMassExtensionDialog(false);
  };

  onDeleteMassExtension = (massExtension: PrivatePassMassExtension) => {
    const currentPage = this.props.massExtension.page;
    const isLastItemInPage = this.props.massExtension.items?.length === 1;
    this.props.deletePrivatePassMassExtension(massExtension.id, {
      onSuccess: () => {
        this.props.fetchPrivatePassMassExtensionList({
          private_pass: this.props.id,
          /** Fetch the previous page if removing the last page item */
          ...(isLastItemInPage && currentPage > 1 && { page: currentPage - 1 }),
        });
      },
    });
  };

  createNotification = (data: any) => {
    this.props.createMarketingNotification(data, {
      onSuccess: () => this.props.fetchNotificationsAndTemplatesAndSmartLists(),
    });
  };

  openEditForm = () => this.props.setOpenEditForm(true);

  getDeletePrivatePassHandler = (privatePass: PrivatePass) => () => {
    this.props.isPrivatePassUsedInCombo(privatePass.id);
    this.props.setOpenDeletePassDialog(privatePass.id);
  };

  render() {
    const { classes, t, privatePass, privatePassCategories } = this.props;

    const privatePassCategory = privatePass
      ? privatePassCategories.find(
          (ppc: PrivatePassCategory) => ppc.id === privatePass.category,
        )
      : null;
    if (!this.props.privatePass) return <BackofficeLinearProgress />;
    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.privatePass.allowed_actions.edit',
          'product.privatePass.allowed_actions.compatibility',
          'product.privatePass.allowed_actions.delete',
          'product.privatePass.allowed_actions.manageExtension',
          'product.privatePass.allowed_actions.manageCredit',
        ]}
      >
        {([
          hasEditPermission,
          hasCompatibilityPermission,
          hasDeletePermission,
          hasManageExtensionPermission,
          hasManageCreditPermission,
        ]: boolean[]) => (
          <Grid container alignItems="stretch" spacing={3}>
            <Grid item className={classes.privatePassDetail} md={6} xs={12}>
              {privatePass && (
                <>
                  <PrivatePassCard
                    isManager
                    onDeleteButtonClick={
                      hasDeletePermission &&
                      !privatePass?.template_instance &&
                      this.getDeletePrivatePassHandler(privatePass)
                    }
                    onEditButtonClick={hasEditPermission && this.openEditForm}
                    pass={privatePass}
                    privatePassCategory={privatePassCategory}
                    snackbarSuccess={this.props.snackbarSuccess}
                  />
                  <div className={classes.compatiblePSCard}>
                    <PrivatePassCompatibleServiceList
                      isManager
                      canEdit={hasCompatibilityPermission}
                      compatibleServicePass={this.props.compatibleServicePass}
                      createCompatibleServicePass={
                        this.props.createCompatibleServicePass
                      }
                      deleteCompatibleServicePass={
                        this.props.deleteCompatibleServicePass
                      }
                      pass={this.props.privatePass}
                      privateServices={this.props.private_services}
                      updateCompatibleServicePass={
                        this.props.updateCompatibleServicePass
                      }
                    />
                  </div>
                </>
              )}
              <MarketingRuleListItemPrivatePass
                is_expired
                createNotification={this.createNotification}
                deleteNotification={this.props.deleteMarketingNotification}
                emailDetailLoading={this.props.emailDetailLoading}
                emailDetails={this.props.email_templates_details}
                emailListLoading={this.props.emailListLoading}
                emails={this.props.email_templates_list}
                getEmailDetail={this.props.fetchEmailTemplateDetail}
                getEmails={this.props.fetchEmailTemplatesSummaries}
                getSmartLists={this.props.getSmartLists}
                goToSmartlist={this.props.goToSmartlist}
                notifications={this.props.notifications}
                private_pass={this.props.privatePass}
                resolvedGenericTags={this.props.resolvedGenericTags}
                smartListLoading={this.props.smartListLoading}
                smartLists={this.props.smartLists}
                tags={this.props.tagCategories}
                updateNotification={this.props.updateMarketingNotification}
              />
            </Grid>
            <BottomActionsButton
              onDelete={
                hasDeletePermission &&
                !this.props.privatePass?.template_instance &&
                this.getDeletePrivatePassHandler(privatePass)
              }
              onEdit={hasEditPermission && this.openEditForm}
            />

            <Grid item md={6} xs={12}>
              <Paper>
                <PrivateConsumerPassFilters
                  filters={this.props.filters}
                  open={this.props.open}
                  setFiltersValue={this.props.setFilterValue}
                  setOpenValue={this.props.setOpenValue}
                />
                <Divider />
                <PaginatedConsumerPrivatePass
                  consumerPrivatePassUpdating={this.props.consumerPass.updating}
                  itemPerPage={CONSUMER_PrivatePass_PAGINATION_SIZE}
                  items={this.props.consumerPass.items}
                  loading={this.props.consumerPass.loading}
                  nbItems={this.props.consumerPass.count}
                  onClick={(cpp: { member: { id: number }; id: number }) => {
                    this.props.goToConsumerPrivatePassDetail(
                      cpp.member.id,
                      cpp.id,
                    );
                  }}
                  onPageRequested={(page: number, pageSize: number) =>
                    this.props.fetchConsumerPrivatePassWithMember(
                      page,
                      pageSize,
                    )
                  }
                  page={this.props.consumerPass.page}
                  privatePass={this.props.privatePass}
                  updatePrivateConsumerPassCredits={
                    hasManageCreditPermission &&
                    this.props.updatePrivateConsumerPassCredits
                  }
                />
              </Paper>

              <div className={classes.massExtensionContainer}>
                {!!(
                  this.props.massExtension.items &&
                  this.props.massExtension.items.length
                ) && (
                  <React.Fragment>
                    <Typography className={classes.extensionTitle} variant="h5">
                      {this.props.t('paymentPack:section.massExtension')}
                    </Typography>
                    <PrivatePassMassExtensionList
                      firstLoadDone
                      itemPerPage={MASS_EXTENSION_PAGINATION_SIZE}
                      items={this.props.massExtension.items}
                      loading={
                        this.props.massExtension.loading ||
                        this.props.massExtension.isDeleteLoading
                      }
                      nbItems={this.props.massExtension.count}
                      onDelete={this.onDeleteMassExtension}
                      onPageRequested={(page) => {
                        this.props.fetchPrivatePassMassExtensionList({
                          private_pass: this.props.id,
                          page,
                        });
                      }}
                      page={this.props.massExtension.page}
                    />
                  </React.Fragment>
                )}
                {!this.props.privatePass?.template_instance && (
                  <div className={classes.buttonContainerCenter}>
                    {hasManageExtensionPermission &&
                      (this.props.loadingMassExtension ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          color="primary"
                          onClick={() =>
                            this.props.setOpenMassExtensionDialog(true)
                          }
                          variant="outlined"
                        >
                          {this.props.t('paymentPack:massExtension.title')}
                        </Button>
                      ))}
                  </div>
                )}
              </div>
            </Grid>

            <GenericResponsiveDrawer
              onClose={() => this.props.setOpenEditForm(false)}
              open={this.props.openEditForm}
              subtitle={this.props.privatePass?.name}
              title={this.props.t('privatePass.form.title')}
              trackingObjectId={this.props.privatePass?.id}
              trackingObjectIdentifier={
                SegmentAnalyticsFormObjectIdentifier.PrivatePass
              }
            >
              <PrivatePassForm
                bookkeepingAccountById={this.props.bookkeepingAccountById}
                bookkeepingAccounts={this.props.bookkeepingAccounts}
                compatibleServicePass={this.props.compatibleServicePass}
                initial={getFormInitial(
                  this.props.privatePass,
                  this.props.compatibleServicePass,
                )}
                onCancel={() => this.props.setOpenEditForm(false)}
                onSubmit={(data: any) => this.props.onSubmit(data)}
                privatePassCategories={this.props.privatePassCategories}
                privateServices={this.props.private_services}
                provincialTax={this.props.theme?.provincial_tax_value}
                tagList={this.props.allTagsWithTagGroup}
              />
            </GenericResponsiveDrawer>

            <Dialog open={!!this.props.openDeletePassDialog}>
              <DialogTitle>{t('privatePass.delete.title')}</DialogTitle>
              <DialogContent>
                {this.props.archivationWarning[this.props.openDeletePassDialog]
                  ?.used_in_combo && (
                  <DialogContentText className={classes.warningDelete}>
                    <WarningIcon
                      className={classes.warningIcon}
                      color="error"
                      fontSize="large"
                    />
                    <Typography>{t('privatePass.delete.warning')}</Typography>
                  </DialogContentText>
                )}
                {t('privatePass.delete.explain')}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.props.setOpenDeletePassDialog(null)}
                >
                  {t('privatePass.delete.cancel')}
                </Button>
                <Button
                  onClick={() => {
                    this.props.deletePrivatePass(
                      this.props.openDeletePassDialog,
                    );
                  }}
                >
                  {t('privatePass.delete.submit')}
                </Button>
              </DialogActions>
            </Dialog>

            {!this.props.privatePass?.template_instance && (
              <MassExtensionCreateDialog
                isLoading={this.props.massExtension.isCreateLoading}
                onClose={() => this.props.setOpenMassExtensionDialog(false)}
                onSubmit={this.createMassExtension}
                open={this.props.openMassExtensionDialog}
              />
            )}
          </Grid>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

const styles = (theme: Theme) => ({
  extensionTitle: {
    marginBottom: theme.spacing(1),
  },
  emptyContainer: {
    padding: theme.spacing(2),
  },
  privatePassDetail: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(4),
    },
  },
  massExtensionContainer: {
    paddingTop: theme.spacing(2),
  },
  buttonContainerCenter: {
    paddingTop: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  formTitle: {
    fontWeight: 500,
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  compatiblePSCard: {
    marginTop: theme.spacing(3),
  },
  warningDelete: {
    display: 'flex',
  },
  warningIcon: {
    marginRight: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  privatePass: withAvailable(withServices(getPrivatePass))(state, id),
  private_services: getPrivateServices(state),
  theme: themeSelectors.getTheme(state),
  consumerPass: {
    items: withMember(getPrivateConsumerPassByPrivatePass)(state),
    count: state.privateService.privateConsumerPass.byPrivatePass.count,
    loading: state.privateService.privateConsumerPass.byPrivatePass.loading,
    page: state.privateService.privateConsumerPass.byPrivatePass.page,
    updating: state.privateService.privateConsumerPass.updatingConsumerPass,
  },
  massExtension: {
    items: getPrivatePassMassExtensionList(state),
    count: state.privateService.privatePass.massExtension.count,
    loading: state.privateService.privatePass.massExtension.loading,
    page: state.privateService.privatePass.massExtension.page,
    isCreateLoading:
      state.privateService.privatePass.massExtension.create.loading,
    isDeleteLoading:
      state.privateService.privatePass.massExtension.delete.loading,
  },
  compatibleServicePass: getCompatibleServicePass(state),
  privatePassCategories: getPrivatePassCategories(state),
  notifications: {
    items: getPrivatePassNotifications(state),
    loading: state.marketingNotification.loading,
  },
  email_templates_list: getAllEmailTemplatesSummaries(state),
  email_templates_details: getEmailTemplatesDetail(state),
  emailListLoading: state.emailTemplate.loading,
  emailDetailLoading: state.emailTemplate.detail.loading,
  smartLists: getAllSmartList(state),
  smartListLoading: state.smartList.loading,
  tagCategories: getTagCategories(state),
  resolvedGenericTags: getResolvedGenericTags(state),
  archivationWarning: state.privateService.privatePass.archivationWarning,
  allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  bookkeepingAccounts: getBookkeepingAccountList(state),
  bookkeepingAccountById: getBookkeepingAccountById(state),
});

const mapDispatchToProps = {
  fetchPrivatePass: fetchPrivatePassRetrieve,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  fetchAllPrivatePassCategory,
  createOrUpdatePrivatePass: createOrUpdatePrivatePassAction,
  createCompatibleServicePass,
  deleteCompatibleServicePass,
  updateCompatibleServicePass,
  updatePrivateConsumerPassCredits,
  deletePrivatePass: deletePrivatePassAction,
  snackbarSuccess,
  incrementCredit: (consumerPassId: number) =>
    updatePrivatePassCredit(consumerPassId, 1),
  decrementCredit: (consumerPassId: number) =>
    updatePrivatePassCredit(consumerPassId, -1),
  goToConsumerPrivatePassDetail: (memberId: number, passId: number) =>
    pushRouter(`/member/${memberId}/private-consumer-pass/${passId}`),
  fetchConsumerPrivatePass: (
    privatePassId: number,
    page: number,
    pageSize: number,
    filters: PrivatePassFilters,
    options: OptionCallback,
  ) => fetchByPrivatePass(privatePassId, page, pageSize, options, filters),
  fetchFilteredMembers: fetchFilteredMembersActions,
  resetConsumerPrivatePass: resetByPrivatePassAction,
  goToPrivatePassList: () => pushRouter('/private-service/pass/'),
  fetchPrivatePassMassExtensionList,
  createPrivatePassMassExtension,
  deletePrivatePassMassExtension,
  fetchPrivateSlotsByService: fetchAllPrivateSlots,
  fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
  fetchEmailTemplatesSummaries,
  fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
  createMarketingNotification: createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification: deleteMarketingNotificationAction,
  fetchMarketingNotificationList: fetchMarketingNotificationListAction,
  fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
  fetchSmartListBulk: fetchSmartListBulkAction,
  getSmartLists: fetchAllSmartLists,
  goToSmartlist: () => pushRouter('/smart-list'),
  fetchTagList,
  isPrivatePassUsedInCombo,
  redirectToLinkedPaymentPack: (linkedPaymentPackId: number) =>
    replace(`/payment-pack/${linkedPaymentPackId}`),
  fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
  fetchTags,
  fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
};

const mapWithHandlers = {
  setOpenValue:
    (props: WithStateProps) => (name: keyof PrivatePassFiltersOpener) => {
      props.setOpen({
        ...props.open,
        [name]: !props.open[name],
      });
    },
  setFilterValue:
    (props: WithStateProps) =>
    (filterDict: PrivatePassFilters<boolean | null>) =>
      setGenericFilterValue(props.filters, filterDict, props.setFilters),
  deletePrivatePass: (props: WithStateProps) => (pass: number) => {
    props.deletePrivatePass(pass, {
      onSuccess: () => {
        props.setOpenDeletePassDialog(null);
        props.goToPrivatePassList();
      },
    });
  },
  onSubmit: (props: WithStateProps) => (data: any, options?: OptionCallback) =>
    props.createOrUpdatePrivatePass(data, props.id, {
      onSuccess: () => {
        options?.onSuccess();
        props.setOpenEditForm(false);
      },
      onError: () => options?.onError(),
    }),
  fetchConsumerPrivatePassWithMember:
    (props: WithStateProps) => (page: number, pageSize: number) =>
      props.fetchConsumerPrivatePass(props.id, page, pageSize, props.filters, {
        onSuccess: (cpps) =>
          props.fetchFilteredMembers({
            id__in: cpps.map((b: { member: any }) => b.member),
          }),
      }),
  fetchCompatibleServicePasses: (props: WithStateProps) => () =>
    props.fetchCompatibleServicePassList(props.id, {
      onSuccess: (csps) => {
        const private_service__in = csps?.map(
          (c: PrivateSlot) => c.private_service,
        );
        if (private_service__in?.length !== 0) {
          props.fetchPrivateSlotsByService({
            private_service__in,
          });
        }
      },
    }),
  fetchBookkeepingAccountList: (props: WithStateProps) => () =>
    props.fetchBookkeepingAccountList({ is_active: true }),
  fetchNotificationsAndTemplatesAndSmartLists:
    (props: WithStateProps) => () => {
      props.fetchMarketingNotificationList(
        {
          kind__in: [
            PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
            PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
          ],
          event_rules__private_pass_id: props.id,
        },
        {
          onSuccess: (notificationList: any) => {
            props.fetchEmailTemplateSummariesBulk(
              notificationList.map(
                (notification: any) => notification.email_design,
              ),
            );
            props.fetchSmartListBulk([
              ...notificationList.map(
                (notification: any) =>
                  notification.event_rules.smartlist_include,
              ),
              ...notificationList.map(
                (notification: any) =>
                  notification.event_rules.smartlist_exclude,
              ),
            ]);
          },
        },
      );
    },
};

type StateHandlerInit = {
  filters: PrivatePassFilters;
  open: PrivatePassFiltersOpener;
  openDeletePassDialog: number | null;
  openEditForm: boolean;
  openMassExtensionDialog: boolean;
  loadingMassExtension: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  filters: {},
  open: {},
  openDeletePassDialog: null,
  openEditForm: false,
  openMassExtensionDialog: false,
  loadingMassExtension: false,
};

const withStateHandlersSetter = {
  setFilters: () => (filters: PrivatePassFilters) => {
    return { filters };
  },
  setOpen: () => (open: PrivatePassFiltersOpener) => {
    return { open };
  },
  setOpenDeletePassDialog: () => (openDeletePassDialog: number | null) => {
    return { openDeletePassDialog };
  },
  setOpenEditForm: () => (openEditForm: boolean) => {
    return { openEditForm };
  },
  setOpenMassExtensionDialog: () => (openMassExtensionDialog: boolean) => {
    return { openMassExtensionDialog };
  },
  setLoadingMassExtension: () => (loadingMassExtension: boolean) => {
    return { loadingMassExtension };
  },
};

// ajouter des HOC
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['privateService']),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(
    ({ t, privatePass }: Props) =>
      (privatePass && privatePass.name) || t('pageTitles.passList'),
  ),
  withState('selectedService', 'setSelectedService', null),
  withHandlers(mapWithHandlers),
)(PrivatePassDetails);
