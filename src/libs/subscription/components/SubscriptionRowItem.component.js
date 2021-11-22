// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import Avatar from '@material-ui/core/Avatar';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PauseIcon from '@material-ui/icons/Pause';
import DoneIcon from '@material-ui/icons/Done';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import { isPaused } from '../utils';
import { formatAsDate } from '../../../utils/datetime';

type Props = {
  subscription: Subscription,
  onClick: () => void,
  classes: Object,
  t: TFunction,
};

export class SubscriptionRowItem extends Component<Props> {
  static checkIfPaused(subscription: Subscription) {
    for (let i = 0; i < subscription.pauses.length; i += 1) {
      if (moment().isBefore(subscription.pauses[i].date_ended)) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { subscription, onClick } = this.props;
    return (
      <div>
        <ListItem dense button={!!onClick} onClick={onClick || null}>
          <ListItemAvatar>
            <Avatar
              src={subscription.member ? subscription.member.photo : null}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{subscription.memberName}</Typography>
                {subscription?.memberArchived && (
                  <Typography variant="caption" color="secondary">
                    {`${'\u00A0'}(${this.props.t('member:archived')})`}
                  </Typography>
                )}
              </div>
            }
            secondary={this.props.t('listItem.subscribedOn', {
              date: formatAsDate(subscription.first_billing_date),
            })}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
          {subscription.canceled_at ? (
            <div className={this.props.classes.subscriptionStatus}>
              <Typography variant="caption">
                {this.props.t('listItem.canceled')}
              </Typography>
              <ClearIcon className={this.props.classes.icon} />
            </div>
          ) : null}
          {subscription.has_ended ? (
            <div className={this.props.classes.subscriptionStatus}>
              <Typography variant="caption">
                {this.props.t('listItem.expired')}
              </Typography>
              <HourglassEmptyIcon className={this.props.classes.icon} />
            </div>
          ) : null}
          {isPaused(subscription.pauses) ? (
            <div className={this.props.classes.subscriptionStatus}>
              <Typography variant="caption">
                {this.props.t('listItem.paused')}
              </Typography>
              <PauseIcon className={this.props.classes.icon} />
            </div>
          ) : null}
          {!subscription.canceled_at &&
          !subscription.has_ended &&
          !SubscriptionRowItem.checkIfPaused(subscription) ? (
            <div className={this.props.classes.subscriptionStatus}>
              <Typography variant="caption">
                {this.props.t('listItem.valid')}
              </Typography>
              <DoneIcon className={this.props.classes.icon} />
            </div>
          ) : null}
        </ListItem>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    margin: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['subscription']),
)(SubscriptionRowItem);
