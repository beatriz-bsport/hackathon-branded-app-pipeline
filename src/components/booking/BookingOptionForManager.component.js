// @flow

import React, { Component } from 'react';

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { formatAsDatetime } from '../../datetime';

type Props = {
  t: (x: string) => string,
  heading: ?string,
  option: Object,
};

export class BookingOptionForManager extends Component<Props> {
  renderButton = () => (
    <Button variant="outlined" disabled>
      {this.props.t('booking.onHold')}
    </Button>
  );

  getHeading = () => {
    const { heading, option } = this.props;
    switch (heading) {
      case 'date_start':
        return formatAsDatetime(option.offer.date_start);
      default:
        return option.user.name;
    }
  };

  getAvatar = () => {
    const { heading, option } = this.props;
    switch (heading) {
      case 'date_start':
        return null;
      default:
        return <Avatar src={option.user.photo} />;
    }
  };

  render() {
    const { option, t } = this.props;
    return (
      <ListItem divider>
        {this.getAvatar()}
        <ListItemText
          primary={this.getHeading()}
          secondary={
            option.is_convertible
              ? t('booking.waitingUserConfirmation')
              : t('booking.onWaitingList')
          }
        />
        <ListItemSecondaryAction>{this.renderButton()}</ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default translate()(BookingOptionForManager);
