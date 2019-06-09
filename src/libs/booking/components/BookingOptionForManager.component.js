// @flow

import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';

import { formatAsDatetime } from '../../../datetime';

type Props = {
  t: TFunction,
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

export default withNamespaces()(BookingOptionForManager);
