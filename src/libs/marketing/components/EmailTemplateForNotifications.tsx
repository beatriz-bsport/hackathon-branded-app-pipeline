import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import {
  BOOKING_EVENT_RULES,
  PAYMENT_PACK_EVENT_RULE,
} from '@bsport/common/lib/master-data/notification-rule-events';
import {
  Button,
  CircularProgress,
  Divider,
  Paper,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { MaterialStyleType } from '../../../utils/types';
import { MarketingNotification } from '../types';
import { Establishment } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';
import { PrivatePass, PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import { MarketingNotificationMailStat } from '../../communication/types';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import { CompanyTheme } from '../../theme/types';

import { PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME } from '#libs/private-service/utils';

type OwnProps = {
  emailSummary?: EmailTemplateSummary;
  emailDetails?: EmailTemplateDetail;
  loading: boolean;
  onClickEdit: () => void;
  onClickRemove: () => void;
  selectedNotification?: MarketingNotification;

  establishmentById: { [key: string]: Establishment };
  metaActivityBydId: { [key: string]: MetaActivity };
  privateServiceById: { [key: string]: PrivateService };
  paymentPackById: { [key: string]: PaymentPack };
  privatePassById: { [key: string]: PrivatePass };
  notificationsStatById: { [key: string]: MarketingNotificationMailStat };
  theme: CompanyTheme;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class EmailTemplateForNotifications extends React.PureComponent<Props> {
  get statData() {
    const { notificationsStatById, selectedNotification } = this.props;

    if (
      notificationsStatById &&
      selectedNotification &&
      notificationsStatById[selectedNotification.id]
    ) {
      return notificationsStatById[selectedNotification.id];
    }
    return undefined;
  }

  get statDataForDisplay() {
    const data = this.statData;

    let total_recipients: string | number = '-';
    let total_read: string | number = '-';
    let opened_rate: string | number = '-';

    if (data && typeof data.total_recipients === 'number') {
      total_recipients = data.total_recipients;
    }

    if (data && typeof data.total_read === 'number') {
      total_read = data.total_read;
    }

    if (
      data &&
      typeof data.total_recipients === 'number' &&
      typeof data.total_read === 'number'
    ) {
      opened_rate = `${(
        (data.total_read / data.total_recipients) *
        100
      ).toFixed(1)}%`;
    }

    return {
      total_recipients,
      total_read,
      opened_rate,
    };
  }

  getNotificationKind = (kind: number) => {
    // Deprecated stuff, for compatibility reasons
    if (kind === BOOKING_EVENT_RULES.BOOKING_DEPRECATED) {
      return 'bookingDeprecated';
    }
    if (kind === BOOKING_EVENT_RULES.CANCELLATION_DEPRECATED) {
      return 'cancelledDeprecated';
    }
    // ---------------------------------------------------------------------------
    if (
      kind === BOOKING_EVENT_RULES.VALID_ATTENDANCE ||
      kind === BOOKING_EVENT_RULES.ATTENDANCE_DEPRECATED
    ) {
      return 'attendance';
    }
    if (kind === BOOKING_EVENT_RULES.VALID_ABSENCE) {
      return 'absence';
    }
    if (kind === BOOKING_EVENT_RULES.CANCELLED_REFUNDED) {
      return 'refunded';
    }
    return 'notRefunded';
  };

  getPaymentPackNotificationKind = (notif: any) => {
    if (notif.kind === PAYMENT_PACK_EVENT_RULE.NOTIFICATION_TIME) {
      return notif.event_rules.days_left < 0 ? 'daysPast' : 'daysLeft';
    }
    return 'creditsLeft';
  };

  getPrivatePassNotificationKind = (notif: any) => {
    if (notif.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME) {
      return notif.event_rules.days_left < 0 ? 'daysPast' : 'daysLeft';
    }
    return 'creditsLeft';
  };

  renderPrimaryText = (notif: MarketingNotification) => {
    const { notify_booking_nb, kind, hours } = notif.event_rules;
    const { t } = this.props;

    if (notif.event_rules.payment_pack_id !== undefined) {
      const notificationKind = this.getPaymentPackNotificationKind(notif);
      if (notificationKind === 'creditsLeft') {
        return (
          <Typography>
            {`${t('paymentPack:notification.creditsLeft.first')} ${
              notif.event_rules.credits_left
            } ${t('paymentPack:notification.creditsLeft.second')}`}
          </Typography>
        );
      }
      return (
        <Typography>
          {`${t(
            `paymentPack:notification.${notificationKind}.first`,
          )} ${Math.abs(notif.event_rules.days_left)} ${t(
            `paymentPack:notification.${notificationKind}.second`,
          )}`}
        </Typography>
      );
    }
    if (notif.event_rules.private_pass_id !== undefined) {
      const notificationKind = this.getPrivatePassNotificationKind(notif);
      if (notificationKind === 'creditsLeft') {
        return (
          <Typography>
            {`${t('paymentPack:notification.creditsLeft.first')} ${
              notif.event_rules.credits_left
            } ${t('paymentPack:notification.creditsLeft.second')}`}
          </Typography>
        );
      }
      return (
        <Typography>
          {`${t(
            `paymentPack:notification.${notificationKind}.first`,
          )} ${Math.abs(notif.event_rules.days_left)} ${t(
            `paymentPack:notification.${notificationKind}.second`,
          )}`}
        </Typography>
      );
    }

    return (
      <Typography>
        {`${
          notify_booking_nb === 0
            ? t(
                `booking:notification.form.listItemPrimary.notifyAllEvents.${this.getNotificationKind(
                  kind,
                )}`,
              )
            : t(
                `booking:notification.form.listItemPrimary.${this.getNotificationKind(
                  kind,
                )}`,
                {
                  notify_booking_nb,
                },
              )
        } | ${t(
          `booking:notification.form.listItemPrimary.${
            hours > 0 ? 'after' : 'before'
          }`,
          {
            hours: Math.abs(hours),
          },
        )}`}
      </Typography>
    );
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        {this.props.selectedNotification &&
        this.statData &&
        !this.props.loading ? (
          <div className={classes.container2}>
            <Typography variant="h5" className={classes.sectionTitle}>
              {t('marketing:notifications.notificationDetails')}
            </Typography>
            <Divider className={classes.divider} />

            <Paper className={classes.paperDetail}>
              <Typography variant="h6">{getLabel(this.props)}</Typography>
              {this.renderPrimaryText(this.props.selectedNotification)}

              <div className={classes.notificationActions}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.props.onClickEdit}
                >
                  {t('marketing:notifications.editRule')}
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.removeContainer}
                  onClick={this.props.onClickRemove}
                >
                  {t('marketing:notifications.removeRule')}
                </Button>
              </div>
            </Paper>

            {this.props.emailSummary && this.props.emailDetails && (
              <>
                <Typography variant="h5" className={classes.titleMarginTop}>
                  {t('marketing:notifications.statisticDetails')}
                </Typography>

                <Divider className={classes.divider} />
                <Paper className={classes.paperStats}>
                  <div className={classes.statItem}>
                    <Typography variant="h5" align="center">
                      {this.statDataForDisplay.total_recipients}
                    </Typography>

                    <Typography variant="caption" align="center" component="p">
                      {t('marketing:notifications.stats.total_mail_send')}
                    </Typography>
                  </div>

                  <div className={classes.statItem}>
                    <Typography variant="h5" align="center">
                      {this.statDataForDisplay.opened_rate}
                    </Typography>

                    <Typography variant="caption" align="center" component="p">
                      {t('marketing:notifications.stats.opened_rate')}
                    </Typography>
                  </div>

                  <div className={classes.statItem}>
                    <Typography variant="h5" align="center">
                      {this.statDataForDisplay.total_read}
                    </Typography>

                    <Typography variant="caption" align="center" component="p">
                      {t('marketing:notifications.stats.total_mail_opened')}
                    </Typography>
                  </div>
                </Paper>

                <Typography variant="h5" className={classes.emailSummary}>
                  {t('marketing:notifications.mailTitle')}
                </Typography>
                <Divider className={classes.divider} />
                <Paper className={classes.mailPreview}>
                  <div
                    // eslint-disable-next-line
                    dangerouslySetInnerHTML={{
                      __html: this.props.emailDetails.html,
                    }}
                  />
                </Paper>
              </>
            )}
            <FeatureListProvider>
              {(featureList) => (
                <>
                  {featureList.upsell &&
                    featureList.upsell.find(
                      (f) => f.readable_identifier === 'push_notification',
                    ) &&
                    this.props.selectedNotification.push_notification_title !==
                      '' && (
                      <>
                        <Typography
                          variant="h5"
                          className={classes.titleMarginTop}
                        >
                          {t('marketing:notifications.notificationPreview')}
                        </Typography>

                        <Divider className={classes.divider} />

                        <div className={classes.greyBack}>
                          <Paper className={classes.notification}>
                            <div className={classes.notificationHeader}>
                              <div className={classes.notificationCompany}>
                                {this.props.theme.company_name}
                              </div>
                              <div className={classes.notificationHour}>
                                {moment().format('HH:mm')}
                              </div>
                            </div>
                            <div className={classes.notificationTitle}>
                              {
                                this.props.selectedNotification
                                  .push_notification_title
                              }
                            </div>
                            <Typography>
                              {
                                this.props.selectedNotification
                                  .push_notification_content
                              }
                            </Typography>
                          </Paper>
                        </div>
                      </>
                    )}
                </>
              )}
            </FeatureListProvider>
          </div>
        ) : (
          <div>
            {this.props.loading ? (
              <CircularProgress />
            ) : (
              <div className={classes.selectRulesContainer}>
                <InfoIcon />
                <Typography className={classes.marginTop}>
                  {t('marketing:notifications.selectNotificationRules')}
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const getLabel = (props: Props) => {
  const {
    selectedNotification,
    privateServiceById,
    metaActivityBydId,
    paymentPackById,
    establishmentById,
    privatePassById,
  } = props;

  if (!selectedNotification) {
    return '';
  }

  const {
    establishment_id,
    meta_activity_id,
    payment_pack_id,
    private_service_id,
    private_pass_id,
  } = selectedNotification.event_rules;

  if (establishment_id !== undefined && establishmentById[establishment_id]) {
    return establishmentById[establishment_id].title;
  }
  if (meta_activity_id !== undefined && metaActivityBydId[meta_activity_id]) {
    return metaActivityBydId[meta_activity_id].name;
  }

  if (
    private_service_id !== undefined &&
    privateServiceById[private_service_id]
  ) {
    return privateServiceById[private_service_id].name;
  }

  if (payment_pack_id && paymentPackById[payment_pack_id]) {
    return paymentPackById[payment_pack_id].name;
  }
  if (private_pass_id && privatePassById[private_pass_id]) {
    return privatePassById[private_pass_id].name;
  }
  return '';
};

const styles = (theme: Theme) => ({
  divider: {
    marginBottom: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  paperDetail: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  paperStats: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationActions: {
    display: 'flex',
    marginTop: theme.spacing(2),
  },
  removeContainer: {
    marginLeft: theme.spacing(2),
  },
  titleMarginTop: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  emailSummary: {
    width: '100%',
    marginTop: theme.spacing(4),
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: '#CCC',
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  mailPreview: {
    marginTop: theme.spacing(2),
    width: '100%',
    flex: 1,
  },
  selectRulesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  greyBack: {
    background: theme.palette.grey[300],
    boxShadow: theme.shadows[1],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  notification: {
    width: 360,
    padding: theme.spacing(2),
    borderRadius: 12,
    boxShadow: theme.shadows[2],
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  notificationHeader: {
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'space-between',
  },
  notificationCompany: {
    fontSize: 13,
    color: theme.palette.grey[500],
  },
  notificationHour: {
    fontSize: 13,
    color: theme.palette.grey[700],
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking', 'paymentPack', 'marketing']),
)(EmailTemplateForNotifications);
