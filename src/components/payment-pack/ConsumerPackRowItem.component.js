// @flow

import React, { Component } from 'react';
import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { formatAsDate } from '../../datetime';

type Props = {
  loading: boolean,
  consumerPack: Object,
  paymentPack: Object,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  t: (x: string) => string,
};

export class ConsumerPackRowItem extends Component<Props> {
  renderRestrictions = () => {
    const { t, paymentPack, consumerPack } = this.props;
    const { bookings_this_week } = consumerPack;
    const { credits, unlimited } = paymentPack;
    const { available_credits } = consumerPack;

    if (unlimited) {
      return (
        <ListItemText
          primary={`${bookings_this_week} ${t(
            'paymentPack.consumer.bookingsThisWeek',
          )}`}
        />
      );
    }
    return (
      <ListItemText
        primary={`${available_credits} / ${credits} ${t(
          'paymentPack.credits',
        ).toLowerCase()}`}
        secondary={`${bookings_this_week} ${t(
          'paymentPack.consumer.bookingsThisWeek',
        )}`}
      />
    );
  };

  renderButton = () => {
    const {
      paymentPack,
      consumerPack,
      incrementCredit,
      decrementCredit,
      loading,
    } = this.props;
    const { credits, unlimited } = paymentPack;
    const { available_credits } = consumerPack;

    if (unlimited) {
      return null;
    }

    if (loading) {
      return (
        <ListItemSecondaryAction>
          <CircularProgress />
        </ListItemSecondaryAction>
      );
    }

    return (
      <ListItemSecondaryAction>
        <IconButton
          aria-label="change-credits"
          disabled={available_credits >= credits}
          color="primary"
          onClick={() => incrementCredit(consumerPack.id)}
        >
          +1
        </IconButton>
        <IconButton
          aria-label="change-credits"
          color="secondary"
          onClick={() => decrementCredit(consumerPack.id)}
        >
          -1
        </IconButton>
      </ListItemSecondaryAction>
    );
  };

  render() {
    const { t, consumerPack } = this.props;
    const { consumer } = consumerPack;
    return (
      <ListItem>
        <Avatar src={consumer.photo} />
        <ListItemText
          primary={`${consumer.first_name} ${consumer.last_name}`}
          secondary={`${t('paymentPack.consumer.expiresOn')}${formatAsDate(
            consumerPack.ending_date,
          )}`}
        />
        {this.renderRestrictions()}
        {this.renderButton()}
      </ListItem>
    );
  }
}

export default translate()(ConsumerPackRowItem);
