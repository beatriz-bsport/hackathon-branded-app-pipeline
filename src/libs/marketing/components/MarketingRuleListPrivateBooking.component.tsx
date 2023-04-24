// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import {
  ButtonBase,
  Collapse,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  BOOKING_EVENT_RULES,
  PRIVATEBOOKING_EVENT_RULES,
} from '@bsport/common/lib/master-data/notification-rule-events';

import { DeepPartial, MaterialStyleType } from '../../../utils/types';
import { MarketingNotification } from '../types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';
import { PrivateService } from '../../private-service/types';
import MarketingNotificationsList from './MarketingRuleNotificationList.component';
import { SmartList } from '#libs/smart-list/types';
import { EmailTemplateSummary } from '../../email-editor/types';

const getLabelForKind = (
  kind: BOOKING_EVENT_RULES | PRIVATEBOOKING_EVENT_RULES,
  t: TFunction,
) => {
  const tradKey = {
    [PRIVATEBOOKING_EVENT_RULES.VALID]: 'valid',
    [PRIVATEBOOKING_EVENT_RULES.CANCELLED_REFUNDED]: 'refunded',
    [PRIVATEBOOKING_EVENT_RULES.CANCELLED_NOT_REFUNDED]: 'notRefunded',
    [BOOKING_EVENT_RULES.VALID_ATTENDANCE]: 'attendance',
    [BOOKING_EVENT_RULES.VALID_ABSENCE]: 'absence',
    [BOOKING_EVENT_RULES.CANCELLED_REFUNDED]: 'refunded',
    [BOOKING_EVENT_RULES.CANCELLED_NOT_REFUNDED]: 'notRefunded',
  };

  if (kind < BOOKING_EVENT_RULES.VALID_ATTENDANCE) {
    return t(
      `privateService:privateBookingNotification.form.ifKind.${tradKey[kind]}`,
    );
  }

  return t(`booking:notification.form.ifKind.${tradKey[kind]}`);
};

const getSessionLabel = (sessionNumber: number, t: TFunction) => {
  switch (sessionNumber) {
    case 0:
      return t(`booking:notification.form.bookingNumberAll`);
    case 1:
      return t(`booking:notification.form.bookingNumberFirst`);
    case 2:
      return t(`booking:notification.form.bookingNumberSecond`);
    case 3:
      return t(`booking:notification.form.bookingNumberThird`);
    default:
      return t(`booking:notification.form.bookingNumberN`, {
        notify_booking_nb: sessionNumber,
      });
  }
};

type OwnProps = {
  bookingNotifications: {
    [byGroup: string]: {
      identifier:
        | 'meta_activity'
        | 'establishment'
        | 'private_service'
        | 'establishment_group';
      bySession: {
        [bySession: string]: { [byKind: string]: MarketingNotification[] };
      };
    };
  };
  privateBookingNotifications: {
    [byGroup: string]: {
      identifier: 'meta_activity' | 'establishment' | 'private_service';
      bySession: {
        [bySession: string]: { [byKind: string]: MarketingNotification[] };
      };
    };
  };

  smartLists: SmartList[];
  onClickNotification: (notification: MarketingNotification) => void;
  establishmentById: { [key: string]: Establishment };
  establishmentGroupById: { [key: string]: EstablishmentGroup };
  metaActivityBydId: { [key: string]: MetaActivity };
  privateServiceById: { [key: string]: PrivateService };
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  onUpdateNotification: (
    id: number,
    data: DeepPartial<MarketingNotification>,
  ) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  showSection: boolean;
  hideById: { [key: string]: boolean | undefined };
};

export class MarketingRuleListPrivateBooking extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    showSection: true,
    hideById: {},
  };

  setShowSection = (showSection: boolean) => this.setState({ showSection });

  setHideById = (hideById: { [key: string]: boolean | undefined }) =>
    this.setState({ hideById });

  renderSession = (bySession: {
    [key: string]: { [key: string]: MarketingNotification[] };
  }) => {
    const { classes, t } = this.props;

    const sessionsKeys = Object.keys(bySession);
    const allSessionIndex = sessionsKeys.findIndex((it) => it === '0');
    allSessionIndex !== -1 &&
      sessionsKeys.push(sessionsKeys.splice(allSessionIndex, 1));

    return sessionsKeys.map((sessionNumber) => {
      const byKind = bySession[sessionNumber];

      return (
        <div className={classes.bySessionItem} key={sessionNumber}>
          <div className={classes.sessionTitleContainer}>
            <EventIcon />

            <Typography className={classes.sessionTitle}>
              {getSessionLabel(parseInt(sessionNumber), t)}
            </Typography>
          </div>

          <div className={classes.byKindContainer}>
            {Object.entries(byKind).map(([kind, notifications]) => {
              return (
                <div className={classes.byKindItem} key={kind}>
                  <Typography>
                    • {getLabelForKind(parseInt(kind), t)}
                  </Typography>
                  <MarketingNotificationsList
                    notifications={notifications}
                    emailSummariesById={this.props.emailSummariesById}
                    onClickNotification={this.props.onClickNotification}
                    smartLists={this.props.smartLists}
                    onUpdateNotification={this.props.onUpdateNotification}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  getLabel = (id: string, type: string) => {
    let label = '';
    if (type === 'establishment') {
      if (this.props.establishmentById[id]) {
        label = this.props.establishmentById[id].title;
      }
    }
    if (type === 'establishment_group') {
      if (this.props.establishmentGroupById[id]) {
        label = this.props.establishmentGroupById[id].name;
      }
    }
    if (type === 'meta_activity') {
      if (this.props.metaActivityBydId[id]) {
        label = this.props.metaActivityBydId[id].name;
      }
    }
    if (type === 'private_service') {
      if (this.props.privateServiceById[id]) {
        label = this.props.privateServiceById[id].name;
      }
    }
    return label;
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        <ButtonBase
          onClick={() => this.setShowSection(!this.state.showSection)}
          className={classes.buttonBaseHeader}
        >
          <Typography variant="h5">
            {t('marketing:notifications.groupTitle.privateBooking')}
          </Typography>
          {this.state.showSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        {!Object.entries(this.props.privateBookingNotifications).length && (
          <Typography>
            {t('marketing:notifications.notificationsEmpty')}
          </Typography>
        )}

        {Object.entries(this.props.privateBookingNotifications).map(
          ([key, group]) => (
            <Collapse in={this.state.showSection}>
              <div className={classes.itemContainer} key={key}>
                <ButtonBase
                  className={classes.buttonTitleContainer}
                  onClick={() => {
                    this.setHideById({
                      ...this.state.hideById,
                      [key]: !this.state.hideById[key],
                    });
                  }}
                >
                  <Typography color="primary" variant="h5">
                    {this.getLabel(key, group.identifier)}
                  </Typography>
                  {!this.state.hideById[key] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ButtonBase>

                <Collapse in={!this.state.hideById[key]}>
                  {this.renderSession(group.bySession)}
                </Collapse>
              </div>
            </Collapse>
          ),
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  bySessionItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  sessionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  sessionIcon: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },

  sessionTitle: {
    marginLeft: theme.spacing(2),
  },
  byKindContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.5),
    paddingLeft: theme.spacing(3.5),
    borderWidth: 0,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  byKindItem: {
    marginTop: theme.spacing(2),
  },
  buttonBaseHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100 %',
    marginBottom: theme.spacing(2),
  },
  buttonTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking', 'privateService', 'marketing']),
)(MarketingRuleListPrivateBooking);
