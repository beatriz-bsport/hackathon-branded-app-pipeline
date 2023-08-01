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
import { SMALL_MOBILE_CRITICAL_SIZE } from '#libs/member/constants';

type Props = {
  phoneNumber: string,
  accept_contact: boolean,
  classes: Object,
  notificationIcon: boolean,
  hideContactButton?: boolean,
  openSmsDialog: () => void,
};

export class PhoneItem extends Component<Props> {
  renderNotificationIcon = () => {
    return this.props.accept_contact ? (
      <NotificationActiveIcon className={this.props.classes.notificationIcon} />
    ) : (
      <NotificationOffIcon className={this.props.classes.notificationIcon} />
    );
  };

  render() {
    const {
      phoneNumber,
      notificationIcon,
      classes,
      hideContactButton,
      openSmsDialog,
    } = this.props;

    return (
      <ListItem className={classes.listItem}>
        <div className={classes.phoneContainers}>
          <CallIcon />
          <ListItemText
            className={classes.listItemText}
            primary={phoneNumber || ' - '}
          />
        </div>
        <div className={classes.phoneContainers}>
          {phoneNumber && !hideContactButton && (
            <Button
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = 'sms:'.concat(phoneNumber);
              }}
            >
              <PhoneForwardedIcon />
            </Button>
          )}
          {phoneNumber && openSmsDialog && !hideContactButton && (
            <Button
              color="primary"
              onClick={() => {
                openSmsDialog();
              }}
            >
              <SmsIcon />
            </Button>
          )}
          {notificationIcon && this.renderNotificationIcon()}
        </div>
      </ListItem>
    );
  }
}

const style = (theme) => ({
  listItemText: {
    marginLeft: theme.spacing(2),
  },
  notificationIcon: {
    marginLeft: theme.spacing(2),
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down(SMALL_MOBILE_CRITICAL_SIZE)]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  phoneContainers: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(withStyles(style))(PhoneItem);
