// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

type props = {
  email: string,
  classes: Object,
  accept_email: boolean,
  notificationIcon: boolean,
  openMailDialog: () => void,
};

export class EmailListItem extends Component<props> {
  renderNotificationIcon = () => {
    return this.props.accept_email ? (
      <NotificationActiveIcon className={this.props.classes.notificationIcon} />
    ) : (
      <NotificationOffIcon className={this.props.classes.notificationIcon} />
    );
  };

  render() {
    const { email, notificationIcon } = this.props;
    return (
      <div>
        <ListItem>
          <AlternateEmailIcon />
          <ListItemText
            primary={email || ' - '}
            className={this.props.classes.listItemText}
          />
          {email ? (
            <Button
              color="primary"
              onClick={() => {
                this.props.openMailDialog();
              }}
            >
              <EmailIcon />
            </Button>
          ) : null}
          {notificationIcon ? this.renderNotificationIcon() : null}
        </ListItem>
      </div>
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

export default compose(withStyles(style))(EmailListItem);
