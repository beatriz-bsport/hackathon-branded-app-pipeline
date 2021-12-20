import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import {
  getNotificationGrouped,
  getNotificationForMarketingPage,
} from '../../libs/marketing/selectors';
import { getTheme } from '../../libs/theme/selectors';
import {
  fetchMarketingNotification,
  fetchMarketingNotificationList,
  createMarketingNotification,
  updateMarketingNotification,
  deleteMarketingNotification,
} from '../../libs/marketing/actions';
import {
  emailTemplateComplete,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
  fetchEmailTemplateSummariesBulk,
} from '../../libs/email-editor/actions';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceBulk,
  fetchPrivatePassList,
} from '../../libs/private-service/actions';
import { getPrivatePassListBase as getPrivatePasses } from '../../libs/private-service/selectors/private-pass';

import {
  fetchAllActivities,
  fetchMetaActivityBulk,
} from '../../libs/meta-activity/actions';
import {
  fetchAllPaymentPacks,
  fetchPaymentPackBulk,
} from '../../libs/payment-packs/actions';
import {
  fetchEstablishmentBulk,
  fetchEstablishments,
} from '../../libs/establishment/actions';
import {
  getAllEmailTemplatesDict,
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import { fetchMarketingNotificationCampaignSummary } from '../../libs/communication/actions';
import { getAll as getAllPaymentPacks } from '../../libs/payment-packs/selectors';
import { fetchTagList } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';

import { MaterialStyleType } from '../../utils/types';
import ProductNotificationList from '../../libs/marketing/components/ProductNotificationList.component';
import AbstractBookingNotificationList from '../../libs/marketing/components/AbstractBookingNotificationList.component';
import { MarketingNotification } from '../../libs/marketing/types';
import EmailTemplateForNotifications from '../../libs/marketing/components/EmailTemplateForNotifications';
import { EmailTemplateSummary } from '../../libs/email-editor/types';
import NotificationFormGeneric from '../../libs/marketing/components/NotificationFormGeneric';
import { getAllSmartList } from '../../libs/smart-list/selectors';
import { fetchAllSmartLists } from '../../libs/smart-list/actions';
import {
  getPageEnabledMetaActivities,
  getEnabledWorkshops,
} from '../../libs/meta-activity/selectors';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import { _getPrivateServices } from '../../libs/private-service/selectors/private-service';
import { showDeleteDialog } from '../../components/genericDialog/CustomDialogs';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

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
};

export class MarketingNotifications extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedNotification: props.notificationId,
      editNotification: null,
      loading: false,
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
        NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
        NOTIFICATION_KIND.BOOKING_CREATION,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
        NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
        NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
      ],
    });

    const metaActivityIds: number[] = [];
    const privateServiceIds: number[] = [];
    const establishmentIds: number[] = [];
    const paymentPackIds: number[] = [];
    const emailDesignIds: number[] = [];

    notifications.forEach((n: MarketingNotification) => {
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
      emailDesignIds.push(n.email_design);
    });

    await Promise.all([
      this.props.fetchPaymentPackBulk(paymentPackIds),
      this.props.fetchEstablishmentBulk(establishmentIds),
      this.props.fetchPrivateServiceBulk(privateServiceIds),
      this.props.fetchMetaActivityBulk(metaActivityIds),
      this.props.fetchEmailTemplateSummariesBulk(emailDesignIds),
      this.props.fetchAllActivities(),
      this.props.fetchEstablishments(),
      this.props.fetchAllPrivateServices(),
      this.props.fetchAllPaymentPacks(),
      this.props.fetchTagList(),
      this.props.getSmartLists(),
      this.props.fetchPrivatePassList(),
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

  handleCreate = (notification: MarketingNotification) => {
    this.props.createMarketingNotification(notification, {
      onSuccess: (data: MarketingNotification) => {
        if (data.email_design) {
          this.props.fetchEmailTemplateComplete(data.email_design);
        }
        this.props.fetchMarketingNotificationCampaignSummary(data.id);
        this.props.push(`/marketing/notifications/${data.id}`);
      },
    });
  };

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
          <AbstractBookingNotificationList
            bookingNotifications={this.props.notifications.bookings}
            privateBookingNotifications={
              this.props.notifications.privateBookings
            }
            establishmentById={this.props.establishmentById}
            metaActivityBydId={this.props.metaActivityById}
            privateServiceById={this.props.privateServicebyId}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
          />
          <ProductNotificationList
            productKind="paymentPack"
            notificationsByProduct={this.props.notifications.byPaymentPack}
            productById={this.props.paymentPackById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
            smartLists={this.props.smartLists}
          />
          <ProductNotificationList
            productKind="privatePass"
            notificationsByProduct={this.props.notifications.byPrivatePass}
            productById={this.props.privatePassById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
            onUpdateNotification={this.props.updateMarketingNotification}
            smartLists={this.props.smartLists}
          />
          <div className={classes.bottomPaddingFix} />
        </div>

        <div className={classes.emailContainer}>
          <EmailTemplateForNotifications
            emailSummary={this.getSelectedEmailTemplateSummary()}
            emailDetails={this.getSelectedEmailTemplateDetail()}
            loading={
              this.props.emailTemplateLoading ||
              this.props.notificationStatLoading
            }
            onClickEdit={() =>
              this.setState((prevState: State) => ({
                editNotification: this.props.notificationList.find(
                  (n) => n.id === prevState.selectedNotification,
                ),
              }))
            }
            onClickRemove={this.onClickRemove}
            selectedNotification={this.props.notificationList.find(
              (n) => n.id === this.state.selectedNotification,
            )}
            establishmentById={this.props.establishmentById}
            metaActivityBydId={this.props.metaActivityById}
            privateServiceById={this.props.privateServicebyId}
            paymentPackById={this.props.paymentPackById}
            privatePassById={this.props.privatePassById}
            notificationsStatById={this.props.notificationsStatById}
            theme={this.props.theme}
          />
        </div>

        <NotificationFormGeneric
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
          tags={this.props.tagCategories}
          privatePasses={this.props.privatePasses}
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
});

const mapStateToProps = (state: RootState) => ({
  notifications: {
    ...getNotificationGrouped(state),
  },
  notificationList: getNotificationForMarketingPage(state),
  paymentPackById: state.paymentPack.byId,
  privatePassById: state.privateService.privatePass.byId,
  establishmentById: state.establishment.byId,
  privateServicebyId: state.privateService.privateService.byId,
  metaActivityById: state.metaActivity.byId,
  emailTemplateLoading: state.emailTemplate.isLoading,
  emailSummariesById: getAllEmailTemplatesDict(state),
  emailDetailById: getEmailTemplatesDetail(state),
  notificationsStatById: state.communication.marketingNotification.byId,
  notificationStatLoading: state.communication.marketingNotification.loading,
  emailDetailLoading: state.emailTemplate.detail.isLoading,
  emailListLoading: state.emailTemplate.isLoading,
  emailSummaryList: getAllEmailTemplatesSummaries(
    state,
  ) as EmailTemplateSummary[],
  smartLists: getAllSmartList(state),
  smartListLoading: state.smartList.isLoading,
  metaActivities: getPageEnabledMetaActivities(state),
  workshopList: getEnabledWorkshops(state),
  establishments: getAvailableEstablishmentList(state),
  privateServices: _getPrivateServices(state),
  paymentPacks: getAllPaymentPacks(state),
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
  fetchAllActivities,
  fetchEstablishments,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  fetchPrivatePassList,
  fetchAllPaymentPacks,
  fetchMarketingNotificationCampaignSummary,
  fetchTagList,
  push,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  routerParamsToProps({ notificationId: 'notificationId:number' }),
  withTranslation(['paymentPack']),
  withTitle(({ t }: { t: TFunction }) => t('titles:marketing.notifications')),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketingNotifications);
