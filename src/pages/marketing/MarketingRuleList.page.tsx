import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { Theme, Typography } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import { OptionCallback } from '../../state/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import {
  getNotificationGrouped,
  getNotificationForMarketingPage,
} from '#libs/marketing/selectors';
import { getTheme } from '#libs/theme/selectors';
import {
  fetchMarketingNotification,
  fetchMarketingNotificationList,
  createMarketingNotification,
  updateMarketingNotification,
  deleteMarketingNotification,
} from '#libs/marketing/actions';
import {
  emailTemplateComplete,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
  fetchEmailTemplateSummariesBulk,
} from '#libs/email-editor/actions';
import { getActiveContractList } from '#libs/subscription/selectors';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceBulk,
  fetchPrivatePassList,
} from '#libs/private-service/actions';
import { getPrivatePassListBase as getPrivatePasses } from '../../libs/private-service/selectors/private-pass';
import {
  fetchActivitiesCompany,
  fetchMetaActivityBulk,
} from '#libs/meta-activity/actions';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk,
} from '#libs/payment-packs/actions';
import {
  fetchEstablishmentBulk,
  fetchEstablishments,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { fetchContractList } from '#libs/subscription/actions';
import {
  getAllEmailTemplatesDict,
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import { fetchMarketingNotificationCampaignSummary } from '#libs/communication/actions';
import { getAll as getAllPaymentPacks } from '#libs/payment-packs/selectors';
import { fetchTagList } from '#libs/notification-rule/actions';
import { getTagCategories } from '#libs/notification-rule/selectors';

import { MaterialStyleType } from '../../utils/types';

import MarketingRuleListPaymentPack from '#libs/marketing/components/MarketingRuleListPaymentPack.component';
import MarketingRuleListPrivatePass from '#libs/marketing/components/MarketingRuleListPrivatePass.component';
import MarketingRuleListBooking from '#libs/marketing/components/MarketingRuleListBooking.component';
import MarketingRuleListPrivateBooking from '#libs/marketing/components/MarketingRuleListPrivateBooking.component';

import { MarketingNotification } from '#libs/marketing/types';
import MarketingRuleDetail from '#libs/marketing/components/MarketingRuleDetail.component';
import { EmailTemplateSummary } from '#libs/email-editor/types';
import MarketingRuleFormGeneric from '#libs/marketing/components/MarketingRuleFormGeneric.component';
import { getAllSmartList } from '#libs/smart-list/selectors';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import {
  getPageEnabledPureMetaActivities,
  getEnabledWorkshops,
} from '#libs/meta-activity/selectors';
import {
  getAssociatedEstablishmentGroup,
  getAvailableEstablishmentList,
  withEstablishment,
} from '#libs/establishment/selectors';
import { _getPrivateServices } from '#libs/private-service/selectors/private-service';
import NotificationsList from '#libs/marketing/components/MarketingRuleNotificationList.component';
import { showDeleteDialog } from '#components/genericDialog/CustomDialogs';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import { EstablishmentGroup } from '#libs/establishment/types';

import FabWithItems from '#components/button/FabWithItems';
import MarketingRuleListContract from '#libs/marketing/components/MarketingRuleListContract.component';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation & {
    notificationId?: number;
  };

type State = {
  selectedNotification?: number | null;
  editNotification?: MarketingNotification | null;
  loading: boolean;
  createFormOpen: string | null;
};

export class MarketingRuleListPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedNotification: props.notificationId,
      editNotification: null,
      loading: false,
      createFormOpen: null,
    };
  }

  componentDidMount() {
    this.fetchData();

    if (this.props.notificationId) {
      this.props.fetchMarketingNotificationCampaignSummary(
        this.props.notificationId,
      );
      this.props.fetchMarketingNotification(this.props.notificationId, {
        onSuccess: (data) => {
          if (data.email_design) {
            this.props.fetchEmailTemplateComplete(data.email_design);
          }
        },
      });
    }
  }

  fetchData = async () => {
    const notifications: any = await this.props.fetchMarketingNotificationList({
      kind__in: [
        NOTIFICATION_KIND.BIRTHDAY,
        NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
        NOTIFICATION_KIND.BOOKING_CREATION,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
        NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
        NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
      ],
    });

    const metaActivityIds: number[] = [];
    const privateServiceIds: number[] = [];
    const establishmentIds: number[] = [];
    const paymentPackIds: number[] = [];
    const contractIds: number[] = [];
    const emailDesignIds: number[] = [];

    (notifications || []).forEach((n: MarketingNotification) => {
      if (n.event_rules.payment_pack_id !== undefined) {
        paymentPackIds.push(n.event_rules.payment_pack_id);
      }
      if (n.event_rules.establishment_id !== undefined) {
        establishmentIds.push(n.event_rules.establishment_id);
      }
      if (n.event_rules.meta_activity_id !== undefined) {
        metaActivityIds.push(n.event_rules.meta_activity_id);
      }
      if (n.event_rules.private_service_id !== undefined) {
        privateServiceIds.push(n.event_rules.private_service_id);
      }
      if (n.event_rules.contract_id !== undefined) {
        contractIds.push(n.event_rules.contract_id);
      }
      emailDesignIds.push(n.email_design);
    });
    await Promise.all([
      this.props.fetchPaymentPackBulk(paymentPackIds),
      this.props.fetchEstablishmentBulk(establishmentIds),
      this.props.fetchPrivateServiceBulk(privateServiceIds),
      this.props.fetchMetaActivityBulk(metaActivityIds),
      this.props.fetchContractList(contractIds),
      this.props.fetchEmailTemplateSummariesBulk(emailDesignIds),
      this.props.fetchActivitiesCompany(this.props.theme.company),
      this.props.fetchEstablishments(),
      this.props.fetchAllPrivateServices(),
      this.props.fetchPaymentPackList(),
      this.props.fetchTagList(),
      this.props.getSmartLists(),
      this.props.fetchPrivatePassList(),
      this.props.fetchAllEstablishmentGroup(),
    ]);

    this.setState({ loading: false });
  };

  getSelectedEmailTemplateSummary = () => {
    if (!this.state.selectedNotification || !this.props.emailSummariesById) {
      return undefined;
    }

    const notifcationDetail = this.props.notificationList.find(
      (n) => n.id === this.state.selectedNotification,
    );

    if (!notifcationDetail) {
      return undefined;
    }

    return this.props.emailSummariesById[notifcationDetail.email_design];
  };

  getSelectedEmailTemplateDetail = () => {
    if (!this.state.selectedNotification || !this.props.emailDetailById) {
      return undefined;
    }

    const notifcationDetail = this.props.notificationList.find(
      (n) => n.id === this.state.selectedNotification,
    );

    if (!notifcationDetail) {
      return undefined;
    }

    return this.props.emailDetailById[notifcationDetail.email_design];
  };

  onClickNotification = (notification: MarketingNotification) => {
    this.props.fetchMarketingNotificationCampaignSummary(notification.id);
    this.setState({
      selectedNotification: notification.id,
    });
    if (notification.email_design) {
      this.props.fetchEmailTemplateComplete(notification.email_design);
    }
    this.props.push(`/marketing/notifications/${notification.id}`);
  };

  onClickRemove = async () => {
    const { t } = this.props;
    const res = await showDeleteDialog(
      t('marketing:notifications.deleteDialogTitle'),
      t('marketing:notifications.deleteDialogText'),
    );
    if (res && this.state.selectedNotification) {
      this.props.deleteMarketingNotification(this.state.selectedNotification);
      this.setState({ selectedNotification: null });
      this.props.push(`/marketing/notifications`);
    }
  };

  onEditNotification = async (id: number, n: MarketingNotification) => {
    this.setState({ editNotification: null });
    this.props.updateMarketingNotification(id, n);
  };

  handleCreate = (
    notification: MarketingNotification,
    option?: OptionCallback,
  ) => {
    this.props.createMarketingNotification(notification, {
      onSuccess: (data: MarketingNotification) => {
        if (data.email_design) {
          this.props.fetchEmailTemplateComplete(data.email_design);
        }
        this.props.fetchMarketingNotificationCampaignSummary(data.id);
        this.props.push(`/marketing/notifications/${data.id}`);
        option?.onSuccess && option?.onSuccess();
      },
    });
  };

  getCreateButtonSpec = () => [
    ...(this.props.notifications?.birthday?.length === 0
      ? [
          {
            label: this.props.t('marketing:notifications.fabLabels.birthday'),
            onClick: () => this.setState({ createFormOpen: 'birthday' }),
          },
        ]
      : []),
    {
      label: this.props.t('marketing:notifications.fabLabels.meta_activity'),
      onClick: () => this.setState({ createFormOpen: 'meta_activity' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.workshop'),
      onClick: () => this.setState({ createFormOpen: 'workshop' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.establishment'),
      onClick: () => this.setState({ createFormOpen: 'establishment' }),
    },
    this.props.establishmentGroups?.length && {
      label: this.props.t(
        'marketing:notifications.fabLabels.establishmentGroup',
      ),
      onClick: () => this.setState({ createFormOpen: 'establishment_group' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.private_service'),
      onClick: () => this.setState({ createFormOpen: 'private_service' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.payment_pack'),
      onClick: () => this.setState({ createFormOpen: 'payment_pack' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.contract'),
      onClick: () => this.setState({ createFormOpen: 'contract' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.private_pass'),
      onClick: () => this.setState({ createFormOpen: 'private_pass' }),
    },
  ];

  closeForm = () => this.setState({ createFormOpen: null });

  render() {
    const { classes } = this.props;

    if (this.state.loading) {
      return (
        <div className={classes.loadingContainer}>
          <BackofficeLinearProgress />
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <div className={classes.notificationsContainer}>
          <MarketingRuleListBooking
            bookingNotifications={this.props.notifications.bookings}
            establishmentById={this.props.establishmentById}
            establishmentGroupById={this.props.establishmentGroupById}
            metaActivityBydId={this.props.metaActivityById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
            smartLists={this.props.smartLists}
          />
          <MarketingRuleListPrivateBooking
            privateBookingNotifications={
              this.props.notifications.privateBookings
            }
            establishmentById={this.props.establishmentById}
            establishmentGroupById={this.props.establishmentGroupById}
            privateServiceById={this.props.privateServicebyId}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            smartLists={this.props.smartLists}
            onUpdateNotification={this.props.updateMarketingNotification}
          />
          <MarketingRuleListPaymentPack
            paymentPackNotifications={this.props.notifications.byPaymentPack}
            paymentPackById={this.props.paymentPackById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
            smartLists={this.props.smartLists}
          />
          <MarketingRuleListPrivatePass
            privatePassNotifications={this.props.notifications.byPrivatePass}
            privatePassById={this.props.privatePassById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
            smartLists={this.props.smartLists}
          />
          <MarketingRuleListContract
            contractNotifications={this.props.notifications.byContract}
            contractById={this.props.contractById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
            smartLists={this.props.smartLists}
          />

          <Typography className={classes.classTitle} variant="h5">
            {this.props.t('marketing:notifications.groupTitle.birthday')}
          </Typography>
          <div>
            <NotificationsList
              notifications={this.props.notifications.birthday}
              emailSummariesById={this.props.emailSummariesById}
              onClickNotification={this.onClickNotification}
              onUpdateNotification={this.props.updateMarketingNotification}
              smartLists={[]}
            />
            {this.props.notifications?.birthday?.length === 0 && (
              <Typography>
                {this.props.t('marketing:notifications.notificationsEmpty')}
              </Typography>
            )}
          </div>
          <div className={classes.bottomPaddingFix} />
        </div>

        <div className={classes.emailContainer}>
          <MarketingRuleDetail
            emailSummary={this.getSelectedEmailTemplateSummary()}
            emailDetails={this.getSelectedEmailTemplateDetail()}
            loading={
              this.props.emailTemplateLoading ||
              this.props.notificationStatLoading
            }
            onClickEdit={() => {
              const editNotification = this.props.notificationList.find(
                (n) => n.id === this.state.selectedNotification,
              );
              this.setState({
                editNotification,
              });
            }}
            onClickRemove={this.onClickRemove}
            selectedNotification={this.props.notificationList.find(
              (n) => n.id === this.state.selectedNotification,
            )}
            establishmentById={this.props.establishmentById}
            establishmentGroupById={this.props.establishmentGroupById}
            metaActivityBydId={this.props.metaActivityById}
            privateServiceById={this.props.privateServicebyId}
            paymentPackById={this.props.paymentPackById}
            privatePassById={this.props.privatePassById}
            contractById={this.props.contractById}
            notificationsStatById={this.props.notificationsStatById}
            theme={this.props.theme}
          />
        </div>

        <MarketingRuleFormGeneric
          establishmentGroups={this.props.establishmentGroups}
          selectedNotification={this.state.editNotification}
          emailSummaryList={this.props.emailSummaryList}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emailDetails={this.props.emailDetailById}
          smartListLoading={this.props.smartListLoading}
          smartLists={this.props.smartLists}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          onCancel={() => this.setState({ editNotification: null })}
          onUpdateMarketingNotification={this.onEditNotification}
          onCreateMarketingNotification={this.handleCreate}
          metaActivities={this.props.metaActivities}
          workshopList={this.props.workshopList}
          establishments={this.props.establishments}
          privateServices={this.props.privateServices}
          paymentPacks={this.props.paymentPacks}
          contracts={this.props.contracts}
          tags={this.props.tagCategories}
          privatePasses={this.props.privatePasses}
          createFormOpenType={this.state.createFormOpen}
          closeForm={this.closeForm}
        />
        <FabWithItems
          label={this.props.t(
            'marketing:notifications.createNotificationFabLabel',
          )}
          items={this.getCreateButtonSpec()}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
  },
  notificationsContainer: {
    display: 'flex',
    flex: 1,
    height: '92vh',
    flexDirection: 'column',
    overflowY: 'scroll',
    paddingRight: theme.spacing(4),
  },
  bottomPaddingFix: {
    width: '100%',
    minHeight: theme.spacing(8),
  },
  emailContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    width: '100%',
  },
  classTitle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
});

const mapStateToProps = (state: RootState) => ({
  notifications: {
    ...getNotificationGrouped(state),
  },
  notificationList: getNotificationForMarketingPage(state),
  paymentPackById: state.paymentPack.byId,
  privatePassById: state.privateService.privatePass.byId,
  establishmentById: state.establishment.byId,
  establishmentGroupById: state.establishment.establishmentGroup.byId,
  privateServicebyId: state.privateService.privateService.byId,
  metaActivityById: state.metaActivity.byId,
  contractById: state.subscription.contract.byId,
  emailTemplateLoading: state.emailTemplate.loading,
  emailSummariesById: getAllEmailTemplatesDict(state),
  emailDetailById: getEmailTemplatesDetail(state),
  notificationsStatById: state.communication.marketingNotification.byId,
  notificationStatLoading: state.communication.marketingNotification.loading,
  emailDetailLoading: state.emailTemplate.detail.loading,
  emailListLoading: state.emailTemplate.loading,
  emailSummaryList: getAllEmailTemplatesSummaries(
    state,
  ) as EmailTemplateSummary[],
  smartLists: getAllSmartList(state),
  smartListLoading: state.smartList.loading,
  metaActivities: getPageEnabledPureMetaActivities(state),
  workshopList: getEnabledWorkshops(state),
  establishments: getAvailableEstablishmentList(state),
  establishmentGroups: withEstablishment(getAssociatedEstablishmentGroup)(
    state,
  ) as Array<EstablishmentGroup>,
  privateServices: _getPrivateServices(state),
  paymentPacks: getAllPaymentPacks(state),
  contracts: getActiveContractList(state),
  comm: state.communication,
  theme: getTheme(state),
  tagCategories: getTagCategories(state),
  privatePasses: getPrivatePasses(state),
});

const mapDispatchToProps = {
  fetchMarketingNotification,
  fetchMarketingNotificationList,
  fetchEmailTemplateSummariesBulk,
  fetchEstablishmentBulk,
  fetchPaymentPackBulk,
  fetchPrivateServiceBulk,
  fetchMetaActivityBulk,
  fetchEmailTemplatesSummaries,
  fetchEmailTemplateDetail: emailTemplateDetail,
  fetchEmailTemplateComplete: emailTemplateComplete,
  goToSmartlist: () => push('/smart-list'),
  getSmartLists: fetchAllSmartLists,
  updateMarketingNotification,
  createMarketingNotification,
  deleteMarketingNotification,
  fetchActivitiesCompany,
  fetchEstablishments,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  fetchPrivatePassList,
  fetchPaymentPackList: () =>
    fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
  fetchContractList,
  fetchMarketingNotificationCampaignSummary,
  fetchTagList,
  fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  push,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  routerParamsToProps({ notificationId: 'notificationId:number' }),
  withTranslation(['paymentPack', 'marketing']),
  withTitle(({ t }: { t: TFunction }) => t('titles:marketing.notifications')),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketingRuleListPage);
