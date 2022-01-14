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
import omit from 'lodash/omit';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CircularProgress, Theme, Typography } from '@material-ui/core';
import { push as pushRouter } from 'connected-react-router';
import themeSelectors from '#libs/theme/selectors';
import { snackbarSuccess } from '#libs/snackbar/actions';

import withTitle from '#hocs/with-title.hoc';
import {
  getPrivatePass,
  withServices,
  withAvailable,
  getCompatibilityPassWithService as getCompatibleServicePass,
} from '#libs/private-service/selectors/private-pass';
import {
  getPrivateConsumerPassByPrivatePass,
  getPrivateConsumerPassMassExtension,
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
} from '#libs/private-service/actions';
import { fetchFilteredMembers as fetchFilteredMembersActions } from '#libs/member/actions';
import PrivatePassCard from '#libs/private-service/components/pass/PrivatePassCard.component';
import PrivatePassCompatibleServiceList from '#libs/private-service/components/pass/PrivatePassCompatibleServiceList.component';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import PaginatedConsumerPrivatePass from '#libs/private-service/components/pass/PaginatedConsumerPrivatePass.component';
import PrivatePassForm from '#libs/private-service/components/pass/PrivatePassForm.component';
import PrivateConsumerPassFilters from '#libs/private-service/components/pass/PrivateConsumerPassFilters.component';
import PrivatePassMassExtensionList from '#libs/private-service/components/consumer-pass/PrivatePassMassExtensionList.component';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '#components/button/BottomActionsButton.component';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import PaymentPackMassExtensionDialog from '#libs/payment-packs/components/PaymentPackMassExtensionDialog.component';
import {
  PrivateConsumerPassMassExtension,
  PrivatePassCategory,
  PrivateSlot,
} from '#libs/private-service/types';
import { getPrivatePassCategories } from '#libs/private-service/selectors/private-pass-category';
import {
  getFormInitial,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
} from '#libs/private-service/utils';
import PrivatePassNotification from '#libs/private-service/components/pass/PrivatePassNotification.component';
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
import { getTagCategories } from '#libs/notification-rule/selectors';
import { fetchTagList } from '#libs/notification-rule/actions';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

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
    this.props.fetchPrivatePass(this.props.id);
    this.props.fetchAllPrivateServices();
    this.props.fetchCompatibleServicePasses();
    this.props.fetchNotificationsAndTemplatesAndSmartLists();
    this.props.fetchAllPrivatePassCategory();
    this.props.fetchPrivatePassMassExtensionList({
      privatePass: this.props.id,
      page: 1,
      page_size: MASS_EXTENSION_PAGINATION_SIZE,
    });
    this.props.fetchTagList();
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

  createMassExtension = (data: {
    minDate: string;
    maxDate: string;
    nbDays: number;
    note: string;
  }) => {
    const { minDate, maxDate, nbDays, note } = data;

    this.props.setLoadingMassExtension(true);
    this.props.createPrivatePassMassExtension(
      {
        private_pass: this.props.id,
        min_ending_date: minDate,
        max_ending_date: maxDate,
        nb_days: nbDays,
        note,
      },
      {
        onSuccess: () => {
          this.props.setLoadingMassExtension(false);
          this.props.fetchPrivatePassMassExtensionList({
            privatePass: this.props.id,
            page: 1,
            page_size: MASS_EXTENSION_PAGINATION_SIZE,
          });
        },
      },
    );

    this.props.setOpenMassExtensionDialog(false);
  };

  onDeleteMassExtension = (massExtension: PrivateConsumerPassMassExtension) => {
    this.props.deletePrivatePassMassExtension(massExtension.id, {
      onSuccess: () => {
        this.props.fetchPrivatePassMassExtensionList({
          privatePass: this.props.id,
          page: 1,
          page_size: MASS_EXTENSION_PAGINATION_SIZE,
        });
      },
    });
  };

  createNotification = (data: any) => {
    this.props.createMarketingNotification(data, {
      onSuccess: () => this.props.fetchNotificationsAndTemplatesAndSmartLists(),
    });
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
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.privatePassDetail}>
          {privatePass && (
            <>
              <PrivatePassCard
                pass={privatePass}
                privatePassCategory={privatePassCategory}
                snackbarSuccess={this.props.snackbarSuccess}
                onEditButtonClick={() => this.props.setOpenEditForm(true)}
                onDeleteButtonClick={
                  !this.props.privatePass?.template_instance &&
                  (() => this.props.setOpenDeletePassDialog(privatePass.id))
                }
                isManager
              />
              <div className={classes.compatiblePSCard}>
                <PrivatePassCompatibleServiceList
                  privateServices={this.props.private_services}
                  deleteCompatibleServicePass={
                    this.props.deleteCompatibleServicePass
                  }
                  createCompatibleServicePass={
                    this.props.createCompatibleServicePass
                  }
                  updateCompatibleServicePass={
                    this.props.updateCompatibleServicePass
                  }
                  compatibleServicePass={this.props.compatibleServicePass}
                  pass={this.props.privatePass}
                  isManager
                />
              </div>
            </>
          )}
          <PrivatePassNotification
            private_pass={this.props.privatePass}
            notifications={this.props.notifications}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            emails={this.props.email_templates_list}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            createNotification={this.createNotification}
            updateNotification={this.props.updateMarketingNotification}
            deleteNotification={this.props.deleteMarketingNotification}
            smartLists={this.props.smartLists}
            smartListLoading={this.props.smartListLoading}
            getSmartLists={this.props.getSmartLists}
            is_expired
            goToSmartlist={this.props.goToSmartlist}
            tags={this.props.tagCategories}
          />
        </Grid>
        <BottomActionsButton
          onEdit={() => this.props.setOpenEditForm(true)}
          onDelete={
            !this.props.privatePass?.template_instance &&
            (() => this.props.setOpenDeletePassDialog(this.props.id))
          }
        />

        <Grid item xs={12} md={6}>
          <Paper>
            <PrivateConsumerPassFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={this.props.filters}
            />
            <Divider />
            <PaginatedConsumerPrivatePass
              privatePass={this.props.privatePass}
              incrementCredit={
                this.props.privatePass?.template_instance &&
                this.props.incrementCredit
              }
              decrementCredit={
                this.props.privatePass?.template_instance &&
                this.props.decrementCredit
              }
              items={this.props.consumerPass.items}
              updatePrivateConsumerPassCredits={
                this.props.updatePrivateConsumerPassCredits
              }
              nbItems={this.props.consumerPass.count}
              onClick={(cpp: { member: { id: number }; id: number }) => {
                this.props.goToConsumerPrivatePassDetail(cpp.member.id, cpp.id);
              }}
              loading={this.props.consumerPass.loading}
              page={this.props.consumerPass.page}
              consumerPrivatePassUpdating={this.props.consumerPass.updating}
              itemPerPage={CONSUMER_PrivatePass_PAGINATION_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerPrivatePassWithMember(page, pageSize)
              }
            />
          </Paper>

          <div className={classes.massExtensionContainer}>
            {!!(
              this.props.massExtension.items &&
              this.props.massExtension.items.length
            ) && (
              <React.Fragment>
                <Typography variant="h5">
                  {this.props.t('paymentPack:section.massExtension')}
                </Typography>
                <Divider className={this.props.classes.divider} />
                <PrivatePassMassExtensionList
                  items={this.props.massExtension.items}
                  nbItems={this.props.massExtension.count}
                  firstLoadDone={this.props.massExtension.firstLoadDone}
                  loading={this.props.massExtension.loading}
                  page={this.props.massExtension.page}
                  itemPerPage={MASS_EXTENSION_PAGINATION_SIZE}
                  onPageRequested={(page, page_size) => {
                    this.props.fetchPrivatePassMassExtensionList({
                      privatePass: this.props.id,
                      page,
                      page_size,
                    });
                  }}
                  onDelete={this.onDeleteMassExtension}
                />
              </React.Fragment>
            )}
            {!this.props.privatePass?.template_instance && (
              <div className={classes.buttonContainerCenter}>
                {this.props.loadingMassExtension ? (
                  <CircularProgress />
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.props.setOpenMassExtensionDialog(true)}
                  >
                    {this.props.t('paymentPack:massExtension.title')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Grid>

        <GenericResponsiveDrawer
          open={this.props.openEditForm}
          onClose={() => this.props.setOpenEditForm(false)}
        >
          <Typography variant="h4" className={classes.formTitle}>
            {this.props.t('privatePass.form.title')}
          </Typography>
          <PrivatePassForm
            privatePassCategories={this.props.privatePassCategories}
            initial={getFormInitial(
              this.props.privatePass,
              this.props.compatibleServicePass,
            )}
            onSubmit={(data: any) => this.props.onSubmit(data)}
            onCancel={() => this.props.setOpenEditForm(false)}
            privateServices={this.props.private_services}
            compatibleServicePass={this.props.compatibleServicePass}
          />
        </GenericResponsiveDrawer>

        <Dialog open={!!this.props.openDeletePassDialog}>
          <DialogTitle>{t('privatePass.delete.title')}</DialogTitle>
          <DialogContent>{t('privatePass.delete.explain')}</DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.setOpenDeletePassDialog(null)}>
              {t('privatePass.delete.cancel')}
            </Button>
            <Button
              onClick={() => {
                this.props.deletePrivatePass(this.props.openDeletePassDialog);
              }}
            >
              {t('privatePass.delete.submit')}
            </Button>
          </DialogActions>
        </Dialog>

        {!this.props.privatePass?.template_instance && (
          <PaymentPackMassExtensionDialog
            open={this.props.openMassExtensionDialog}
            onClose={() => this.props.setOpenMassExtensionDialog(false)}
            onSubmit={this.createMassExtension}
          />
        )}
      </Grid>
    );
  }
}

const styles = (theme: Theme) => ({
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
    items: getPrivateConsumerPassMassExtension(state),
    count: state.privateService.privateConsumerPass.massExtension.count,
    loading: state.privateService.privateConsumerPass.massExtension.loading,
    firstLoadDone:
      state.privateService.privateConsumerPass.massExtension.firstLoadDone,
    page: state.privateService.privateConsumerPass.massExtension.page,
  },
  compatibleServicePass: getCompatibleServicePass(state),
  privatePassCategories: getPrivatePassCategories(state),
  notifications: {
    items: getPrivatePassNotifications(state),
    loading: state.marketingNotification.loading,
  },
  email_templates_list: getAllEmailTemplatesSummaries(state),
  email_templates_details: getEmailTemplatesDetail(state),
  emailListLoading: state.emailTemplate.isLoading,
  emailDetailLoading: state.emailTemplate.detail.isLoading,
  smartLists: getAllSmartList(state),
  smartListLoading: state.smartList.isLoading,
  tagCategories: getTagCategories(state),
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
    filters: any,
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
};

const mapWithHandlers = {
  setOpenValue: (props: WithStateProps) => (name: string) => {
    props.setOpen({
      ...props.open,
      [name]: !props.open[name],
    });
  },
  setFilterValue: (props: WithStateProps) => (name: string, value: any) => {
    if (value === null) {
      props.setFilters(omit(props.filters, name));
    } else {
      props.setFilters({
        ...props.filters,
        [name]: value,
      });
    }
  },
  deletePrivatePass: (props: WithStateProps) => (pass: number) => {
    props.deletePrivatePass(pass, {
      onSuccess: () => {
        props.setOpenDeletePassDialog(null);
        props.goToPrivatePassList();
      },
    });
  },
  onSubmit: (props: WithStateProps) => (data: any) =>
    props.createOrUpdatePrivatePass(data, props.id, {
      onSuccess: () => {
        props.setOpenEditForm(false);
      },
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
  filters: any;
  open: any;
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
  setFilters: () => (filters: any) => {
    return { filters };
  },
  setOpen: () => (open: boolean) => {
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
