import React from 'react';
import { compose } from 'recompose';
import {
  ButtonBase,
  Collapse,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import { DeepPartial, MaterialStyleType } from '../../../utils/types';
import { MarketingNotification } from '../types';
import { PaymentPack } from '../../../api/types';
import MarketingNotificationsList from './NotificationsList.Component';
import { EmailTemplateSummary } from '../../email-editor/types';
import { SmartList } from '../../smart-list/types';
import type { PrivatePass } from '#libs/private-service/types';

type OwnProps = {
  productKind: string;
  notificationsByProduct: { [key: string]: MarketingNotification[] };
  productById: { [key: string]: PaymentPack | PrivatePass };
  onClickNotification: (notification: MarketingNotification) => void;
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  onUpdateNotification: (
    id: number,
    data: DeepPartial<MarketingNotification>,
  ) => void;
  smartLists: SmartList[];
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  hideById: { [key: string]: boolean | undefined };
  showSection: boolean;
}

export class PaymentPackNotificationList extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    hideById: {},
    showSection: true,
  };

  render() {
    const { classes, t, productKind } = this.props;
    return (
      <div>
        {productKind === 'paymentPack' && (
          <>
            <ButtonBase
              onClick={() =>
                this.setState((prevState: State) => ({
                  ...prevState,
                  showSection: !prevState.showSection,
                }))
              }
              className={classes.buttonTitleHeader}
            >
              <Typography variant="h5">
                {t('notifications.groupTitle.paymentPack')}
              </Typography>
              {this.state.showSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>

            {!Object.keys(this.props.notificationsByProduct).length && (
              <Typography>
                {t('marketing:notifications.notificationsEmpty')}
              </Typography>
            )}
          </>
        )}
        {productKind === 'privatePass' && (
          <>
            <ButtonBase
              onClick={() =>
                this.setState((prevState: State) => ({
                  ...prevState,
                  showSection: !prevState.showSection,
                }))
              }
              className={classes.buttonTitleHeader}
            >
              <Typography variant="h5">
                {t('notifications.groupTitle.privatePass')}
              </Typography>
              {this.state.showSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>

            {!Object.keys(this.props.notificationsByProduct).length && (
              <Typography>
                {t('marketing:notifications.notificationsEmpty')}
              </Typography>
            )}
          </>
        )}
        {Object.keys(this.props.notificationsByProduct).map((id) => {
          const notifications: MarketingNotification[] =
            this.props.notificationsByProduct[id];
          const product = this.props.productById[id];

          const byCredits = notifications.filter((n) =>
            productKind === 'paymentPack'
              ? n.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT
              : n.kind === 6,
          );
          const byTime = notifications.filter((n) =>
            productKind === 'paymentPack'
              ? n.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME
              : n.kind === 5,
          );

          if (product) {
            return (
              <Collapse in={this.state.showSection}>
                <div className={classes.paymentPackItem} key={id}>
                  <ButtonBase
                    className={classes.buttonTitleContainer}
                    onClick={() => {
                      this.setState((prevState: State) => ({
                        hideById: {
                          ...prevState.hideById,
                          [id]: !prevState.hideById[id],
                        },
                      }));
                    }}
                  >
                    <Typography variant="h5" color="primary">
                      {product.name}
                    </Typography>

                    {!this.state.hideById[id] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ButtonBase>

                  <Collapse in={!this.state.hideById[id]}>
                    {!!byTime.length && (
                      <div className={classes.byKindContainer}>
                        <div className={classes.titleContainer}>
                          <AvTimerIcon />
                          <Typography className={classes.title}>
                            {t('notifications.paymentPackKind.validity')}
                          </Typography>
                        </div>
                        <div className={classes.notificationsContainer}>
                          <MarketingNotificationsList
                            notifications={byTime}
                            emailSummariesById={this.props.emailSummariesById}
                            onClickNotification={this.props.onClickNotification}
                            onUpdateNotification={
                              this.props.onUpdateNotification
                            }
                            smartLists={this.props.smartLists}
                          />
                        </div>
                      </div>
                    )}

                    {!!byCredits.length && (
                      <div className={classes.byKindContainer}>
                        <div className={classes.titleContainer}>
                          <ConfirmationNumberIcon />
                          <Typography className={classes.title}>
                            {t('notifications.paymentPackKind.credit')}
                          </Typography>
                        </div>
                        <div className={classes.notificationsContainer}>
                          <MarketingNotificationsList
                            notifications={byCredits}
                            emailSummariesById={this.props.emailSummariesById}
                            onClickNotification={this.props.onClickNotification}
                            onUpdateNotification={
                              this.props.onUpdateNotification
                            }
                            smartLists={this.props.smartLists}
                          />
                        </div>
                      </div>
                    )}
                  </Collapse>
                </div>
              </Collapse>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  paymentPackItem: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  byKindContainer: {
    marginTop: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonTitleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  notificationsContainer: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(2),
    marginLeft: theme.spacing(1.5),
    paddingLeft: theme.spacing(3.5),
    borderWidth: 0,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  buttonTitleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    width: '100%',
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['marketing']),
)(PaymentPackNotificationList);
