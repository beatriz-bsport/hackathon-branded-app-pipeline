// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import MailDialog from './MailDialog.component';
import { mailMembers as mailMembersAction } from '../actions';

type props = {
  email: string,
  id: number,
  name: string,
  classes: Object,
  accept_email: boolean,
  notificationIcon: boolean,
  mailMembers: (data: any) => void,
};

export class EmailListItem extends Component<props> {
  state = {
    displayMailDialog: false,
  };

  renderNotificationIcon = () => {
    return this.props.accept_email ? (
      <NotificationActiveIcon className={this.props.classes.notificationIcon} />
    ) : (
      <NotificationOffIcon className={this.props.classes.notificationIcon} />
    );
  };

  render() {
    const { email, id, name, notificationIcon } = this.props;
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
                this.setState({ displayMailDialog: true });
              }}
            >
              <EmailIcon />
            </Button>
          ) : null}
          {notificationIcon ? this.renderNotificationIcon() : null}
        </ListItem>
        <MailDialog
          open={this.state.displayMailDialog}
          sendMailAction={this.props.mailMembers}
          fullscreen
          receiverInfo={[{ id, name, email }]}
          onCancel={() => this.setState({ displayMailDialog: false })}
          receiversNotEditable
        />
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

function mapDispatchToProps(dispatch) {
  return {
    mailMembers(data: any) {
      dispatch(mailMembersAction(data));
    },
  };
}

export default compose(
  withStyles(style),
  connect(
    null,
    mapDispatchToProps,
  ),
)(EmailListItem);
