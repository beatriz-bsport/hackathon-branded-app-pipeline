// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Moment } from '../../i18n';

import { formatAsDate } from '../../datetime';
import RedButton from '../button/RedButton.component';

type Props = {
  loading: boolean,
  hideConsumer: ?boolean,

  consumerPack: ConsumerPaymentPack,
  paymentPack: PaymentPack,
  button: ?Node,

  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  subscribeToOffer: ?(id: number) => void,

  t: TFunction,
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
      subscribeToOffer,
      loading,
      t,
    } = this.props;
    const { credits, unlimited } = paymentPack;
    const { available_credits } = consumerPack;

    if (subscribeToOffer) {
      return (
        <Button
          onClick={() => subscribeToOffer(consumerPack.id)}
          variant="outlined"
          id={`btn-payment-pack-${consumerPack.id}`}
        >
          {t('paymentPack.subscribeToOffer')}
        </Button>
      );
    }

    if (unlimited) {
      if (consumerPack.disabled) {
        return (
          <Button
            onClick={() => incrementCredit(consumerPack.id)}
            variant="outlined"
          >
            {t('paymentPack.enableConsumer')}
          </Button>
        );
      }
      return (
        <RedButton
          onClick={() => decrementCredit(consumerPack.id)}
          variant="outlined"
        >
          {t('paymentPack.disableConsumer')}
        </RedButton>
      );
    }

    if (!incrementCredit || !decrementCredit) {
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
    const { t, consumerPack, button, hideConsumer, paymentPack } = this.props;
    const { consumer } = consumerPack;
    const isExpired = Moment(consumerPack.ending_date).isBefore(Moment());
    return (
      <ListItem dense divider>
        {hideConsumer ? null : <Avatar src={consumer.photo} />}
        <ListItemText
          primary={
            hideConsumer
              ? paymentPack.name
              : `${consumer.first_name} ${consumer.last_name}`
          }
          secondary={`${t('paymentPack.consumer.expiresOn')}${formatAsDate(
            consumerPack.ending_date,
          )}`}
          secondaryTypographyProps={{ color: isExpired ? 'error' : 'inherit' }}
        />
        {this.renderRestrictions()}
        {button || this.renderButton()}
      </ListItem>
    );
  }
}

export default withNamespaces()(ConsumerPackRowItem);
