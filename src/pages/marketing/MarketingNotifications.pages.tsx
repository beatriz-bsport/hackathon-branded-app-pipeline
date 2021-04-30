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
import { RootState } from '../../reducers';
import { getNotificationGrouped } from '../../libs/marketing/selectors';
import {
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
} from '../../libs/private-service/actions';
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
import { getAll as getAllPaymentPacks } from '../../libs/payment-packs/selectors';

import { MaterialStyleType } from '../../utils/types';
import PaymentPackNotificationList from '../../libs/marketing/components/PaymentPackNotificationList.component';
import AbstractBookingNotificationList from '../../libs/marketing/components/AbstractBookingNotificationList.component';
import { MarketingNotification } from '../../libs/marketing/types';
import EmailTemplateForNotifications from '../../libs/marketing/components/EmailTemplateForNotifications';
import { EmailTemplateSummary } from '../../libs/email-editor/types';
import NotificationFormGeneric from '../../libs/marketing/components/NotificationFormGeneric';
import { getAllSmartList } from '../../libs/smart-list/selectors';
import { fetchAllSmartLists } from '../../libs/smart-list/actions';
import { getPageEnabledMetaActivities } from '../../libs/meta-activity/selectors';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import { _getPrivateServices } from '../../libs/private-service/selectors/private-service';
import { showDeleteDialog } from '../../components/GenericDialog/CustomDialogs';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  selectedNotification?: MarketingNotification | null;
  editNotification?: MarketingNotification | null;
  emailTemplateLoading: boolean;
  loading: boolean;
};

export class MarketingNotifications extends Component<Props, State> {
  state: State = {
    selectedNotification: null,
    editNotification: null,
    emailTemplateLoading: false,
    loading: true,
  };

  get selectedEmailTemplateSummary() {
    const { selectedNotification } = this.state;
    const { emailSummariesById } = this.props;
    if (
      selectedNotification &&
      emailSummariesById[selectedNotification.email_design]
    ) {
      return emailSummariesById[selectedNotification.email_design];
    }
    return undefined;
  }

  get selectedEmailTemplateDetail() {
    const { selectedNotification } = this.state;
    const { emailDetailById } = this.props;
    if (
      selectedNotification &&
      emailDetailById[selectedNotification.email_design]
    ) {
      return emailDetailById[selectedNotification.email_design];
    }
    return undefined;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const notifications: any = await this.props.fetchMarketingNotificationList({
      kind__in: [
        NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
        NOTIFICATION_KIND.BOOKING_CREATION,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
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
    ]);

    this.setState({ loading: false });
  };

  onClickNotification = async (notification: MarketingNotification) => {
    this.setState({ emailTemplateLoading: true });
    await this.props.fetchEmailTemplateComplete(notification.email_design);
    this.setState({
      selectedNotification: notification,
      emailTemplateLoading: false,
    });
  };

  onClickRemove = async () => {
    const { t } = this.props;
    const res = await showDeleteDialog(
      t('marketing:notifications.deleteDialogTitle'),
      t('marketing:notifications.deleteDialogText'),
    );
    if (res && this.state.selectedNotification) {
      this.props.deleteMarketingNotification(
        this.state.selectedNotification.id,
      );
      this.setState({ selectedNotification: null });
    }
  };

  onEditNotification = async (id: number, n: MarketingNotification) => {
    this.setState({ editNotification: null });
    this.props.updateMarketingNotification(id, n);
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
          />
          <PaymentPackNotificationList
            notificationsByPaymentPack={this.props.notifications.byPaymentPack}
            paymentPackById={this.props.paymentPackById}
            onClickNotification={this.onClickNotification}
            emailSummariesById={this.props.emailSummariesById}
          />

          <div className={classes.bottomPaddingFix} />
        </div>

        <div className={classes.emailContainer}>
          <EmailTemplateForNotifications
            emailSummary={this.selectedEmailTemplateSummary}
            emailDetails={this.selectedEmailTemplateDetail}
            loading={this.state.emailTemplateLoading}
            onClickEdit={() =>
              this.setState((prevState: State) => ({
                editNotification: prevState.selectedNotification,
              }))
            }
            onClickRemove={this.onClickRemove}
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
          onCreateMarketingNotification={this.props.createMarketingNotification}
          metaActivities={this.props.metaActivities}
          establishments={this.props.establishments}
          privateServices={this.props.privateServices}
          paymentPacks={this.props.paymentPacks}
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
  paymentPackById: state.paymentPack.byId,
  establishmentById: state.establishment.byId,
  privateServicebyId: state.privateService.privateService.byId,
  metaActivityById: state.metaActivity.byId,
  emailSummariesById: getAllEmailTemplatesDict(state),
  emailDetailById: getEmailTemplatesDetail(state),
  emailDetailLoading: state.emailTemplate.detail.isLoading,
  emailListLoading: state.emailTemplate.isLoading,
  emailSummaryList: getAllEmailTemplatesSummaries(
    state,
  ) as EmailTemplateSummary[],
  smartLists: getAllSmartList(state),
  smartListLoading: state.smartList.isLoading,
  metaActivities: getPageEnabledMetaActivities(state),
  establishments: getAvailableEstablishmentList(state),
  privateServices: _getPrivateServices(state),
  paymentPacks: getAllPaymentPacks(state),
});

const mapDispatchToProps = {
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
  fetchAllPaymentPacks,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['paymentPack']),
  withTitle(({ t }: { t: TFunction }) => t('titles:marketing.notifications')),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketingNotifications);
