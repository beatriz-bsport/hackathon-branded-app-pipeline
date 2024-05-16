import React from 'react';
import Alert from '@material-ui/lab/Alert/Alert';

import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  NOTIFICATION_KIND,
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

import { TFunction } from 'i18next';
import NotificationPushPreview from '#src/components/notification-push/NotificationPushPreview.component';
import { PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME } from '#src/libs/private-service/utils';
import HTMLPreview from '#src/components/html/HTMLPreview.component';
import { Contract } from '#src/libs/subscription/types';
import CommunicationDrawer from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import { CONTEXT_NOTIFICATION } from '#src/libs/communication-v2/constants';
import { UPSELL_IDENTIFIER_PUSH_NOTIFICATION } from '#src/libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#src/libs/company/types';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '../../email-editor/types';
import { MaterialStyleType } from '../../../utils/types';
import { MarketingNotification } from '../types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';
import { PrivatePass, PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import { MarketingNotificationMailStat } from '../../communication/types';
// @ts-expect-error
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import { CompanyTheme } from '../../theme/types';

import Config from '../../../config';

type OwnProps = {
  emailSummary?: EmailTemplateSummary;
  emailDetails?: EmailTemplateDetail;
  loading: boolean;
  onClickEdit: () => void;
  onClickRemove: () => void;
  selectedNotification?: MarketingNotification;
  establishmentById: { [key: string]: Establishment };
  establishmentGroupById: { [key: string]: EstablishmentGroup };
  metaActivityBydId: { [key: string]: MetaActivity };
  privateServiceById: { [key: string]: PrivateService };
  paymentPackById: { [key: string]: PaymentPack };
  privatePassById: { [key: string]: PrivatePass };
  contractById: { [key: string]: Contract };
  notificationsStatById: { [key: string]: MarketingNotificationMailStat };
  theme: CompanyTheme;
  resolvedGenericTags: ResolvedGenericTags;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  openCommunicationDrawer: boolean;
};

class MarketingRuleDetail extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCommunicationDrawer: false,
    };
  }

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

  getContractLabel = (notification: MarketingNotification, t: TFunction) => {
    const { days, hours } = notification.event_rules;
    const kind = notification.kind;
    let period = 0;
    if (days !== null) {
      period = days;
    } else if (hours !== null) {
      period = hours;
    }
    let count = period;
    let isAfterEvent = true;
    if (period < 0) {
      count = -period;
      isAfterEvent = false;
    }
    const notificationKind = (() => {
      switch (kind) {
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION:
          return t('subscription:notification.creation').toLowerCase();
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING: {
          return isAfterEvent
            ? t('subscription:notification.afterfirstBilling').toLowerCase()
            : t('subscription:notification.beforefirstBilling').toLowerCase();
        }
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END: {
          return isAfterEvent
            ? t('subscription:notification.afterSubscriptionEnd').toLowerCase()
            : t(
                'subscription:notification.beforeSubscriptionEnd',
              ).toLowerCase();
        }
        default: {
          return '';
        }
      }
    })();
    return t('subscription:notification.title', {
      count,
      periodScale:
        days !== null
          ? t('subscription:notification.days', { count }).toLowerCase()
          : t('subscription:notification.hours', { count }).toLowerCase(),
      notificationKind,
    });
  };

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

  getPrimaryText = (notif: MarketingNotification) => {
    const { notify_booking_nb, kind, hours, days } = notif.event_rules;
    const { t } = this.props;

    if (notif.event_rules.payment_pack_ids !== undefined) {
      const notificationKind = this.getPaymentPackNotificationKind(notif);
      if (notificationKind === 'creditsLeft') {
        return `${t(
          'paymentPack:notification.creditsLeft.first',
        )} ${getCreditsDividedDisplay(notif.event_rules.credits_left)} ${t(
          'paymentPack:notification.creditsLeft.second',
        )}`;
      }
      return `${t(
        `paymentPack:notification.${notificationKind}.first`,
      )} ${Math.abs(notif.event_rules.days_left)} ${t(
        `paymentPack:notification.${notificationKind}.second`,
      )}`;
    }
    if (notif.event_rules.private_pass_ids !== undefined) {
      const notificationKind = this.getPrivatePassNotificationKind(notif);
      if (notificationKind === 'creditsLeft') {
        return `${t(
          'paymentPack:notification.creditsLeft.first',
        )} ${getCreditsDividedDisplay(notif.event_rules.credits_left)} ${t(
          'paymentPack:notification.creditsLeft.second',
        )}`;
      }
      return `${t(
        `paymentPack:notification.${notificationKind}.first`,
      )} ${Math.abs(notif.event_rules.days_left)} ${t(
        `paymentPack:notification.${notificationKind}.second`,
      )}`;
    }

    if (notif.kind === NOTIFICATION_KIND.BIRTHDAY) {
      return t('booking:notification.form.listItemPrimary.birthday');
    }

    return `${
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
    } | ${
      hours
        ? t(
            `booking:notification.form.listItemPrimary.${
              hours > 0 ? 'hour_after' : 'hour_before'
            }`,
            {
              hours: Math.abs(hours),
              count: Math.abs(hours),
            },
          )
        : t(
            `booking:notification.form.listItemPrimary.${
              days > 0 ? 'day_after' : 'day_before'
            }`,
            {
              days: Math.abs(days),
              count: Math.abs(days),
            },
          )
    }`;
  };

  renderPrimaryText = (notif: MarketingNotification) => {
    const { notify_booking_nb, kind, hours, days } = notif.event_rules;
    const { t } = this.props;

    if (notif.event_rules.payment_pack_ids !== undefined) {
      const notificationKind = this.getPaymentPackNotificationKind(notif);
      if (notificationKind === 'creditsLeft') {
        return (
          <Typography>
            {`${t(
              'paymentPack:notification.creditsLeft.first',
            )} ${getCreditsDividedDisplay(notif.event_rules.credits_left)} ${t(
              'paymentPack:notification.creditsLeft.second',
            )}`}
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
    if (notif.event_rules.private_pass_ids !== undefined) {
      const notificationKind = this.getPrivatePassNotificationKind(notif);
      if (notificationKind === 'creditsLeft') {
        return (
          <Typography>
            {`${t(
              'paymentPack:notification.creditsLeft.first',
            )} ${getCreditsDividedDisplay(notif.event_rules.credits_left)} ${t(
              'paymentPack:notification.creditsLeft.second',
            )}`}
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
    if (notif.event_rules.contract_id !== undefined) {
      return <Typography>{this.getContractLabel(notif, t)}</Typography>;
    }

    if (notif.kind === NOTIFICATION_KIND.BIRTHDAY) {
      return (
        <Typography>
          {t('booking:notification.form.listItemPrimary.birthday')}
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
        } |  ${
          hours
            ? t(
                `booking:notification.form.listItemPrimary.${
                  hours > 0 ? 'hour_after' : 'hour_before'
                }`,
                {
                  hours: Math.abs(hours),
                  count: Math.abs(hours),
                },
              )
            : t(
                `booking:notification.form.listItemPrimary.${
                  days > 0 ? 'day_after' : 'day_before'
                }`,
                {
                  days: Math.abs(days),
                  count: Math.abs(days),
                },
              )
        }`}
      </Typography>
    );
  };

  onOpenCommunicationDrawerClick = () => {
    this.setState({ openCommunicationDrawer: true });
  };

  onCloseCommunicationDrawerClick = () => {
    this.setState({ openCommunicationDrawer: false });
  };

  render() {
    const {
      classes,
      t,
      selectedNotification,
      privateServiceById,
      metaActivityBydId,
      paymentPackById,
      establishmentById,
      establishmentGroupById,
      privatePassById,
      contractById,
    } = this.props;
    return (
      <React.Fragment>
        {(Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'local' ||
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
          this.props.theme?.company === 498) &&
          !!this.props.selectedNotification && (
            <CommunicationDrawer
              contextIdentifier={CONTEXT_NOTIFICATION}
              contextObjectId={this.props.selectedNotification?.id}
              contextTitle={this.getPrimaryText(
                this.props.selectedNotification,
              )}
              onDrawerClose={this.onCloseCommunicationDrawerClick}
              openDrawer={this.state.openCommunicationDrawer}
            />
          )}
        <div className={classes.container}>
          {this.props.selectedNotification &&
          this.statData &&
          !this.props.loading ? (
            <div className={classes.container2}>
              <Typography className={classes.sectionTitle} variant="h5">
                {t('marketing:notifications.notificationDetails')}
              </Typography>
              <Divider className={classes.divider} />

              <Paper className={classes.paperDetail}>
                <Typography variant="h6">
                  {getLabel({
                    selectedNotification,
                    privateServiceById,
                    metaActivityBydId,
                    paymentPackById,
                    establishmentById,
                    establishmentGroupById,
                    privatePassById,
                    contractById,
                  })}
                </Typography>
                {this.renderPrimaryText(this.props.selectedNotification)}
                <ObjectLevelPermissionWrapper
                  forcedBehavior="hidden"
                  requiredPermission="member.allowed_actions.manageNotification"
                >
                  <div className={classes.notificationActions}>
                    <Button
                      color="primary"
                      onClick={this.props.onClickEdit}
                      variant="contained"
                    >
                      {t('marketing:notifications.editRule')}
                    </Button>

                    <Button
                      className={classes.removeContainer}
                      color="primary"
                      onClick={this.props.onClickRemove}
                      variant="outlined"
                    >
                      {t('marketing:notifications.removeRule')}
                    </Button>
                  </div>
                </ObjectLevelPermissionWrapper>
              </Paper>

              {this.props.emailSummary && this.props.emailDetails && (
                <>
                  <Typography className={classes.titleMarginTop} variant="h5">
                    {t('marketing:notifications.statisticDetails')}
                  </Typography>

                  <Divider className={classes.divider} />
                  <Paper className={classes.paperStats}>
                    <div className={classes.statItem}>
                      <Typography align="center" variant="h5">
                        {this.statDataForDisplay.total_recipients}
                      </Typography>

                      <Typography
                        align="center"
                        component="p"
                        variant="caption"
                      >
                        {t('marketing:notifications.stats.total_mail_send')}
                      </Typography>
                    </div>

                    <div className={classes.statItem}>
                      <Typography align="center" variant="h5">
                        {this.statDataForDisplay.opened_rate}
                      </Typography>

                      <Typography
                        align="center"
                        component="p"
                        variant="caption"
                      >
                        {t('marketing:notifications.stats.opened_rate')}
                      </Typography>
                    </div>

                    <div className={classes.statItem}>
                      <Typography align="center" variant="h5">
                        {this.statDataForDisplay.total_read}
                      </Typography>

                      <Typography
                        align="center"
                        component="p"
                        variant="caption"
                      >
                        {t('marketing:notifications.stats.total_mail_opened')}
                      </Typography>
                    </div>
                  </Paper>
                  {(Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'local' ||
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
                    this.props.theme?.company === 498) && (
                    <Button
                      color="primary"
                      disabled={!this.props.selectedNotification}
                      onClick={this.onOpenCommunicationDrawerClick}
                      size="medium"
                      variant="contained"
                    >
                      {t('communication:generic.history')}
                    </Button>
                  )}
                  <Typography className={classes.emailSummary} variant="h5">
                    {t('marketing:notifications.mailTitle')}
                  </Typography>
                  <Divider className={classes.divider} />
                  <HTMLPreview
                    scrolling
                    html={this.props.emailDetails.html}
                    resolvedGenericTags={this.props.resolvedGenericTags}
                  />
                </>
              )}
              <FeatureListProvider>
                {(featureList: FeatureList) => (
                  <>
                    {hasUpsell(
                      featureList,
                      UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
                    ) &&
                      this.props.selectedNotification
                        .push_notification_title !== '' && (
                        <>
                          <Typography
                            className={classes.titleMarginTop}
                            variant="h5"
                          >
                            {t('marketing:notifications.notificationPreview')}
                          </Typography>

                          <Divider className={classes.divider} />

                          <NotificationPushPreview
                            notification={this.props.selectedNotification}
                            resolvedGenericTags={this.props.resolvedGenericTags}
                            theme={this.props.theme}
                          />
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
                  <Alert className={classes.alertInfo} severity="info">
                    {t('marketing:notifications.selectNotificationRules')}
                  </Alert>
                </div>
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

type GetLabelProps = Pick<
  Props,
  | 'selectedNotification'
  | 'privateServiceById'
  | 'metaActivityBydId'
  | 'paymentPackById'
  | 'establishmentById'
  | 'establishmentGroupById'
  | 'privatePassById'
  | 'contractById'
>;

const getLabel = ({
  selectedNotification,
  privateServiceById,
  metaActivityBydId,
  paymentPackById,
  establishmentById,
  establishmentGroupById,
  privatePassById,
  contractById,
}: GetLabelProps) => {
  if (!selectedNotification) {
    return '';
  }

  const {
    establishment_id,
    meta_activity_id,
    payment_pack_ids,
    private_service_id,
    private_pass_ids,
    establishment_group_id,
    contract_id,
  } = selectedNotification.event_rules;

  if (establishment_id !== undefined && establishmentById[establishment_id]) {
    return establishmentById[establishment_id].title;
  }
  if (
    establishment_group_id !== undefined &&
    establishmentGroupById[establishment_group_id]
  ) {
    return establishmentGroupById[establishment_group_id].name;
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

  if (payment_pack_ids?.length > 0) {
    return paymentPackById[payment_pack_ids[0]].name;
  }
  if (private_pass_ids?.length > 0) {
    return privatePassById[private_pass_ids[0]].name;
  }
  if (contract_id && contractById[contract_id]) {
    return contractById[contract_id].name;
  }
  return '';
};

const styles = (theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
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
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['booking', 'paymentPack', 'marketing']),
)(MarketingRuleDetail);
