// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import SmsIcon from '@material-ui/icons/Sms';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import CallIcon from '@material-ui/icons/Call';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

type props = {
  phoneNumber: string,
  accept_contact: boolean,
  classes: Object,
  notificationIcon: boolean,
};

export class PhoneItem extends Component<props> {
  renderNotificationIcon = () => {
    return this.props.accept_contact ? (
      <NotificationActiveIcon className={this.props.classes.notificationIcon} />
    ) : (
      <NotificationOffIcon className={this.props.classes.notificationIcon} />
    );
  };

  render() {
    const { phoneNumber, notificationIcon } = this.props;
    return (
      <ListItem>
        <CallIcon />
        <ListItemText
          primary={phoneNumber || ' - '}
          className={this.props.classes.listItemText}
        />
        {phoneNumber ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = 'sms:'.concat(phoneNumber);
            }}
            color="primary"
          >
            <PhoneForwardedIcon />
          </Button>
        ) : null}
        {phoneNumber ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = 'sms:'.concat(phoneNumber);
            }}
            color="primary"
          >
            <SmsIcon />
          </Button>
        ) : null}
        {notificationIcon ? this.renderNotificationIcon() : null}
      </ListItem>
    );
  }
}

const style = (theme) => ({
  listItemText: {
    marginLeft: theme.spacing.unit * 2,
  },
  notificationIcon: {
    marginLeft: theme.spacing.unit * 2,
  },
});

export default compose(withStyles(style))(PhoneItem);
